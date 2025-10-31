'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
  {
    icon: 'material-symbols:search-rounded',
    title: 'AI-Powered Search',
    description: 'Find line items using natural language or keywords. Our AI understands what you need.',
    color: 'bg-blue-500'
  },
  {
    icon: 'material-symbols:text-fields',
    title: 'Paraphrase Matching',
    description: 'Type how you talk. We match paraphrases to the right SEL/ACT/DESCRIPTION quickly.',
    color: 'bg-green-500'
  },
  {
    icon: 'material-symbols:bookmark-star',
    title: 'Save & Organize',
    description: 'Save line items for your estimates and export when you are ready.',
    color: 'bg-sky-500'
  },
  {
    icon: 'material-symbols:download',
    title: 'Multiple Export Options',
    description: 'Export your line items as CSV, Excel, or PDF in one click.',
    color: 'bg-orange-500'
  },
  {
    icon: 'material-symbols:database',
    title: '30,000+ Line Items',
    description: 'Fast index built for large catalogs. No waiting, no lag.',
    color: 'bg-indigo-500'
  },
  {
    icon: 'material-symbols:speed',
    title: 'Lightning Fast',
    description: 'Millisecond results with precomputed search tokens.',
    color: 'bg-red-500'
  }];


  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const
      }
    }
  };

  return (
    <section data-editor-id="app/components/FeaturesSection.tsx:76:5" id="features" className="py-24 bg-white" ref={ref}>
      <div data-editor-id="app/components/FeaturesSection.tsx:77:7" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16">

          <h2 data-editor-id="app/components/FeaturesSection.tsx:84:11" className="text-3xl sm:text-4xl font-medium text-gray-900 mb-4">
            <span data-editor-id="app/components/FeaturesSection.tsx:85:13">Powerful Features for</span>
            <br data-editor-id="app/components/FeaturesSection.tsx:86:13" />
            <span data-editor-id="app/components/FeaturesSection.tsx:87:13" className="text-blue-600">Restoration Professionals</span>
          </h2>
          <p data-editor-id="app/components/FeaturesSection.tsx:89:11" className="max-w-2xl mx-auto text-lg text-gray-600">
            <span data-editor-id="app/components/FeaturesSection.tsx:90:13">Everything you need to streamline your Xactimate workflow and create accurate estimates faster.</span>
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {features.map((feature) =>
          <motion.div
            key={feature.title}
            variants={itemVariants}
            className="relative group">

              <div data-editor-id="app/components/FeaturesSection.tsx:106:15" className="h-full p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg">
                <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`inline-flex items-center justify-center w-12 h-12 ${feature.color} rounded-xl mb-6`}>

                  <Icon icon={feature.icon} className="text-2xl text-white" />
                </motion.div>
                
                <h3 data-editor-id="app/components/FeaturesSection.tsx:115:17" className="text-xl font-medium text-gray-900 mb-3">
                  <span data-editor-id="app/components/FeaturesSection.tsx:116:19">{feature.title}</span>
                </h3>
                
                <p data-editor-id="app/components/FeaturesSection.tsx:119:17" className="text-gray-600 leading-relaxed">
                  <span data-editor-id="app/components/FeaturesSection.tsx:120:19">{feature.description}</span>
                </p>

                {/* Hover effect */}
                <div data-editor-id="app/components/FeaturesSection.tsx:124:17" className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">

          {[
          { number: '30,000+', label: 'Line Items' },
          { number: '99.9%', label: 'Search Accuracy' },
          { number: '<1s', label: 'Average Search Time' }].
          map((stat, statIndex) =>
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.7 + statIndex * 0.1 }}
            className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100">

              <div data-editor-id="app/components/FeaturesSection.tsx:149:15" className="text-3xl font-medium text-blue-600 mb-2">
                <span data-editor-id="app/components/FeaturesSection.tsx:150:17">{stat.number}</span>
              </div>
              <div data-editor-id="app/components/FeaturesSection.tsx:152:15" className="text-gray-600 font-medium">
                <span data-editor-id="app/components/FeaturesSection.tsx:153:17">{stat.label}</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>);

}