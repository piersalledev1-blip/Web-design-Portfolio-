import postgres from "https://deno.land/x/postgresjs@v3.4.5/mod.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-idempotency-key",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const TIME_ZONE = "Africa/Accra";
const GH_PHONE = /^0[235][0-9]{8}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^\d{2}:\d{2}(?::\d{2})?$/;

type BookingFor = "self" | "someone_else";

type ParsedBooking = {
  serviceId: string;
  appointmentDate: string;
  appointmentTime: string;
  startsAtIso: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string | null;
  bookerName: string;
  bookerPhone: string;
  bookerEmail: string | null;
  bookingFor: BookingFor;
  idempotencyKey: string;
};

type DerivedCredentials = {
  bookingReference: string;
  trackingCode: string;
  holdTokenHash: string;
};

class BookingError extends Error {
  status: number;
  code: string;
  originalError?: unknown;

  constructor(code: string, message: string, status = 400) {
    super(message);
    this.name = "BookingError";
    this.code = code;
    this.status = status;
  }
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return toHex(new Uint8Array(digest));
}

async function hmacSha256Hex(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return toHex(new Uint8Array(signature));
}

function idempotencySecret(): string {
  const secret =
    Deno.env.get("BOOKING_IDEMPOTENCY_SECRET") ??
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
    Deno.env.get("SUPABASE_DB_URL");

  if (!secret) {
    throw new BookingError("SERVER_MISCONFIGURED", "Booking service is not configured.", 500);
  }
  return secret;
}

async function deriveCredentials(
  idempotencyKey: string,
  secret: string,
): Promise<DerivedCredentials> {
  const [referenceDigest, trackingDigest, holdDigest] = await Promise.all([
    hmacSha256Hex(`reference:${idempotencyKey}`, secret),
    hmacSha256Hex(`tracking:${idempotencyKey}`, secret),
    hmacSha256Hex(`hold:${idempotencyKey}`, secret),
  ]);

  const t = trackingDigest.slice(0, 32);

  return {
    bookingReference: `KALI-${referenceDigest.slice(0, 8).toUpperCase()}`,
    trackingCode: `${t.slice(0, 8)}-${t.slice(8, 12)}-${t.slice(12, 16)}-${t.slice(16, 20)}-${t.slice(20, 32)}`,
    holdTokenHash: holdDigest,
  };
}

function getTimeZoneOffsetMs(timeZone: string, date: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);

  const values: Record<string, number> = {};
  for (const part of parts) {
    if (part.type !== "literal") values[part.type] = Number(part.value);
  }

  const asUtc = Date.UTC(
    values.year,
    values.month - 1,
    values.day,
    values.hour === 24 ? 0 : values.hour,
    values.minute,
    values.second,
  );

  return asUtc - date.getTime();
}

function zonedLocalToUtc(date: string, time: string, timeZone: string): string {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute, second = 0] = time.split(":").map(Number);
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, second);

  let offset = getTimeZoneOffsetMs(timeZone, new Date(utcGuess));
  let utc = utcGuess - offset;
  offset = getTimeZoneOffsetMs(timeZone, new Date(utc));
  utc = utcGuess - offset;

  return new Date(utc).toISOString();
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new BookingError("INVALID_INPUT", `${field} is required.`, 400);
  }
  return value.trim();
}

function optionalString(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function validateDate(date: string): void {
  if (!DATE.test(date)) {
    throw new BookingError("INVALID_DATE", "Please provide a valid appointment date.", 400);
  }
  const [year, month, day] = date.split("-").map(Number);
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (
    probe.getUTCFullYear() !== year ||
    probe.getUTCMonth() !== month - 1 ||
    probe.getUTCDate() !== day
  ) {
    throw new BookingError("INVALID_DATE", "Please provide a valid appointment date.", 400);
  }
}

function validateTime(time: string): string {
  if (!TIME.test(time)) {
    throw new BookingError("INVALID_TIME", "Please provide a valid appointment time.", 400);
  }
  const [hour, minute, second = 0] = time.split(":").map(Number);
  if (hour > 23 || minute > 59 || second > 59) {
    throw new BookingError("INVALID_TIME", "Please provide a valid appointment time.", 400);
  }
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
}

function parseBookingRequest(value: unknown): ParsedBooking {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new BookingError("INVALID_BODY", "Invalid request body.", 400);
  }

  const body = value as Record<string, unknown>;

  const serviceId = requiredString(body.service_id, "Service").toLowerCase();
  if (!UUID.test(serviceId)) {
    throw new BookingError("INVALID_SERVICE", "Please select a valid service.", 400);
  }

  const idempotencyKey = requiredString(body.idempotency_key, "Idempotency key");
  if (!UUID.test(idempotencyKey)) {
    throw new BookingError("INVALID_IDEMPOTENCY_KEY", "Invalid booking attempt.", 400);
  }

  const appointmentDate = requiredString(body.appointment_date, "Appointment date");
  validateDate(appointmentDate);

  const appointmentTime = validateTime(requiredString(body.appointment_time, "Appointment time"));

  const patientName = requiredString(body.patient_name, "Patient name");
  if (patientName.length < 2 || patientName.length > 120) {
    throw new BookingError("INVALID_PATIENT_NAME", "Please provide a valid patient name.", 400);
  }

  const patientPhone = requiredString(body.patient_phone, "Patient phone");
  if (!GH_PHONE.test(patientPhone)) {
    throw new BookingError("INVALID_PATIENT_PHONE", "Please provide a valid Ghanaian phone number.", 400);
  }

  const patientEmail = optionalString(body.patient_email);
  if (patientEmail && !EMAIL.test(patientEmail)) {
    throw new BookingError("INVALID_PATIENT_EMAIL", "Please provide a valid email address.", 400);
  }

  let bookingFor: BookingFor = "self";
  if (body.booking_for !== undefined) {
    if (body.booking_for !== "self" && body.booking_for !== "someone_else") {
      throw new BookingError("INVALID_BOOKING_FOR", "Invalid booking type.", 400);
    }
    bookingFor = body.booking_for;
  }

  const bookerName = optionalString(body.booker_name) ?? (bookingFor === "self" ? patientName : null);
  const bookerPhone = optionalString(body.booker_phone) ?? (bookingFor === "self" ? patientPhone : null);
  const bookerEmail = optionalString(body.booker_email) ?? (bookingFor === "self" ? patientEmail : null);

  if (!bookerName || bookerName.length < 2 || bookerName.length > 120) {
    throw new BookingError("INVALID_BOOKER_NAME", "Please provide the booker's name.", 400);
  }
  if (!bookerPhone || !GH_PHONE.test(bookerPhone)) {
    throw new BookingError("INVALID_BOOKER_PHONE", "Please provide a valid Ghanaian phone number.", 400);
  }
  if (bookerEmail && !EMAIL.test(bookerEmail)) {
    throw new BookingError("INVALID_BOOKER_EMAIL", "Please provide a valid email address.", 400);
  }

  return {
    serviceId,
    appointmentDate,
    appointmentTime,
    startsAtIso: zonedLocalToUtc(appointmentDate, appointmentTime, TIME_ZONE),
    patientName,
    patientPhone,
    patientEmail,
    bookerName,
    bookerPhone,
    bookerEmail,
    bookingFor,
    idempotencyKey,
  };
}

async function findExistingByReference(query: any, bookingReference: string): Promise<any | null> {
  const rows = await query`
    select
      a.id,
      a.booking_reference,
      a.service_id,
      a.starts_at,
      a.ends_at,
      a.booked_by_phone_local,
      a.status,
      a.total_price,
      a.amount_due_now,
      a.balance_due,
      a.currency,
      a.tracking_code_hash,
      h.expires_at as hold_expires_at
    from public.appointments a
    left join lateral (
      select expires_at
      from public.appointment_holds
      where appointment_id = a.id
      order by created_at desc
      limit 1
    ) h on true
    where a.booking_reference = ${bookingReference}
    limit 1
  `;

  return rows[0] ?? null;
}

async function duplicateResponse(
  existing: any,
  data: ParsedBooking,
  credentials: DerivedCredentials,
): Promise<Record<string, unknown>> {
  const sameService = String(existing.service_id).toLowerCase() === data.serviceId;
  const sameStart = new Date(existing.starts_at).toISOString() === data.startsAtIso;
  const sameBooker = String(existing.booked_by_phone_local) === data.bookerPhone;

  if (!sameService || !sameStart || !sameBooker) {
    throw new BookingError(
      "IDEMPOTENCY_CONFLICT",
      "This booking attempt was already used for a different appointment.",
      409,
    );
  }

  const expectedHash = await sha256Hex(credentials.trackingCode);
  if (String(existing.tracking_code_hash).toLowerCase() !== expectedHash.toLowerCase()) {
    throw new BookingError(
      "TRACKING_CODE_UNAVAILABLE",
      "This booking already exists. Please contact the clinic for assistance.",
      409,
    );
  }

  return {
    success: true,
    duplicate: true,
    appointment_id: existing.id,
    booking_reference: existing.booking_reference,
    tracking_code: credentials.trackingCode,
    amount_due_now: Number(existing.amount_due_now),
    hold_expires_at: existing.hold_expires_at,
    status: existing.status,
    message: "This booking was already created.",
  };
}

function mapReservationError(error: unknown): BookingError {
  const details = error as { code?: string; message?: string } | null;
  const code = details?.code ?? "";
  const message = details?.message ?? "";

  if (
    code === "P0001" ||
    code === "23505" ||
    code === "23P01" ||
    /available|overlap|reserved|conflict|slot/i.test(message)
  ) {
    const bookingError = new BookingError(
      "SLOT_UNAVAILABLE",
      "That time is no longer available. Please choose another time.",
      409,
    );
    bookingError.originalError = error;
    return bookingError;
  }

  const bookingError = new BookingError(
    "RESERVATION_FAILED",
    "We could not reserve that time. Please try again.",
    500,
  );
  bookingError.originalError = error;
  return bookingError;
}

async function createBooking(
  sql: any,
  data: ParsedBooking,
  credentials: DerivedCredentials,
): Promise<Record<string, unknown>> {
  return await sql.begin(async (tx: any) => {
    // Serialize concurrent retries that use the same idempotency key.
    // No appointments.idempotency_key column is required.
    await tx`
      select pg_catalog.pg_advisory_xact_lock(
        pg_catalog.hashtextextended(${credentials.bookingReference}, 0)
      )
    `;

    const existing = await findExistingByReference(tx, credentials.bookingReference);
    if (existing) {
      return await duplicateResponse(existing, data, credentials);
    }

    const serviceRows = await tx`
      select
        id,
        name,
        duration_minutes,
        total_price,
        booking_amount,
        payment_type,
        is_active
      from public.services
      where id = ${data.serviceId}::uuid
        and is_active = true
      limit 1
    `;

    if (serviceRows.length === 0) {
      throw new BookingError("SERVICE_UNAVAILABLE", "That service is not available.", 400);
    }
    const service = serviceRows[0];

    const startsAtMs = Date.parse(data.startsAtIso);
    const durationMinutes = Number(service.duration_minutes);
    if (!Number.isFinite(startsAtMs) || !Number.isFinite(durationMinutes) || durationMinutes <= 0) {
      throw new BookingError("SERVICE_UNAVAILABLE", "That service is not available.", 400);
    }
    const endsAtIso = new Date(startsAtMs + durationMinutes * 60_000).toISOString();

    const settingsRows = await tx`
      select
        booking_horizon_days,
        temporary_hold_minutes,
        cancellation_cutoff_hours
      from public.clinic_settings
      limit 1
    `;

    if (settingsRows.length === 0) {
      throw new BookingError("CLINIC_SETTINGS_MISSING", "Booking is temporarily unavailable.", 500);
    }

    const settings = settingsRows[0];
    const horizonDays = Number(settings.booking_horizon_days ?? 8);
    const holdMinutes = Number(settings.temporary_hold_minutes ?? 5);
    const cutoffHours = Number(settings.cancellation_cutoff_hours ?? 24);

    if (!Number.isFinite(horizonDays) || horizonDays <= 0) {
      throw new BookingError("CLINIC_SETTINGS_INVALID", "Booking is temporarily unavailable.", 500);
    }
    if (!Number.isFinite(holdMinutes) || holdMinutes <= 0) {
      throw new BookingError("CLINIC_SETTINGS_INVALID", "Booking is temporarily unavailable.", 500);
    }
    if (!Number.isFinite(cutoffHours) || cutoffHours < 0) {
      throw new BookingError("CLINIC_SETTINGS_INVALID", "Booking is temporarily unavailable.", 500);
    }

    const now = Date.now();
    if (startsAtMs <= now) {
      throw new BookingError(
        "APPOINTMENT_IN_PAST",
        "Please choose an appointment time in the future.",
        400,
      );
    }
    if (startsAtMs > now + horizonDays * 86_400_000) {
      throw new BookingError(
        "OUTSIDE_BOOKING_HORIZON",
        `Appointments can only be booked up to ${horizonDays} days ahead.`,
        400,
      );
    }

    // The private functions are schema-qualified and called over the direct
    // Postgres connection. They are not exposed through PostgREST.
    try {
      await tx`select private.release_expired_holds()`;
    } catch (error) {
      const bookingError = new BookingError(
        "HOLD_RELEASE_FAILED",
        "Booking is temporarily unavailable. Please try again.",
        500,
      );
      bookingError.originalError = error;
      throw bookingError;
    }

    let hold: any;
    try {
      const holdRows = await tx`
        select hold_id, expires_at
        from private.reserve_appointment_slot(
          ${data.serviceId}::uuid,
          ${data.startsAtIso}::timestamptz,
          ${endsAtIso}::timestamptz,
          ${credentials.holdTokenHash},
          ${holdMinutes}
        )
      `;

      if (holdRows.length === 0) {
        throw new BookingError(
          "SLOT_UNAVAILABLE",
          "That time is no longer available. Please choose another time.",
          409,
        );
      }
      hold = holdRows[0];
    } catch (error) {
      if (error instanceof BookingError) throw error;
      throw mapReservationError(error);
    }

    if (!hold?.hold_id || !hold?.expires_at) {
      throw new BookingError(
        "RESERVATION_FAILED",
        "That time is no longer available. Please choose another time.",
        409,
      );
    }

    const holdExpiresMs = new Date(hold.expires_at).getTime();
    if (!Number.isFinite(holdExpiresMs) || holdExpiresMs <= Date.now()) {
      throw new BookingError(
        "RESERVATION_FAILED",
        "That time is no longer available. Please choose another time.",
        409,
      );
    }

    // Serialize patient upserts for the same phone number without relying on
    // an undocumented unique constraint on patients.phone_local.
    await tx`
      select pg_catalog.pg_advisory_xact_lock(
        pg_catalog.hashtextextended(${data.patientPhone}, 1)
      )
    `;

    const existingPatients = await tx`
      select id
      from public.patients
      where phone_local = ${data.patientPhone}
      limit 1
    `;

    let patientId: string;
    if (existingPatients.length > 0) {
      patientId = existingPatients[0].id;
      await tx`
        update public.patients
        set
          full_name = ${data.patientName},
          email = coalesce(${data.patientEmail}, email)
        where id = ${patientId}::uuid
      `;
    } else {
      const insertedPatients = await tx`
        insert into public.patients (full_name, phone_local, email)
        values (${data.patientName}, ${data.patientPhone}, ${data.patientEmail})
        returning id
      `;
      patientId = insertedPatients[0].id;
    }

    const trackingCodeHash = await sha256Hex(credentials.trackingCode);
    const balanceDue = Number(service.total_price) - Number(service.booking_amount);
    const cancellationDeadlineAt = new Date(
      startsAtMs - cutoffHours * 3_600_000,
    ).toISOString();

    const appointmentRows = await tx`
      insert into public.appointments (
        booking_reference,
        tracking_code_hash,
        service_id,
        patient_id,
        booked_by_name,
        booked_by_phone_local,
        booked_by_email,
        booking_for,
        starts_at,
        ends_at,
        status,
        total_price,
        amount_due_now,
        balance_due,
        currency,
        payment_deadline_at,
        cancellation_deadline_at,
        created_by_staff
      ) values (
        ${credentials.bookingReference},
        ${trackingCodeHash},
        ${service.id}::uuid,
        ${patientId}::uuid,
        ${data.bookerName},
        ${data.bookerPhone},
        ${data.bookerEmail},
        ${data.bookingFor},
        ${data.startsAtIso}::timestamptz,
        ${endsAtIso}::timestamptz,
        'pending_payment',
        ${service.total_price},
        ${service.booking_amount},
        ${balanceDue},
        'GHS',
        ${hold.expires_at}::timestamptz,
        ${cancellationDeadlineAt}::timestamptz,
        false
      )
      returning id, booking_reference, amount_due_now, status
    `;

    if (appointmentRows.length === 0) {
      throw new BookingError(
        "APPOINTMENT_CREATE_FAILED",
        "We could not create your booking. Please try again.",
        500,
      );
    }
    const appointment = appointmentRows[0];

    // Link only our own hold. If this fails, the whole transaction rolls back,
    // including the reservation, so no live orphan hold is left behind.
    const linkedHolds = await tx`
      update public.appointment_holds
      set appointment_id = ${appointment.id}::uuid
      where id = ${hold.hold_id}::uuid
        and appointment_id is null
        and hold_token_hash = ${credentials.holdTokenHash}
      returning id
    `;

    if (linkedHolds.length !== 1) {
      throw new BookingError(
        "HOLD_LINK_FAILED",
        "We could not secure your appointment. Please try again.",
        500,
      );
    }

    return {
      success: true,
      duplicate: false,
      appointment_id: appointment.id,
      booking_reference: appointment.booking_reference,
      tracking_code: credentials.trackingCode,
      amount_due_now: Number(appointment.amount_due_now),
      hold_expires_at: hold.expires_at,
      status: appointment.status,
    };
  });
}

function logSanitizedError(requestId: string, error: unknown): void {
  const details = error as { name?: string; code?: string; message?: string; constraint?: string } | null;
  console.error(`[create-booking:${requestId}]`, {
    name: details?.name,
    code: details?.code,
    message: details?.message,
    constraint: details?.constraint,
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ success: false, error: "Method not allowed", code: "METHOD_NOT_ALLOWED" }, 405);
  }

  const requestId = crypto.randomUUID();
  let sql: any = null;
  let data: ParsedBooking | null = null;
  let credentials: DerivedCredentials | null = null;

  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      throw new BookingError("INVALID_JSON", "Invalid request body.", 400);
    }

    data = parseBookingRequest(body);

    const secret = idempotencySecret();
    credentials = await deriveCredentials(data.idempotencyKey, secret);

    const databaseUrl = Deno.env.get("SUPABASE_DB_URL");
    if (!databaseUrl) {
      throw new BookingError("SERVER_MISCONFIGURED", "Booking service is not configured.", 500);
    }

    sql = postgres(databaseUrl, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
    });

    const result = await createBooking(sql, data, credentials);
    return json(result, 200);
  } catch (error) {
    // If a concurrent retry won the race, return its booking instead of an error.
    if (sql && credentials && data) {
      try {
        const existing = await findExistingByReference(sql, credentials.bookingReference);
        if (existing) {
          return json(await duplicateResponse(existing, data, credentials), 200);
        }
      } catch (lookupError) {
        logSanitizedError(requestId, lookupError);
      }
    }

    if (error instanceof BookingError) {
      if (error.originalError) logSanitizedError(requestId, error.originalError);
      return json({ success: false, error: error.message, code: error.code }, error.status);
    }

    logSanitizedError(requestId, error);
    return json(
      {
        success: false,
        error: "We could not create your booking. Please try again.",
        code: "BOOKING_FAILED",
      },
      500,
    );
  } finally {
    if (sql) {
      try {
        await sql.end({ timeout: 5 });
      } catch {
        // Ignore connection shutdown errors.
      }
    }
  }
});
