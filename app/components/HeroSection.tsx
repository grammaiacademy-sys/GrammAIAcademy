'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useAuth } from 'cosmic-authentication';

export default function HeroSection() {
  const { isAuthenticated, signIn, loading } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://storage.googleapis.com/cosmic-generated-assets/backgrounds/4k/cosmic-bg-y9r61859u.jpg')`
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-blue-600/10 to-white/30" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Announcement Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-sm font-medium text-gray-700"
          >
            <Icon icon="material-symbols:new-releases" className="mr-2 text-blue-600" />
            <span>AI-Powered Search for 30,000+ Line Items</span>
            <Icon icon="solar:arrow-right-linear" className="ml-2 text-blue-600" />
          </motion.div>

          {/* Main Headline */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-gray-900"
            >
              <span>Smart Search for</span><br />
              <span className="text-blue-600">Restoration Professionals</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 leading-relaxed"
            >
              <span>Find the perfect Xactimate line items instantly with AI-powered search. Water, fire, mold, and rebuild - we&apos;ve got you covered with over 30,000 items.</span>
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : isAuthenticated ? (
              <a
                href="/dashboard"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span>Go to Dashboard</span>
                <Icon icon="solar:arrow-right-linear" className="ml-2" />
              </a>
            ) : (
              <>
                <button
                  onClick={signIn}
                  className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span>Start Free Trial</span>
                  <Icon icon="solar:arrow-right-linear" className="ml-2" />
                </button>
                <a
                  href="#features"
                  className="inline-flex items-center px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 font-medium rounded-full border border-gray-200 hover:bg-white transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span>Learn More</span>
                  <Icon icon="material-symbols:play-circle" className="ml-2 text-blue-600" />
                </a>
              </>
            )}
          </motion.div>

          {/* Feature Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center justify-center space-x-8 pt-8"
          >
            {[
              { icon: 'material-symbols:water', label: 'Water Damage', color: 'text-blue-500' },
              { icon: 'mdi:fire', label: 'Fire Damage', color: 'text-red-500' },
              { icon: 'material-symbols:air', label: 'Mold Issues', color: 'text-green-500' },
              { icon: 'material-symbols:construction', label: 'Rebuild', color: 'text-gray-600' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="flex flex-col items-center space-y-2 bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/50"
              >
                <Icon icon={item.icon} className={`text-2xl ${item.color}`} />
                <span className="text-xs font-medium text-gray-600 hidden sm:block">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center space-y-2 text-gray-600"
        >
          <span className="text-sm font-medium">Scroll to explore</span>
          <Icon icon="material-symbols:keyboard-arrow-down" className="text-xl" />
        </motion.div>
      </motion.div>
    </section>
  );
}