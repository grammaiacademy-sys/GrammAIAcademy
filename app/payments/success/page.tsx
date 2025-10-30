'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md mx-auto text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6"
        >
          <Icon icon="material-symbols:check-circle" className="text-3xl text-green-600" />
        </motion.div>
        
        <h1 className="text-2xl font-medium text-gray-900 mb-4">
          <span>Payment Successful!</span>
        </h1>
        
        <p className="text-gray-600 mb-8">
          <span>Welcome to RestorePro! You now have access to our smart search engine with over 30,000 line items.</span>
        </p>
        
        <Link 
          href="/dashboard"
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors"
        >
          <span>Start Searching</span>
          <Icon icon="solar:arrow-right-linear" className="ml-2" />
        </Link>
      </motion.div>
    </div>
  );
}