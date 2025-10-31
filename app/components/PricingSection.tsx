'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useAuth } from 'cosmic-authentication';
import { useCosmicPayments } from 'cosmic-payments/client';

type PriceInfo = {
  productId: string;
  priceId: string;
  unitAmount: number;
  recurring?: { interval: 'day' | 'week' | 'month' | 'year'; intervalCount: number } | null;
};

export default function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const { isAuthenticated, signIn, loading: authLoading } = useAuth();
  const { checkout, getProducts, loading: paymentLoading } = useCosmicPayments();
  const [monthly, setMonthly] = useState<PriceInfo | null>(null);
  const [lifetime, setLifetime] = useState<PriceInfo | null>(null);

  const features = [
  'AI-powered smart search',
  '30,000+ Xactimate line items',
  'Save and organize line items',
  'Export to CSV, Excel, PDF',
  'Lightning-fast results',
  'Email support'];

  useEffect(() => {
    const loadProducts = async () => {
      const products = await getProducts('all');
      if (!products) return;

      // Find a $10/month subscription
      for (const p of products) {
        if (p.is_subscription) {
          for (const pr of p.prices) {
            if (pr.recurring && pr.recurring.interval === 'month' && pr.unitAmount === 1000) {
              setMonthly({ productId: p.product_id, priceId: pr.price_id, unitAmount: pr.unitAmount, recurring: pr.recurring });
            }
          }
        }
        // Find a $120 one-time (lifetime)
        if (!p.is_subscription) {
          for (const pr of p.prices) {
            if (!pr.recurring && pr.unitAmount === 12000) {
              setLifetime({ productId: p.product_id, priceId: pr.price_id, unitAmount: pr.unitAmount, recurring: null });
            }
          }
        }
      }
    };
    loadProducts();
  }, [getProducts]);

  const handleGetStarted = async () => {
    if (!isAuthenticated) {
      signIn();
      return;
    }

    const choice = billingCycle === 'monthly' ? monthly : lifetime;
    if (!choice) {
      alert('Pricing is being configured. Please try again later.');
      return;
    }

    try {
      await checkout({
        productId: choice.productId,
        priceId: choice.priceId,
        successPath: '/payments/success',
        cancelPath: '/payments/cancel'
      });
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  const priceLabel = billingCycle === 'monthly' ? '$10' : '$120';
  const subLabel = billingCycle === 'monthly' ? '/month' : 'one-time';

  return (
    <section data-editor-id="app/components/PricingSection.tsx:52:5" id="pricing" className="py-24 bg-gradient-to-br from-blue-50 to-white" ref={ref}>
      <div data-editor-id="app/components/PricingSection.tsx:53:7" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16">

          <h2 data-editor-id="app/components/PricingSection.tsx:60:11" className="text-3xl sm:text-4xl font-medium text-gray-900 mb-4">
            <span data-editor-id="app/components/PricingSection.tsx:61:13">Simple, Transparent Pricing</span>
          </h2>
          <p data-editor-id="app/components/PricingSection.tsx:63:11" className="max-w-2xl mx-auto text-lg text-gray-600 mb-8">
            <span data-editor-id="app/components/PricingSection.tsx:64:13">Choose the plan that works best for you. No hidden fees, no surprises.</span>
          </p>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center bg-white rounded-full p-1 border border-gray-200 shadow-sm">

            <button data-editor-id="app/components/PricingSection.tsx:74:13"
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            billingCycle === 'monthly' ?
            'bg-blue-600 text-white shadow-sm' :
            'text-gray-600 hover:text-blue-600'}`
            }>

              Monthly
            </button>
            <button data-editor-id="app/components/PricingSection.tsx:84:13"
            onClick={() => setBillingCycle('annual')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            billingCycle === 'annual' ?
            'bg-blue-600 text-white shadow-sm' :
            'text-gray-600 hover:text-blue-600'}`
            }>

              Annual (Lifetime Access!)
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative">

          {/* Popular Badge for Annual */}
          {billingCycle === 'annual' &&
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">

              <div data-editor-id="app/components/PricingSection.tsx:111:15" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                <span data-editor-id="app/components/PricingSection.tsx:112:17">🎉 Best Value - Lifetime Access!</span>
              </div>
            </motion.div>
          }

          <div data-editor-id="app/components/PricingSection.tsx:117:11" className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:p-12 relative overflow-hidden">
            {/* Background Decoration */}
            <div data-editor-id="app/components/PricingSection.tsx:119:13" className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-transparent rounded-full -translate-y-32 translate-x-32 opacity-50" />
            
            <div data-editor-id="app/components/PricingSection.tsx:121:13" className="relative z-10">
              <div data-editor-id="app/components/PricingSection.tsx:122:15" className="text-center mb-8">
                <div data-editor-id="app/components/PricingSection.tsx:123:17" className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-6">
                  <Icon icon="material-symbols:search-rounded" className="text-2xl text-blue-600" />
                </div>
                
                <h3 data-editor-id="app/components/PricingSection.tsx:127:17" className="text-2xl font-medium text-gray-900 mb-2">
                  <span data-editor-id="app/components/PricingSection.tsx:128:19">RestorePro {billingCycle === 'annual' ? 'Lifetime' : 'Monthly'}</span>
                </h3>
                
                <div data-editor-id="app/components/PricingSection.tsx:131:17" className="flex items-center justify-center mb-4">
                  <span data-editor-id="app/components/PricingSection.tsx:132:19" className="text-5xl font-medium text-gray-900">
                    {priceLabel}
                  </span>
                  <span data-editor-id="app/components/PricingSection.tsx:135:19" className="text-lg text-gray-500 ml-2">
                    {subLabel}
                  </span>
                </div>

                {billingCycle === 'annual' &&
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium inline-block mb-4">

                    <span data-editor-id="app/components/PricingSection.tsx:146:21">Pay once, use forever! No recurring charges.</span>
                  </motion.div>
                }

                <p data-editor-id="app/components/PricingSection.tsx:150:17" className="text-gray-600 max-w-md mx-auto">
                  <span data-editor-id="app/components/PricingSection.tsx:151:19">
                    {billingCycle === 'monthly' ?
                    'Full access to our AI-powered line item search engine.' :
                    'Get lifetime access with a one-time payment. Never pay again!'
                    }
                  </span>
                </p>
              </div>

              {/* Features List */}
              <div data-editor-id="app/components/PricingSection.tsx:161:15" className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {features.map((feature, index) =>
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.05 }}
                  className="flex items-center space-x-3">

                    <Icon icon="material-symbols:check-circle" className="text-green-500 text-xl flex-shrink-0" />
                    <span data-editor-id="app/components/PricingSection.tsx:171:21" className="text-gray-700 text-sm">
                      {feature}
                    </span>
                  </motion.div>
                )}
              </div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-center">

                <button data-editor-id="app/components/PricingSection.tsx:185:17"
                onClick={handleGetStarted}
                disabled={authLoading || paymentLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none">

                  {authLoading || paymentLoading ?
                  <>
                      <div data-editor-id="app/components/PricingSection.tsx:192:23" className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      <span data-editor-id="app/components/PricingSection.tsx:193:23">Processing...</span>
                    </> :

                  <>
                      <span data-editor-id="app/components/PricingSection.tsx:197:23">
                        {isAuthenticated ? 'Get Started Now' : 'Sign Up & Start Trial'}
                      </span>
                      <Icon icon="solar:arrow-right-linear" className="ml-2" />
                    </>
                  }
                </button>
                
                <p data-editor-id="app/components/PricingSection.tsx:205:17" className="text-sm text-gray-500 mt-4">
                  <span data-editor-id="app/components/PricingSection.tsx:206:19">
                    {billingCycle === 'monthly' ?
                    'Cancel anytime. No long-term commitments.' :
                    'One-time payment. Lifetime access guaranteed.'
                    }
                  </span>
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>);

}