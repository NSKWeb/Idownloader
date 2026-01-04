import { NextResponse } from 'next/server';
import logger from './logger';
import { getDownloadUrl, VideoProcessingError } from './downloader';
import { rateLimitByIp } from './rateLimit';

const jsonError = (status, code, message, headers) => {
  return NextResponse.json(
    { success: false, code, error: message },
    { status, headers }
  );
};

const isApplicationJson = (contentType) => {
  if (!contentType) return false;
  return contentType.toLowerCase().startsWith('application/json');
};

export const handleDownloadPost = async (request) => {
  const rate = rateLimitByIp(request);
  if (!rate.success) {
    return jsonError(
      429,
      'RATE_LIMITED',
      'Too many requests. Please try again later.',
      { 'Retry-After': String(rate.retryAfterSeconds) }
    );
  }

  const contentType = request.headers.get('content-type');
  if (!isApplicationJson(contentType)) {
    logger.warn('[API] Invalid content-type for request', {
      contentType,
      path: new URL(request.url).pathname,
    });

    return jsonError(
      400,
      'INVALID_CONTENT_TYPE',
      'Content-Type must be application/json.'
    );
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    logger.warn('[API] Failed to parse JSON body', {
      path: new URL(request.url).pathname,
      error: error instanceof Error ? { message: error.message } : { error },
    });

    return jsonError(400, 'INVALID_JSON', 'Invalid JSON body.');
  }

  const url = typeof body?.url === 'string' ? body.url.trim() : '';
  if (!url) {
    return jsonError(400, 'MISSING_URL', 'URL is required.');
  }

  try {
    const downloadUrl = await getDownloadUrl(url);

    return NextResponse.json({ success: true, downloadUrl });
  } catch (error) {
    if (error instanceof VideoProcessingError) {
      logger.warn('[API] Video processing error', {
        code: error.code,
        status: error.status,
        path: new URL(request.url).pathname,
        message: error.message,
      });

      return jsonError(error.status, error.code, error.message);
    }

    logger.error('[API] Unexpected error', {
      path: new URL(request.url).pathname,
      error:
        error instanceof Error
          ? { name: error.name, message: error.message, stack: error.stack }
          : { error },
    });

    return jsonError(500, 'INTERNAL_ERROR', 'An unexpected error occurred.');
  }
};
