'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Search Demo', href: '/dashboard' }],

    Company: [
    { label: 'About', href: '/#about' },
    { label: 'Contact', href: 'mailto:support@restorepro.com' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' }],

    Support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Documentation', href: '/docs' },
    { label: 'Email Support', href: 'mailto:support@restorepro.com' }]

  };

  return (
    <footer data-editor-id="app/components/Footer.tsx:30:5" className="bg-gray-900 text-white">
      <div data-editor-id="app/components/Footer.tsx:31:7" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div data-editor-id="app/components/Footer.tsx:32:9" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div data-editor-id="app/components/Footer.tsx:34:11" className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}>

              <div data-editor-id="app/components/Footer.tsx:41:15" className="flex items-center space-x-2 mb-4">
                <div data-editor-id="app/components/Footer.tsx:42:17" className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Icon icon="material-symbols:water" className="text-white text-lg" />
                </div>
                <span data-editor-id="app/components/Footer.tsx:45:17" className="text-xl font-medium">RestorePro</span>
              </div>
              
              <p data-editor-id="app/components/Footer.tsx:48:15" className="text-gray-300 mb-6 max-w-md">
                <span data-editor-id="app/components/Footer.tsx:49:17">AI-powered smart search for Xactimate line items. Built by restoration professionals, for restoration professionals.</span>
              </p>
              
              <div data-editor-id="app/components/Footer.tsx:52:15" className="flex space-x-4">
                {[
                { icon: 'mdi:twitter', href: '#', label: 'Twitter' },
                { icon: 'mdi:linkedin', href: '#', label: 'LinkedIn' },
                { icon: 'mdi:facebook', href: '#', label: 'Facebook' }].
                map((social) =>
                <a data-editor-id="app/components/Footer.tsx:58:19"
                key={social.label}
                href={social.href}
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
                aria-label={social.label}>

                    <Icon icon={social.icon} className="text-lg" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links], index) =>
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}>

              <h3 data-editor-id="app/components/Footer.tsx:80:15" className="font-medium text-white mb-4">
                <span data-editor-id="app/components/Footer.tsx:81:17">{category}</span>
              </h3>
              <ul data-editor-id="app/components/Footer.tsx:83:15" className="space-y-3">
                {links.map((link) =>
              <li data-editor-id="app/components/Footer.tsx:85:19" key={link.label}>
                    <Link
                  href={link.href}
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200 text-sm">

                      {link.label}
                    </Link>
                  </li>
              )}
              </ul>
            </motion.div>
          )}
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">

          <p data-editor-id="app/components/Footer.tsx:107:11" className="text-gray-400 text-sm mb-4 sm:mb-0">
            <span data-editor-id="app/components/Footer.tsx:108:13">© {currentYear} RestorePro. All rights reserved.</span>
          </p>
          
          <div data-editor-id="app/components/Footer.tsx:111:11" className="flex items-center space-x-6 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-blue-400 transition-colors duration-200">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-blue-400 transition-colors duration-200">
              Terms
            </Link>
            <div data-editor-id="app/components/Footer.tsx:118:13" className="flex items-center space-x-2">
              <Icon icon="material-symbols:security" className="text-green-400" />
              <span data-editor-id="app/components/Footer.tsx:120:15">Secure & Trusted</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>);

}