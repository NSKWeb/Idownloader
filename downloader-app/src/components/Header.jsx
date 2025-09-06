'use client';

import { useState } from 'react';
import Link from 'next/link';
import ThemeToggleButton from './ThemeToggleButton';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-md border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
          Multi-Platform Downloader
        </Link>

        <div className="flex items-center space-x-4">
          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
            <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400">About Us</Link>
            <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400">Contact Us</Link>
            <Link href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400">Blog</Link>
          </nav>

          <ThemeToggleButton />

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-900 dark:text-white focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="md:hidden bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <Link href="/" className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link href="/about" className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>About Us</Link>
          <Link href="/contact" className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
          <Link href="/blog" className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setIsMenuOpen(false)}>Blog</Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
