// Small request-validation toolkit + error handling for route handlers.

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const isBlank = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');

export const S = {
  str:     (o = {}) => ({ type: 'str', max: 255, ...o }),
  email:   (o = {}) => ({ type: 'email', max: 254, ...o }),
  int:     (o = {}) => ({ type: 'int', ...o }),
  money:   (o = {}) => ({ type: 'money', ...o }),
  bool:    (o = {}) => ({ type: 'bool', ...o }),
  oneOf:   (values, o = {}) => ({ type: 'enum', values, ...o }),
  date:    (o = {}) => ({ type: 'date', ...o }),
  time:    (o = {}) => ({ type: 'time', ...o }),
  /** Foreign-key id. `as` renames the API key to the DB column (e.g. category -> category_id). */
  fk:      (o = {}) => ({ type: 'int', min: 1, ...o }),
};

function coerce(v, r) {
  // Blank handling is shared by every type.
  if (isBlank(v)) {
    if (r.type === 'bool') return r.default ?? false;
    if (r.nullable) return null;
    if (r.required) throw new Error('This field is required.');
    if ('default' in r) return r.default;
    if (r.type === 'str' || r.type === 'email') return '';
    throw new Error('This field is required.');
  }

  switch (r.type) {
    case 'str':
    case 'email': {
      const s = String(v).trim();
      if (s.length > (r.max ?? 255)) throw new Error(`Ensure this field has no more than ${r.max ?? 255} characters.`);
      if (r.type === 'email' && !EMAIL_RE.test(s)) throw new Error('Enter a valid email address.');
      return s;
    }
    case 'int': {
      const s = String(v).trim();
      if (!/^-?\d+$/.test(s)) throw new Error('A valid integer is required.');
      const n = Number(s);
      if (r.min !== undefined && n < r.min) throw new Error(`Ensure this value is at least ${r.min}.`);
      if (r.max !== undefined && n > r.max) throw new Error(`Ensure this value is at most ${r.max}.`);
      return n;
    }
    case 'money': {
      const s = String(v).trim();
      if (!/^\d{1,8}(\.\d{1,2})?$/.test(s)) throw new Error('Enter a valid amount (up to 2 decimal places).');
      return s;
    }
    case 'bool': {
      if (v === true || v === 'true' || v === '1' || v === 1 || v === 'on') return true;
      if (v === false || v === 'false' || v === '0' || v === 0 || v === 'off') return false;
      throw new Error('Must be a valid boolean.');
    }
    case 'enum': {
      if (!r.values.includes(v)) throw new Error(`Must be one of: ${r.values.join(', ')}.`);
      return v;
    }
    case 'date': {
      const s = String(v).trim();
      const d = new Date(`${s}T00:00:00Z`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== s) {
        throw new Error('Date has wrong format. Use YYYY-MM-DD.');
      }
      return s;
    }
    case 'time': {
      const s = String(v).trim();
      const m = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(s);
      if (!m || +m[1] > 23 || +m[2] > 59 || +(m[3] ?? 0) > 59) throw new Error('Time has wrong format. Use HH:MM.');
      return s;
    }
    default:
      throw new Error(`Unknown field type ${r.type}`);
  }
}

/**
 * Validate `input` against `schema`. With `partial`, absent keys are skipped (PATCH).
 * Returns an object keyed by DB column names. Throws ApiError(400) on failure.
 */
export function parse(input, schema, { partial = false } = {}) {
  const data = {};
  const errors = {};

  for (const [key, rule] of Object.entries(schema)) {
    const column = rule.as ?? key;
    const present = Object.prototype.hasOwnProperty.call(input, key);

    if (!present) {
      if (partial) continue;
      if (rule.required) errors[key] = 'This field is required.';
      else if ('default' in rule) data[column] = rule.default;
      else if (rule.nullable) data[column] = null;
      continue;
    }

    try {
      data[column] = coerce(input[key], rule);
    } catch (e) {
      errors[key] = e.message;
    }
  }

  const keys = Object.keys(errors);
  if (keys.length) {
    throw new ApiError(400, `${keys[0]}: ${errors[keys[0]]}`, errors);
  }
  return data;
}

export const parseId = (raw) => {
  if (!/^\d+$/.test(String(raw))) throw new ApiError(404, 'Not found.');
  return Number(raw);
};

/** Reads a JSON or multipart/form-data body into { fields, files }. */
export async function readBody(req) {
  const type = req.headers.get('content-type') || '';
  if (type.includes('multipart/form-data') || type.includes('application/x-www-form-urlencoded')) {
    let form;
    try { form = await req.formData(); } catch { throw new ApiError(400, 'Malformed form data.'); }
    const fields = {};
    const files = {};
    for (const [k, v] of form.entries()) {
      if (typeof v === 'string') fields[k] = v;
      else if (v.size > 0) files[k] = v;
    }
    return { fields, files };
  }
  try {
    const json = await req.json();
    if (json && typeof json === 'object' && !Array.isArray(json)) return { fields: json, files: {} };
  } catch { /* fall through */ }
  throw new ApiError(400, 'Request body must be a JSON object or form data.');
}

export const json = (data, status = 200) => Response.json(data, { status });

/** Wraps a route handler so thrown errors become tidy JSON responses. */
export const handle = (fn) => async (req, ctx) => {
  try {
    return await fn(req, ctx);
  } catch (e) {
    if (e instanceof ApiError) return json({ error: e.message, details: e.details }, e.status);
    const code = e?.code ?? e?.cause?.code;
    if (code === '23505') return json({ error: 'A record with this value already exists.' }, 409);
    if (code === '23503') return json({ error: 'This record references (or is referenced by) something that does not exist.' }, 400);
    console.error('[api]', e);
    return json({ error: 'Internal server error.' }, 500);
  }
};
