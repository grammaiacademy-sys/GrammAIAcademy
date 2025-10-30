'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    {
      icon: 'material-symbols:construction',
      number: '15+',
      label: 'Years in Restoration',
      description: 'Industry expertise'
    },
    {
      icon: 'material-symbols:group',
      number: '1000+',
      label: 'Active Users',
      description: 'Trusted professionals'
    },
    {
      icon: 'material-symbols:timer',
      number: '80%',
      label: 'Time Saved',
      description: 'On estimate creation'
    },
    {
      icon: 'material-symbols:star',
      number: '4.9/5',
      label: 'User Rating',
      description: 'Customer satisfaction'
    }
  ];

  return (
    <section id="about" className="py-24 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 mb-6">
              <span>Built by Restoration</span>
              <br />
              <span className="text-blue-600">Professionals, for Professionals</span>
            </h2>
            
            <div className="space-y-6 text-lg text-gray-600">
              <p>
                <span>We understand the challenges of creating accurate Xactimate estimates. Searching through thousands of line items manually is time-consuming and error-prone.</span>
              </p>
              
              <p>
                <span>That&apos;s why we built RestorePro - an AI-powered search engine that understands the restoration industry. Whether you&apos;re dealing with water damage, fire restoration, mold remediation, or rebuild projects, our smart search finds exactly what you need in seconds.</span>
              </p>
              
              <p>
                <span>Our database contains over 30,000 carefully curated Xactimate line items, updated regularly to reflect current market conditions and industry standards.</span>
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8"
            >
              <div className="flex items-start space-x-4 p-6 bg-blue-50 rounded-2xl">
                <Icon icon="material-symbols:lightbulb" className="text-2xl text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    <span>Pro Tip</span>
                  </h4>
                  <p className="text-gray-600">
                    <span>Use natural language in your searches. Try &quot;drywall removal water damage&quot; or &quot;smoke odor treatment&quot; - our AI understands context!</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg group"
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4 group-hover:bg-blue-200 transition-colors duration-300"
                >
                  <Icon icon={stat.icon} className="text-xl text-blue-600" />
                </motion.div>
                
                <div className="text-2xl font-medium text-gray-900 mb-1">
                  <span>{stat.number}</span>
                </div>
                
                <div className="font-medium text-gray-700 mb-1">
                  <span>{stat.label}</span>
                </div>
                
                <div className="text-sm text-gray-500">
                  <span>{stat.description}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-white p-8 lg:p-12 rounded-3xl border border-blue-100">
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Icon key={i} icon="material-symbols:star" className="text-2xl text-yellow-400" />
              ))}
            </div>
            
            <blockquote className="text-xl text-gray-700 mb-6 leading-relaxed">
              <span>&quot;RestorePro has completely transformed how we create estimates. What used to take hours now takes minutes. The AI search is incredibly accurate and saves us so much time on every project.&quot;</span>
            </blockquote>
            
            <div className="flex items-center justify-center space-x-4">
              <img
                src="https://i.pravatar.cc/64?u=restoration-pro"
                alt="Customer testimonial"
                className="w-12 h-12 rounded-full"
              />
              <div className="text-left">
                <div className="font-medium text-gray-900">
                  <span>Sarah Johnson</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span>Senior Estimator, RestoreTech Solutions</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}