import YtDlpWrap from 'yt-dlp-wrap';
import path from 'path';
import fs from 'fs';
import logger from './logger';
import cache from './cache';

export class VideoProcessingError extends Error {
  constructor(message, { code = 'VIDEO_PROCESSING_ERROR', status = 400, cause } = {}) {
    super(message);
    this.name = 'VideoProcessingError';
    this.code = code;
    this.status = status;
    this.cause = cause;
  }
}

const ytDlpWrap = new YtDlpWrap();

const httpUrlPattern =
  typeof URLPattern !== 'undefined'
    ? new URLPattern({ protocol: 'http', hostname: '*', pathname: '*', search: '*', hash: '*' })
    : null;

const httpsUrlPattern =
  typeof URLPattern !== 'undefined'
    ? new URLPattern({ protocol: 'https', hostname: '*', pathname: '*', search: '*', hash: '*' })
    : null;

const isLocalOrPrivateHostname = (hostname) => {
  const lower = hostname.toLowerCase();

  if (lower === 'localhost' || lower.endsWith('.localhost')) return true;
  if (lower === '0.0.0.0') return true;
  if (lower === '::1') return true;

  const ipv4Parts = lower.split('.');
  if (ipv4Parts.length !== 4) return false;

  const nums = ipv4Parts.map((p) => Number(p));
  if (nums.some((n) => Number.isNaN(n) || n < 0 || n > 255)) return false;

  const [a, b] = nums;

  if (a === 127) return true;
  if (a === 10) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;

  return false;
};

const validateInputUrl = (inputUrl) => {
  if (typeof inputUrl !== 'string') {
    logger.warn('[VALIDATION] URL must be a string', { inputUrlType: typeof inputUrl });
    throw new VideoProcessingError('URL must be a string.', { code: 'INVALID_URL' });
  }

  const trimmed = inputUrl.trim();
  if (!trimmed) {
    logger.warn('[VALIDATION] URL is empty');
    throw new VideoProcessingError('URL is required.', { code: 'INVALID_URL' });
  }

  if (httpUrlPattern && httpsUrlPattern && !httpUrlPattern.test(trimmed) && !httpsUrlPattern.test(trimmed)) {
    logger.warn('[VALIDATION] URLPattern validation failed', { url: trimmed });
    throw new VideoProcessingError('The provided URL is not valid.', { code: 'INVALID_URL' });
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch (error) {
    logger.warn('[VALIDATION] URL parsing failed', {
      url: trimmed,
      error: error instanceof Error ? error.message : String(error),
    });
    throw new VideoProcessingError('The provided URL is not valid.', { code: 'INVALID_URL' });
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    logger.warn('[VALIDATION] Disallowed URL protocol', { url: trimmed, protocol: parsed.protocol });
    throw new VideoProcessingError('Only http and https URLs are allowed.', { code: 'INVALID_URL_PROTOCOL' });
  }

  if (isLocalOrPrivateHostname(parsed.hostname)) {
    logger.warn('[VALIDATION] Blocked localhost/private hostname', { url: trimmed, hostname: parsed.hostname });
    throw new VideoProcessingError('The provided URL hostname is not allowed.', { code: 'BLOCKED_HOSTNAME' });
  }

  return parsed.href;
};

const serializeError = (error) => {
  if (error instanceof Error) {
    const base = { name: error.name, message: error.message, stack: error.stack };

    if ('stderr' in error && typeof error.stderr === 'string') base.stderr = error.stderr;
    if ('stdout' in error && typeof error.stdout === 'string') base.stdout = error.stdout;
    if ('exitCode' in error && typeof error.exitCode === 'number') base.exitCode = error.exitCode;
    if ('code' in error && typeof error.code !== 'undefined') base.code = error.code;

    return base;
  }

  return { error };
};

const getErrorText = (error) => {
  if (!error) return '';
  if (typeof error === 'string') return error;

  const parts = [];
  if (error instanceof Error && error.message) parts.push(error.message);
  if (typeof error.stderr === 'string') parts.push(error.stderr);
  if (typeof error.stdout === 'string') parts.push(error.stdout);

  return parts.join('\n');
};

const mapYtDlpError = (error) => {
  const text = getErrorText(error).toLowerCase();

  if (
    text.includes('http error 429') ||
    text.includes('too many requests') ||
    text.includes('rate limit') ||
    text.includes('status code: 429')
  ) {
    return new VideoProcessingError('The platform is rate limiting requests. Please wait and try again.', {
      code: 'UPSTREAM_RATE_LIMITED',
      status: 429,
      cause: error,
    });
  }

  if (text.includes('private video') || text.includes('this video is private')) {
    return new VideoProcessingError('This video is private and cannot be downloaded.', {
      code: 'PRIVATE_VIDEO',
      status: 403,
      cause: error,
    });
  }

  if (
    text.includes('sign in') ||
    text.includes('login required') ||
    text.includes('requires authentication') ||
    text.includes('cookies are required') ||
    text.includes('age-restricted')
  ) {
    return new VideoProcessingError('This content requires authentication and cannot be downloaded.', {
      code: 'AUTH_REQUIRED',
      status: 403,
      cause: error,
    });
  }

  if (
    text.includes('video unavailable') ||
    text.includes("this video isn't available") ||
    text.includes('this video is unavailable') ||
    text.includes('404')
  ) {
    return new VideoProcessingError('This video is unavailable or has been removed.', {
      code: 'VIDEO_UNAVAILABLE',
      status: 404,
      cause: error,
    });
  }

  if (text.includes('unsupported url')) {
    return new VideoProcessingError('The provided URL is not supported.', {
      code: 'UNSUPPORTED_URL',
      status: 400,
      cause: error,
    });
  }

  return new VideoProcessingError('Failed to process the URL. Please verify the link and try again.', {
    code: 'PROCESSING_FAILED',
    status: 502,
    cause: error,
  });
};

const initializeYtDlp = () => {
  if (process.env.DOCKER_ENV === 'true') {
    ytDlpWrap.setBinaryPath('yt-dlp');
    logger.info('Using system-installed yt-dlp binary.');
    return () => Promise.resolve();
  }

  const getBinDir = () => {
    if (process.env.VERCEL) return path.join('/tmp', '.bin');
    return path.join(process.cwd(), '.bin');
  };

  const binDir = getBinDir();
  const ytDlpPath = path.join(binDir, 'yt-dlp');

  if (!fs.existsSync(binDir)) {
    fs.mkdirSync(binDir, { recursive: true });
  }

  ytDlpWrap.setBinaryPath(ytDlpPath);

  let isYtDlpDownloaded = false;
  return async () => {
    if (isYtDlpDownloaded) return;
    try {
      logger.info(`Downloading yt-dlp binary to ${ytDlpPath}`);
      await YtDlpWrap.downloadFromGithub(ytDlpPath);
      isYtDlpDownloaded = true;
      logger.info('yt-dlp binary downloaded successfully.');
    } catch (error) {
      logger.error('Failed to download yt-dlp binary.', serializeError(error));
      throw new Error('Could not download yt-dlp binary.');
    }
  };
};

const ensureYtDlp = initializeYtDlp();

export const getDownloadUrl = async (inputUrl) => {
  const url = validateInputUrl(inputUrl);

  const cacheKey = `download-url:${url}`;
  const cachedUrl = cache.get(cacheKey);

  if (cachedUrl) {
    logger.info(`[CACHE HIT] Found download URL for ${url}`);
    return cachedUrl;
  }

  logger.info(`[CACHE MISS] No download URL found for ${url}. Fetching...`);

  await ensureYtDlp();

  try {
    const metadata = await ytDlpWrap.getVideoInfo(url, [
      '-f',
      'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
    ]);

    const downloadUrl = metadata?.url;

    if (!downloadUrl) {
      throw new VideoProcessingError('Could not extract a downloadable URL from the provided link.', {
        code: 'NO_DOWNLOAD_URL',
        status: 502,
      });
    }

    logger.info(`Successfully fetched download URL for ${url}`);
    cache.set(cacheKey, downloadUrl);

    return downloadUrl;
  } catch (error) {
    if (error instanceof VideoProcessingError) {
      logger.warn('Video processing error.', {
        url,
        code: error.code,
        status: error.status,
        message: error.message,
      });
      throw error;
    }

    logger.error(`Failed to get download URL for ${url}.`, {
      url,
      error: serializeError(error),
    });

    throw mapYtDlpError(error);
  }
};
