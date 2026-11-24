// Local-disk image storage. Files live in UPLOAD_DIR and are served at /media/<path>
// (same URL shape the Django app used, so existing paths keep working).
import { mkdir, writeFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { ApiError } from './validate';

export const UPLOAD_DIR = path.resolve(/*turbopackIgnore: true*/ process.env.UPLOAD_DIR || './uploads');
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export const CONTENT_TYPES = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
  gif: 'image/gif', webp: 'image/webp', avif: 'image/avif',
};

/** DB path ("portfolio/x.jpg") -> public URL ("/media/portfolio/x.jpg"). */
export const mediaUrl = (p) => {
  if (!p) return null;
  if (/^https?:\/\//i.test(p)) return p;
  return `/media/${String(p).replace(/^\/+/, '')}`;
};

/** Detect the real image type from magic bytes (never trust the client's mime/extension). */
function sniffImage(buf) {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg';
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (buf.subarray(0, 4).toString('latin1') === 'GIF8') return 'gif';
  if (buf.subarray(0, 4).toString('latin1') === 'RIFF' && buf.subarray(8, 12).toString('latin1') === 'WEBP') return 'webp';
  if (buf.subarray(4, 8).toString('latin1') === 'ftyp' && /^(avif|avis)$/.test(buf.subarray(8, 12).toString('latin1'))) return 'avif';
  return null;
}

/** Resolve a relative media path safely inside UPLOAD_DIR (null if it escapes). */
export function resolveUploadPath(rel) {
  const full = path.resolve(UPLOAD_DIR, rel);
  return full.startsWith(UPLOAD_DIR + path.sep) ? full : null;
}

export async function saveUpload(file, folder) {
  if (file.size > MAX_UPLOAD_BYTES) throw new ApiError(413, 'Image is too large (max 10 MB).');
  const buf = Buffer.from(await file.arrayBuffer());
  const ext = sniffImage(buf);
  if (!ext) throw new ApiError(400, 'Upload a valid image (JPEG, PNG, WebP, GIF or AVIF).');

  const rel = `${folder}/${randomUUID()}.${ext}`;
  const full = resolveUploadPath(rel);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, buf);
  return rel;
}

export async function removeUpload(rel) {
  if (!rel || /^https?:\/\//i.test(rel)) return;
  const full = resolveUploadPath(rel);
  if (!full) return;
  try { await unlink(full); } catch { /* already gone */ }
}
