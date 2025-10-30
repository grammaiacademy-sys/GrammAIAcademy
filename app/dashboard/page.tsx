'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useAuth } from 'cosmic-authentication';
import Link from 'next/link';

interface LineItem {
  id: string;
  category: string;
  description: string;
  unitOfMeasure: string;
  unitPrice?: number;
  laborPrice?: number;
  materialPrice?: number;
  keywords: string[];
}

interface SavedItem {
  id: string;
  lineItemId: string;
  lineItem: LineItem;
}

// Search interface component
function SearchInterface() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [results, setResults] = useState<LineItem[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const { user } = useAuth();

  const categories = [
    { value: 'all', label: 'All Categories', icon: 'material-symbols:search' },
    { value: 'Water', label: 'Water Damage', icon: 'material-symbols:water' },
    { value: 'Fire', label: 'Fire Damage', icon: 'mdi:fire' },
    { value: 'Mold', label: 'Mold Issues', icon: 'material-symbols:air' },
    { value: 'Rebuild', label: 'Rebuild', icon: 'material-symbols:construction' },
  ];

  // Load saved items on component mount
  useEffect(() => {
    loadSavedItems();
  }, []);

  const loadSavedItems = async () => {
    try {
      const response = await fetch('/api/saved-items');
      if (response.ok) {
        const data = await response.json();
        setSavedItems(data.savedItems);
      }
    } catch (error) {
      console.error('Error loading saved items:', error);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/ai-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, category }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setResults(data.results);
        setSearchPerformed(true);
      } else {
        console.error('Search failed');
      }
    } catch (error) {
      console.error('Error performing search:', error);
    }
    setLoading(false);
  };

  const saveItem = async (lineItem: LineItem) => {
    try {
      const response = await fetch('/api/saved-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lineItemId: lineItem.id,
          lineItem,
        }),
      });
      
      if (response.ok) {
        loadSavedItems(); // Refresh saved items
      } else {
        const error = await response.json();
        if (error.error === 'Item already saved') {
          alert('This item is already in your saved list!');
        }
      }
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const isItemSaved = (lineItemId: string) => {
    return savedItems.some((item) => item.lineItemId === lineItemId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-blue-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Icon icon="material-symbols:water" className="text-white text-lg" />
                </div>
                <span className="text-xl font-medium text-gray-900">RestorePro</span>
              </Link>
              <div className="hidden sm:block text-gray-400">|</div>
              <h1 className="hidden sm:block text-lg font-medium text-gray-900">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/saved-items"
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Icon icon="material-symbols:bookmark" />
                <span className="hidden sm:inline">Saved Items</span>
                {savedItems.length > 0 && (
                  <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                    {savedItems.length}
                  </span>
                )}
              </Link>
              
              <div className="text-sm text-gray-600">
                Welcome, {user?.displayName || user?.email}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-medium text-gray-900 mb-2">
            Smart Line Item Search
          </h2>
          <p className="text-gray-600">
            Find the perfect Xactimate line items using AI-powered search. Try searching for &quot;water damage drywall&quot; or &quot;smoke cleaning walls&quot;.
          </p>
        </motion.div>

        {/* Search Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-8"
        >
          <div className="space-y-4">
            {/* Category Filter */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    category === cat.value
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon icon={cat.icon} className="text-lg" />
                  <span className="text-sm">{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Describe what you need... e.g., 'drywall removal water damage' or 'smoke odor treatment'"
                className="w-full px-4 py-4 pl-12 pr-20 text-lg rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
              <Icon 
                icon="material-symbols:search" 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl text-gray-400" 
              />
              <button
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Search Results */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Searching through 30,000+ line items...</p>
            </motion.div>
          )}

          {!loading && searchPerformed && results.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-100"
            >
              <Icon icon="material-symbols:search-off" className="text-4xl text-gray-400 mb-4 mx-auto" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search terms or selecting a different category.</p>
            </motion.div>
          )}

          {!loading && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Found {results.length} matching line items
                </h3>
              </div>

              <div className="grid gap-4">
                {results.map((item, itemIndex) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: itemIndex * 0.05 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                            {item.category}
                          </span>
                          <span className="text-sm text-gray-500 font-mono">
                            {item.id}
                          </span>
                        </div>
                        
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                          {item.description}
                        </h4>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Unit:</span>
                            <span className="ml-2 font-medium">{item.unitOfMeasure}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Total:</span>
                            <span className="ml-2 font-medium text-blue-600">
                              ${item.unitPrice?.toFixed(2) || 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Labor:</span>
                            <span className="ml-2 font-medium">
                              ${item.laborPrice?.toFixed(2) || 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Material:</span>
                            <span className="ml-2 font-medium">
                              ${item.materialPrice?.toFixed(2) || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => saveItem(item)}
                        disabled={isItemSaved(item.id)}
                        className={`ml-4 p-3 rounded-lg transition-colors ${
                          isItemSaved(item.id)
                            ? 'bg-green-100 text-green-600 cursor-not-allowed'
                            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        }`}
                      >
                        <Icon 
                          icon={isItemSaved(item.id) ? 'material-symbols:bookmark' : 'material-symbols:bookmark-border'} 
                          className="text-xl" 
                        />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Start Tips */}
        {!searchPerformed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 bg-white rounded-2xl shadow-lg border border-blue-100 p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              💡 Quick Start Tips
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Try These Searches:</h4>
                <div className="space-y-2">
                  {[
                    'water extraction carpet',
                    'smoke damage cleaning',
                    'mold remediation drywall',
                    'drywall installation rebuild'
                  ].map((example) => (
                    <button
                      key={example}
                      onClick={() => setQuery(example)}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      &quot;{example}&quot;
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Search Tips:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Use natural language descriptions</li>
                  <li>• Include damage type and material</li>
                  <li>• Filter by category for better results</li>
                  <li>• Save items for easy export later</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SearchInterface />
    </Suspense>
  );
}