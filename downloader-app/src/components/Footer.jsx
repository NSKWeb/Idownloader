import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 mt-auto border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-6 text-center">
        <div className="flex justify-center space-x-6 mb-4">
          <Link href="/privacy-policy" className="hover:text-gray-900 dark:hover:text-white">Privacy Policy</Link>
          <Link href="/terms-of-service" className="hover:text-gray-900 dark:hover:text-white">Terms of Service</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} Multi-Platform Downloader. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
