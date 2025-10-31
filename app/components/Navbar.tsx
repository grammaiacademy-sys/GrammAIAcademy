'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useAuth } from 'cosmic-authentication';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, signIn, signOut, loading } = useAuth();

  const navigationItems = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/#features' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'About', href: '/#about' }];


  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-100 ${
        isMenuOpen ? 'bg-white/95' : ''}`
        }>

        <div data-editor-id="app/components/Navbar.tsx:30:9" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-editor-id="app/components/Navbar.tsx:31:11" className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div data-editor-id="app/components/Navbar.tsx:34:15" className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Icon icon="material-symbols:water" className="text-white text-lg" />
              </div>
              <span data-editor-id="app/components/Navbar.tsx:37:15" className="text-xl font-medium text-gray-900">RestorePro</span>
            </Link>

            {/* Desktop Navigation */}
            <div data-editor-id="app/components/Navbar.tsx:41:13" className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) =>
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">

                  {item.label}
                </Link>
              )}
            </div>

            {/* Desktop Auth Buttons */}
            <div data-editor-id="app/components/Navbar.tsx:54:13" className="hidden md:flex items-center space-x-4">
              {loading ?
              <div data-editor-id="app/components/Navbar.tsx:56:17" className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /> :
              isAuthenticated ?
              <div data-editor-id="app/components/Navbar.tsx:58:17" className="flex items-center space-x-4">
                  <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">

                    Dashboard
                  </Link>
                  <div data-editor-id="app/components/Navbar.tsx:65:19" className="flex items-center space-x-2">
                    <span data-editor-id="app/components/Navbar.tsx:66:21" className="text-sm text-gray-600">
                      {user?.displayName || user?.email}
                    </span>
                    <button data-editor-id="app/components/Navbar.tsx:69:21"
                  onClick={signOut}
                  className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">

                      Sign Out
                    </button>
                  </div>
                </div> :

              <div data-editor-id="app/components/Navbar.tsx:78:17" className="flex items-center space-x-4">
                  <button data-editor-id="app/components/Navbar.tsx:79:19"
                onClick={signIn}
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">

                    Sign In
                  </button>
                  <button data-editor-id="app/components/Navbar.tsx:85:19"
                onClick={signIn}
                className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">

                    Get Started
                  </button>
                </div>
              }
            </div>

            {/* Mobile Menu Button */}
            <button data-editor-id="app/components/Navbar.tsx:96:13"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-blue-600">

              <Icon
                icon={isMenuOpen ? 'material-symbols:close' : 'material-symbols:menu'}
                className="text-xl" />

            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen &&
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-blue-100">

              <div data-editor-id="app/components/Navbar.tsx:118:15" className="px-4 py-4 space-y-4">
                {navigationItems.map((item) =>
              <Link
                key={item.label}
                href={item.href}
                className="block text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}>

                    {item.label}
                  </Link>
              )}
                
                <div data-editor-id="app/components/Navbar.tsx:130:17" className="border-t border-gray-200 pt-4">
                  {loading ?
                <div data-editor-id="app/components/Navbar.tsx:132:21" className="flex justify-center">
                      <div data-editor-id="app/components/Navbar.tsx:133:23" className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div> :
                isAuthenticated ?
                <div data-editor-id="app/components/Navbar.tsx:136:21" className="space-y-4">
                      <Link
                    href="/dashboard"
                    className="block w-full text-center bg-blue-600 text-white px-4 py-3 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}>

                        Dashboard
                      </Link>
                      <div data-editor-id="app/components/Navbar.tsx:144:23" className="text-center">
                        <span data-editor-id="app/components/Navbar.tsx:145:25" className="text-sm text-gray-600">
                          {user?.displayName || user?.email}
                        </span>
                        <button data-editor-id="app/components/Navbar.tsx:148:25"
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full mt-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors">

                          Sign Out
                        </button>
                      </div>
                    </div> :

                <div data-editor-id="app/components/Navbar.tsx:160:21" className="space-y-3">
                      <button data-editor-id="app/components/Navbar.tsx:161:23"
                  onClick={() => {
                    signIn();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-center border border-blue-200 text-blue-600 px-4 py-3 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors">

                        Sign In
                      </button>
                      <button data-editor-id="app/components/Navbar.tsx:170:23"
                  onClick={() => {
                    signIn();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-center bg-blue-600 text-white px-4 py-3 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">

                        Get Started
                      </button>
                    </div>
                }
                </div>
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </motion.nav>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div data-editor-id="app/components/Navbar.tsx:189:7" className="h-16" />
    </>);

}