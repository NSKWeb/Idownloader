import YtDlpWrap from 'yt-dlp-wrap';
import path from 'path';
import fs from 'fs';
import logger from './logger';
import cache from './cache';

const ytDlpWrap = new YtDlpWrap();

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
            throw new Error('Could not extract download URL.');
        }

        logger.info(`Successfully fetched download URL for ${url}`);
        cache.set(cacheKey, downloadUrl);

        return downloadUrl;
    } catch (error) {
        logger.error(`Failed to get download URL for ${url}:`, error);
        // Check for common errors to provide better messages
        if (error.message.includes('Unsupported URL')) {
            throw new Error('The provided URL is not supported.');
        }
        if (error.message.includes('is not a valid URL')) {
            throw new Error('The provided URL is not valid.');
        }
        throw new Error('Failed to process the URL. It might be a private video or a platform issue.');
    }
};
