import YtDlpWrap from 'yt-dlp-wrap';
import path from 'path';
import fs from 'fs';
import logger from './logger';
import cache from './cache';

// Custom error class for video processing errors
export class VideoProcessingError extends Error {
    constructor(message, code = null) {
        super(message);
        this.name = 'VideoProcessingError';
        this.code = code;
    }
}

const ytDlpWrap = new YtDlpWrap();

/**
 * Validate URL for security and format
 * @param {string} url - URL to validate
 * @throws {VideoProcessingError} If URL is invalid
 */
const validateUrl = (url) => {
    // Check if URL is provided
    if (!url || typeof url !== 'string') {
        logger.warn(`URL validation failed: URL is missing or not a string`, { url });
        throw new VideoProcessingError('URL is required and must be a string', 'MISSING_URL');
    }

    let parsedUrl;
    try {
        // Parse the URL
        parsedUrl = new URL(url);
    } catch (error) {
        logger.warn(`URL validation failed: Invalid URL format`, { url, error: error.message });
        throw new VideoProcessingError('Invalid URL format', 'INVALID_URL_FORMAT');
    }

    // Validate protocol (only http/https allowed)
    const protocol = parsedUrl.protocol.toLowerCase();
    if (protocol !== 'http:' && protocol !== 'https:') {
        logger.warn(`URL validation failed: Unsupported protocol`, { url, protocol });
        throw new VideoProcessingError('Only HTTP and HTTPS protocols are allowed', 'UNSUPPORTED_PROTOCOL');
    }

    // Prevent file:// protocol and other dangerous protocols
    if (protocol === 'file:' || protocol === 'javascript:' || protocol === 'data:') {
        logger.warn(`URL validation failed: Dangerous protocol`, { url, protocol });
        throw new VideoProcessingError('Dangerous protocol detected', 'DANGEROUS_PROTOCOL');
    }

    // Check for localhost and internal IPs
    const hostname = parsedUrl.hostname.toLowerCase();
    
    // Check for localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
        logger.warn(`URL validation failed: Localhost URL not allowed`, { url, hostname });
        throw new VideoProcessingError('Localhost URLs are not allowed', 'LOCALHOST_NOT_ALLOWED');
    }

    // Check for internal IP ranges
    const ipRegex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const ipMatch = hostname.match(ipRegex);
    
    if (ipMatch) {
        const octets = ipMatch.slice(1).map(Number);
        const [a, b] = octets;

        // Check 192.168.x.x
        if (a === 192 && b === 168) {
            logger.warn(`URL validation failed: Internal IP range 192.168.x.x not allowed`, { url, hostname });
            throw new VideoProcessingError('Internal IP addresses are not allowed', 'INTERNAL_IP_NOT_ALLOWED');
        }

        // Check 10.x.x.x
        if (a === 10) {
            logger.warn(`URL validation failed: Internal IP range 10.x.x.x not allowed`, { url, hostname });
            throw new VideoProcessingError('Internal IP addresses are not allowed', 'INTERNAL_IP_NOT_ALLOWED');
        }

        // Check 172.16-31.x.x
        if (a === 172 && b >= 16 && b <= 31) {
            logger.warn(`URL validation failed: Internal IP range 172.16-31.x.x not allowed`, { url, hostname });
            throw new VideoProcessingError('Internal IP addresses are not allowed', 'INTERNAL_IP_NOT_ALLOWED');
        }

        // Validate IP octets (0-255)
        if (octets.some(octet => octet < 0 || octet > 255)) {
            logger.warn(`URL validation failed: Invalid IP address`, { url, hostname });
            throw new VideoProcessingError('Invalid IP address format', 'INVALID_IP');
        }
    }

    // Additional security check: ensure URL is properly formatted
    if (url.length > 2048) {
        logger.warn(`URL validation failed: URL too long`, { url, length: url.length });
        throw new VideoProcessingError('URL is too long', 'URL_TOO_LONG');
    }

    logger.info(`URL validation passed`, { url: url.substring(0, 100) + (url.length > 100 ? '...' : '') });
};

const initializeYtDlp = () => {
    if (process.env.DOCKER_ENV === 'true') {
        // In Docker, yt-dlp is installed globally and should be in the PATH
        ytDlpWrap.setBinaryPath('yt-dlp');
        logger.info('Using system-installed yt-dlp binary.');
        return () => Promise.resolve(); // Return a no-op function for ensureYtDlp
    } else {
        // For local and Vercel, download the binary
        const getBinDir = () => {
            // For Vercel, use a writable directory
            if (process.env.VERCEL) return path.join('/tmp', '.bin');
            // For local, use a project-local directory
            return path.join(process.cwd(), '.bin');
        };

        const binDir = getBinDir();
        const ytDlpPath = path.join(binDir, 'yt-dlp');

        // Ensure the bin directory exists
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
                logger.error('Failed to download yt-dlp binary:', error);
                throw new Error('Could not download yt-dlp binary.');
            }
        };
    }
};

const ensureYtDlp = initializeYtDlp();

export const getDownloadUrl = async (url) => {
    // Validate URL before processing
    validateUrl(url);

    const cacheKey = `download-url:${url}`;
    const cachedUrl = cache.get(cacheKey);

    if (cachedUrl) {
        logger.info(`[CACHE HIT] Found download URL for ${url}`);
        return cachedUrl;
    }

    logger.info(`[CACHE MISS] No download URL found for ${url}. Fetching...`);

    await ensureYtDlp();

    try {
        const metadata = await ytDlpWrap.getVideoInfo(url, ['-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best']);

        // The 'url' property of the metadata object contains the direct download link
        const downloadUrl = metadata.url;

        if (!downloadUrl) {
            logger.error(`Failed to extract download URL for ${url}: No URL in metadata`);
            throw new VideoProcessingError('Could not extract download URL from the provided media.', 'NO_DOWNLOAD_URL');
        }

        logger.info(`Successfully fetched download URL for ${url}`);
        cache.set(cacheKey, downloadUrl);

        return downloadUrl;
    } catch (error) {
        logger.error(`Failed to get download URL for ${url}:`, error);
        
        // Enhanced error handling with specific error types
        if (error.message.includes('Unsupported URL')) {
            throw new VideoProcessingError('The provided URL is not supported by this platform.', 'UNSUPPORTED_URL');
        }
        
        if (error.message.includes('is not a valid URL')) {
            throw new VideoProcessingError('The provided URL is not valid or malformed.', 'INVALID_URL');
        }
        
        if (error.message.includes('Video unavailable')) {
            throw new VideoProcessingError('This video is no longer available.', 'VIDEO_UNAVAILABLE');
        }
        
        if (error.message.includes('private') || error.message.includes('unavailable')) {
            throw new VideoProcessingError('This video is private or restricted.', 'PRIVATE_VIDEO');
        }
        
        if (error.message.includes('authentication') || error.message.includes('login')) {
            throw new VideoProcessingError('Authentication required to access this content.', 'AUTH_REQUIRED');
        }
        
        if (error.message.includes('rate limit') || error.message.includes('429')) {
            throw new VideoProcessingError('Rate limit exceeded. Please try again later.', 'RATE_LIMITED');
        }
        
        if (error.message.includes('geo restricted') || error.message.includes('not available in your country')) {
            throw new VideoProcessingError('This content is not available in your region.', 'GEO_RESTRICTED');
        }
        
        // Generic error for other cases
        throw new VideoProcessingError('Failed to process the URL. It might be a private video, unavailable content, or a platform-specific issue.', 'PROCESSING_FAILED');
    }
};
