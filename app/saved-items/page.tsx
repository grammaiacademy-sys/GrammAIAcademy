'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
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
  savedAt?: { seconds: number };
}

// Export functionality
function exportToCSV(items: SavedItem[]) {
  const headers = ['ID', 'Category', 'Description', 'Unit', 'Total Price', 'Labor Price', 'Material Price'];
  const csvContent = [
    headers.join(','),
    ...items.map(item => [
      item.lineItem.id,
      item.lineItem.category,
      `"${item.lineItem.description}"`,
      item.lineItem.unitOfMeasure,
      item.lineItem.unitPrice?.toFixed(2) || '0.00',
      item.lineItem.laborPrice?.toFixed(2) || '0.00',
      item.lineItem.materialPrice?.toFixed(2) || '0.00'
    ].join(','))
  ].join('\\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `restorepro-lineitems-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function exportToPDF(items: SavedItem[]) {
  // Simple HTML to PDF conversion for demo
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>RestorePro Line Items Export</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #2563eb; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f8fafc; font-weight: 600; }
        .category { background-color: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
      </style>
    </head>
    <body>
      <h1>RestorePro Line Items Export</h1>
      <p>Export Date: ${new Date().toLocaleDateString()}</p>
      <p>Total Items: ${items.length}</p>
      
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Category</th>
            <th>Description</th>
            <th>Unit</th>
            <th>Total Price</th>
            <th>Labor</th>
            <th>Material</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td>${item.lineItem.id}</td>
              <td><span class="category">${item.lineItem.category}</span></td>
              <td>${item.lineItem.description}</td>
              <td>${item.lineItem.unitOfMeasure}</td>
              <td>$${item.lineItem.unitPrice?.toFixed(2) || '0.00'}</td>
              <td>$${item.lineItem.laborPrice?.toFixed(2) || '0.00'}</td>
              <td>$${item.lineItem.materialPrice?.toFixed(2) || '0.00'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;
  
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `restorepro-lineitems-${new Date().toISOString().split('T')[0]}.html`;
  link.click();
  URL.revokeObjectURL(url);
}

function SavedItemsInterface() {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { user } = useAuth();

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
    setLoading(false);
  };

  const removeItem = async (savedItemId: string) => {
    try {
      const response = await fetch(`/api/saved-items?id=${savedItemId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setSavedItems(items => items.filter(item => item.id !== savedItemId));
        setSelectedItems(selected => selected.filter(id => id !== savedItemId));
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectAllItems = () => {
    setSelectedItems(savedItems.map(item => item.id));
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const getSelectedItems = () => {
    return savedItems.filter(item => selectedItems.includes(item.id));
  };

  const exportSelected = (format: 'csv' | 'pdf' | 'excel') => {
    const itemsToExport = selectedItems.length > 0 ? getSelectedItems() : savedItems;
    
    if (itemsToExport.length === 0) {
      alert('No items to export!');
      return;
    }

    switch (format) {
      case 'csv':
        exportToCSV(itemsToExport);
        break;
      case 'pdf':
        exportToPDF(itemsToExport);
        break;
      case 'excel':
        // For demo, we&apos;ll export as CSV (Excel can open CSV files)
        exportToCSV(itemsToExport);
        break;
    }
  };

  const exportAll = () => {
    if (savedItems.length === 0) {
      alert('No items to export!');
      return;
    }
    
    // Export all formats
    exportToCSV(savedItems);
    setTimeout(() => exportToPDF(savedItems), 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your saved items...</p>
        </div>
      </div>
    );
  }

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
              <h1 className="hidden sm:block text-lg font-medium text-gray-900">Saved Items</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Icon icon="material-symbols:search" />
                <span className="hidden sm:inline">Search</span>
              </Link>
              
              <div className="text-sm text-gray-600">
                {user?.displayName || user?.email}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {savedItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
              <Icon icon="material-symbols:bookmark-border" className="text-6xl text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-medium text-gray-900 mb-4">
                No Saved Items Yet
              </h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start by searching for line items and saving the ones you need for your estimates.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors"
              >
                <Icon icon="material-symbols:search" className="mr-2" />
                Start Searching
              </Link>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Header with export options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-8"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <h2 className="text-2xl font-medium text-gray-900 mb-2">
                    Saved Line Items ({savedItems.length})
                  </h2>
                  <p className="text-gray-600">
                    {selectedItems.length > 0 
                      ? `${selectedItems.length} items selected`
                      : 'Select items to export or export all'
                    }
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  {selectedItems.length > 0 ? (
                    <>
                      <button
                        onClick={clearSelection}
                        className="px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
                      >
                        Clear Selection
                      </button>
                      <div className="h-6 w-px bg-gray-300" />
                    </>
                  ) : (
                    <>
                      <button
                        onClick={selectAllItems}
                        className="px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        Select All
                      </button>
                      <div className="h-6 w-px bg-gray-300" />
                    </>
                  )}
                  
                  <button
                    onClick={() => exportSelected('csv')}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <Icon icon="material-symbols:download" />
                    <span>CSV</span>
                  </button>
                  
                  <button
                    onClick={() => exportSelected('excel')}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Icon icon="material-symbols:download" />
                    <span>Excel</span>
                  </button>
                  
                  <button
                    onClick={() => exportSelected('pdf')}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Icon icon="material-symbols:download" />
                    <span>PDF</span>
                  </button>
                  
                  <button
                    onClick={exportAll}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    <Icon icon="material-symbols:download" />
                    <span>All Formats</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Items Grid */}
            <div className="grid gap-4">
              {savedItems.map((savedItem, itemIndex) => (
                <motion.div
                  key={savedItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: itemIndex * 0.05 }}
                  className={`bg-white rounded-xl shadow-sm border transition-all ${
                    selectedItems.includes(savedItem.id)
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-100 hover:shadow-lg'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(savedItem.id)}
                          onChange={() => toggleItemSelection(savedItem.id)}
                          className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                              {savedItem.lineItem.category}
                            </span>
                            <span className="text-sm text-gray-500 font-mono">
                              {savedItem.lineItem.id}
                            </span>
                          </div>
                          
                          <h4 className="text-lg font-medium text-gray-900 mb-2">
                            {savedItem.lineItem.description}
                          </h4>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-3">
                            <div>
                              <span className="text-gray-500">Unit:</span>
                              <span className="ml-2 font-medium">{savedItem.lineItem.unitOfMeasure}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Total:</span>
                              <span className="ml-2 font-medium text-blue-600">
                                ${savedItem.lineItem.unitPrice?.toFixed(2) || 'N/A'}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Labor:</span>
                              <span className="ml-2 font-medium">
                                ${savedItem.lineItem.laborPrice?.toFixed(2) || 'N/A'}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Material:</span>
                              <span className="ml-2 font-medium">
                                ${savedItem.lineItem.materialPrice?.toFixed(2) || 'N/A'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            Saved on {new Date(savedItem.savedAt?.seconds ? savedItem.savedAt.seconds * 1000 : Date.now()).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removeItem(savedItem.id)}
                        className="ml-4 p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Icon icon="material-symbols:delete" className="text-xl" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function SavedItemsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SavedItemsInterface />
    </Suspense>
  );
}