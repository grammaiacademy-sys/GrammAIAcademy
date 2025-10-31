'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default function CancelPage() {
  return (
    <div data-editor-id="app/payments/cancel/page.tsx:9:5" className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md mx-auto text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100">

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">

          <Icon icon="material-symbols:cancel" className="text-3xl text-yellow-600" />
        </motion.div>
        
        <h1 data-editor-id="app/payments/cancel/page.tsx:25:9" className="text-2xl font-medium text-gray-900 mb-4">
          <span data-editor-id="app/payments/cancel/page.tsx:26:11">Payment Cancelled</span>
        </h1>
        
        <p data-editor-id="app/payments/cancel/page.tsx:29:9" className="text-gray-600 mb-8">
          <span data-editor-id="app/payments/cancel/page.tsx:30:11">No worries! You can try again anytime. Your data is safe and we&apos;re here to help.</span>
        </p>
        
        <div data-editor-id="app/payments/cancel/page.tsx:33:9" className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors">

            <span data-editor-id="app/payments/cancel/page.tsx:38:13">Back to Home</span>
          </Link>
          <Link
            href="/#pricing"
            className="inline-flex items-center justify-center px-6 py-3 border border-blue-200 text-blue-600 font-medium rounded-full hover:bg-blue-50 transition-colors">

            <span data-editor-id="app/payments/cancel/page.tsx:44:13">View Pricing</span>
          </Link>
        </div>
      </motion.div>
    </div>);

}