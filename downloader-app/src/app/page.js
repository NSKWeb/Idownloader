'use client';

import { useState } from 'react';
import Toast from '@/components/Toast';

const platforms = [
  'youtube',
  'instagram',
  'facebook',
  'tiktok',
  'twitter',
  'pinterest',
  'linkedin',
  'reddit',
  'snapchat',
  'threads',
  'vimeo',
  'dailymotion',
  'tumblr',
  'ifunny',
  'moj',
  'likee',
  'kwai',
  'soundcloud',
  'imgur',
  'sharechat',
];

const isSafeHttpUrl = (value) => {
  if (typeof value !== 'string') return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState(platforms[0]);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setDownloadUrl('');

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setError('Please enter a URL.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/${platform}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: trimmedUrl }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        setError('The server returned an invalid response. Please try again later.');
        return;
      }

      if (data.success) {
        if (!isSafeHttpUrl(data.downloadUrl)) {
          setError('The server returned an invalid download URL. Please try again.');
          return;
        }

        setDownloadUrl(data.downloadUrl);
      } else {
        setError(data.error || 'An unknown error occurred.');
      }
    } catch {
      setError('Failed to connect to the server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!isSafeHttpUrl(downloadUrl)) {
      showToast('Nothing to copy.', 'error');
      return;
    }

    try {
      await navigator.clipboard.writeText(downloadUrl);
      showToast('Copied!', 'success');
    } catch {
      showToast('Failed to copy.', 'error');
    }
  };

  const safeDownloadUrl = isSafeHttpUrl(downloadUrl) ? downloadUrl : '';

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Toast
        message={toast?.message}
        type={toast?.type}
        onClose={() => setToast(null)}
      />

      <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-lg p-8 border border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Multi-Platform Downloader
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          Download videos and audio from over 20 supported platforms, for free.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500 capitalize md:flex-grow-0"
            >
              {platforms.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <input
              type="url"
              placeholder="Paste your video URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:bg-gray-500"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Download'}
          </button>
        </form>
      </div>

      {error && (
        <div className="mt-6 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg text-center">
          <p>{error}</p>
        </div>
      )}

      {safeDownloadUrl && (
        <div className="mt-6 bg-white dark:bg-gray-900 shadow-2xl rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Your Download is Ready!
          </h2>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input
              type="text"
              value={safeDownloadUrl}
              readOnly
              className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-md px-4 py-2 w-full"
            />
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={handleCopyToClipboard}
                className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
              >
                Copy
              </button>
              <a
                href={safeDownloadUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 text-center"
              >
                Download Now
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
