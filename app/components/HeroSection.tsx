'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useAuth } from 'cosmic-authentication';

export default function HeroSection() {
  const { isAuthenticated, signIn, loading } = useAuth();

  return (
    <section data-editor-id="app/components/HeroSection.tsx:11:5" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div data-editor-id="app/components/HeroSection.tsx:13:7"
      className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://storage.googleapis.com/cosmic-generated-assets/backgrounds/4k/cosmic-bg-y9r61859u.jpg')`
      }} />

      
      {/* Gradient Overlay */}
      <div data-editor-id="app/components/HeroSection.tsx:21:7" className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-blue-600/10 to-white/30" />
      
      <div data-editor-id="app/components/HeroSection.tsx:23:7" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8">

          {/* Announcement Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-sm font-medium text-gray-700">

            <Icon icon="material-symbols:new-releases" className="mr-2 text-blue-600" />
            <span data-editor-id="app/components/HeroSection.tsx:38:13">AI-Powered Search for 30,000+ Line Items</span>
            <Icon icon="solar:arrow-right-linear" className="ml-2 text-blue-600" />
          </motion.div>

          {/* Main Headline */}
          <div data-editor-id="app/components/HeroSection.tsx:43:11" className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-gray-900">

              <span data-editor-id="app/components/HeroSection.tsx:50:15">Smart Search for</span><br data-editor-id="app/components/HeroSection.tsx:50:44" />
              <span data-editor-id="app/components/HeroSection.tsx:51:15" className="text-blue-600">Restoration Professionals</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 leading-relaxed">

              <span data-editor-id="app/components/HeroSection.tsx:60:15">Find the right Xactimate line items instantly using paraphrases or keywords. Built for speed, accuracy, and simplicity.</span>
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">

            {loading ?
            <div data-editor-id="app/components/HeroSection.tsx:72:15" className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /> :
            isAuthenticated ?
            <a data-editor-id="app/components/HeroSection.tsx:74:15"
            href="/dashboard"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">

                <span data-editor-id="app/components/HeroSection.tsx:78:17">Go to Dashboard</span>
                <Icon icon="solar:arrow-right-linear" className="ml-2" />
              </a> :

            <>
                <button data-editor-id="app/components/HeroSection.tsx:83:17"
              onClick={signIn}
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">

                  <span data-editor-id="app/components/HeroSection.tsx:87:19">Start Free Trial</span>
                  <Icon icon="solar:arrow-right-linear" className="ml-2" />
                </button>
                <a data-editor-id="app/components/HeroSection.tsx:90:17"
              href="#features"
              className="inline-flex items-center px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 font-medium rounded-full border border-gray-200 hover:bg-white transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">

                  <span data-editor-id="app/components/HeroSection.tsx:94:19">Learn More</span>
                  <Icon icon="material-symbols:play-circle" className="ml-2 text-blue-600" />
                </a>
              </>
            }
          </motion.div>

          {/* Subtle badges (no category filter visuals) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center justify-center space-x-3 pt-8 text-gray-600 text-sm">

            <div data-editor-id="app/components/HeroSection.tsx:122:17" className="px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full border border-white/50">Paraphrase & keyword matching</div>
            <div data-editor-id="app/components/HeroSection.tsx:123:17" className="px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full border border-white/50">Fast 30k index</div>
            <div data-editor-id="app/components/HeroSection.tsx:124:17" className="px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full border border-white/50">Export CSV • Excel • PDF</div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2">

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center space-y-2 text-gray-600">

          <span data-editor-id="app/components/HeroSection.tsx:141:11" className="text-sm font-medium">Scroll to explore</span>
          <Icon icon="material-symbols:keyboard-arrow-down" className="text-xl" />
        </motion.div>
      </motion.div>
    </section>);

}