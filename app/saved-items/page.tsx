'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { useAuth } from 'cosmic-authentication';
import Link from 'next/link';

interface LineItem {
  id: string;
  sel: string;
  act: string;
  description: string;
  unit: string;
  sel_normalized?: string;
  search_tokens?: string[];
  source_sheet?: string;
}

interface SavedItem {
  id: string;
  lineItemId: string;
  lineItem: LineItem;
  savedAt?: {seconds: number};
}

// Export functionality
function exportToCSV(items: SavedItem[]) {
  const headers = ['SEL', 'ACT', 'DESCRIPTION', 'UNIT'];
  const csvContent = [
  headers.join(','),
  ...items.map((item) => [
  item.lineItem.sel,
  item.lineItem.act,
  `"${item.lineItem.description}"`,
  item.lineItem.unit].
  join(','))].
  join('\n');

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
  // Simple HTML to PDF-like export (HTML download)
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
        .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
      </style>
    </head>
    <body>
      <h1>RestorePro Line Items Export</h1>
      <p>Export Date: ${new Date().toLocaleDateString()}</p>
      <p>Total Items: ${items.length}</p>
      
      <table>
        <thead>
          <tr>
            <th class="mono">SEL</th>
            <th>ACT</th>
            <th>Description</th>
            <th>Unit</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((item) => `
            <tr>
              <td class="mono">${item.lineItem.sel}</td>
              <td>${item.lineItem.act}</td>
              <td>${item.lineItem.description}</td>
              <td>${item.lineItem.unit}</td>
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
        method: 'DELETE'
      });

      if (response.ok) {
        setSavedItems((items) => items.filter((item) => item.id !== savedItemId));
        setSelectedItems((selected) => selected.filter((id) => id !== savedItemId));
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) =>
    prev.includes(itemId) ?
    prev.filter((id) => id !== itemId) :
    [...prev, itemId]
    );
  };

  const selectAllItems = () => {
    setSelectedItems(savedItems.map((item) => item.id));
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  const getSelectedItems = () => {
    return savedItems.filter((item) => selectedItems.includes(item.id));
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
        // For demo, export as CSV (Excel can open CSV files)
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
      <div data-editor-id="app/saved-items/page.tsx:206:7" className="min-h-screen flex items-center justify-center">
        <div data-editor-id="app/saved-items/page.tsx:207:9" className="text-center">
          <div data-editor-id="app/saved-items/page.tsx:208:11" className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p data-editor-id="app/saved-items/page.tsx:209:11" className="text-gray-600">Loading your saved items...</p>
        </div>
      </div>);

  }

  return (
    <div data-editor-id="app/saved-items/page.tsx:216:5" className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div data-editor-id="app/saved-items/page.tsx:218:7" className="bg-white border-b border-blue-100 sticky top-0 z-40">
        <div data-editor-id="app/saved-items/page.tsx:219:9" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div data-editor-id="app/saved-items/page.tsx:220:11" className="flex items-center justify-between">
            <div data-editor-id="app/saved-items/page.tsx:221:13" className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div data-editor-id="app/saved-items/page.tsx:223:17" className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Icon icon="material-symbols:water" className="text-white text-lg" />
                </div>
                <span data-editor-id="app/saved-items/page.tsx:226:17" className="text-xl font-medium text-gray-900">RestorePro</span>
              </Link>
              <div data-editor-id="app/saved-items/page.tsx:228:15" className="hidden sm:block text-gray-400">|</div>
              <h1 data-editor-id="app/saved-items/page.tsx:229:15" className="hidden sm:block text-lg font-medium text-gray-900">Saved Items</h1>
            </div>
            
            <div data-editor-id="app/saved-items/page.tsx:232:13" className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors">

                <Icon icon="material-symbols:search" />
                <span data-editor-id="app/saved-items/page.tsx:238:17" className="hidden sm:inline">Search</span>
              </Link>
              
              <div data-editor-id="app/saved-items/page.tsx:241:15" className="text-sm text-gray-600">
                {user?.displayName || user?.email}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div data-editor-id="app/saved-items/page.tsx:249:7" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {savedItems.length === 0 ?
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12">

            <div data-editor-id="app/saved-items/page.tsx:256:13" className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
              <Icon icon="material-symbols:bookmark-border" className="text-6xl text-gray-300 mx-auto mb-4" />
              <h2 data-editor-id="app/saved-items/page.tsx:258:15" className="text-2xl font-medium text-gray-900 mb-4">
                No Saved Items Yet
              </h2>
              <p data-editor-id="app/saved-items/page.tsx:261:15" className="text-gray-600 mb-6 max-w-md mx-auto">
                Start by searching for line items and saving the ones you need for your estimates.
              </p>
              <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors">

                <Icon icon="material-symbols:search" className="mr-2" />
                Start Searching
              </Link>
            </div>
          </motion.div> :

        <>
            {/* Header with export options */}
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-8">

              <div data-editor-id="app/saved-items/page.tsx:281:15" className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div data-editor-id="app/saved-items/page.tsx:282:17">
                  <h2 data-editor-id="app/saved-items/page.tsx:283:19" className="text-2xl font-medium text-gray-900 mb-2">
                    Saved Line Items ({savedItems.length})
                  </h2>
                  <p data-editor-id="app/saved-items/page.tsx:286:19" className="text-gray-600">
                    {selectedItems.length > 0 ?
                  `${selectedItems.length} items selected` :
                  'Select items to export or export all'
                  }
                  </p>
                </div>
                
                <div data-editor-id="app/saved-items/page.tsx:294:17" className="flex flex-wrap items-center gap-2">
                  {selectedItems.length > 0 ?
                <>
                      <button data-editor-id="app/saved-items/page.tsx:297:23"
                  onClick={clearSelection}
                  className="px-4 py-2 text-gray-600 hover:text-red-600 transition-colors">

                        Clear Selection
                      </button>
                      <div data-editor-id="app/saved-items/page.tsx:303:23" className="h-6 w-px bg-gray-300" />
                    </> :

                <>
                      <button data-editor-id="app/saved-items/page.tsx:307:23"
                  onClick={selectAllItems}
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors">

                        Select All
                      </button>
                      <div data-editor-id="app/saved-items/page.tsx:313:23" className="h-6 w-px bg-gray-300" />
                    </>
                }
                  
                  <button data-editor-id="app/saved-items/page.tsx:317:19"
                onClick={() => exportSelected('csv')}
                className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">

                    <Icon icon="material-symbols:download" />
                    <span data-editor-id="app/saved-items/page.tsx:322:21">CSV</span>
                  </button>
                  
                  <button data-editor-id="app/saved-items/page.tsx:325:19"
                onClick={() => exportSelected('excel')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">

                    <Icon icon="material-symbols:download" />
                    <span data-editor-id="app/saved-items/page.tsx:330:21">Excel</span>
                  </button>
                  
                  <button data-editor-id="app/saved-items/page.tsx:333:19"
                onClick={() => exportSelected('pdf')}
                className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">

                    <Icon icon="material-symbols:download" />
                    <span data-editor-id="app/saved-items/page.tsx:338:21">PDF</span>
                  </button>
                  
                  <button data-editor-id="app/saved-items/page.tsx:341:19"
                onClick={exportAll}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">

                    <Icon icon="material-symbols:download" />
                    <span data-editor-id="app/saved-items/page.tsx:346:21">All Formats</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Items Grid */}
            <div data-editor-id="app/saved-items/page.tsx:353:13" className="grid gap-4">
              {savedItems.map((savedItem, itemIndex) =>
            <motion.div
              key={savedItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: itemIndex * 0.05 }}
              className={`bg-white rounded-xl shadow-sm border transition-all ${
              selectedItems.includes(savedItem.id) ?
              'border-blue-300 bg-blue-50' :
              'border-gray-100 hover:shadow-lg'}`
              }>

                  <div data-editor-id="app/saved-items/page.tsx:366:19" className="p-6">
                    <div data-editor-id="app/saved-items/page.tsx:367:21" className="flex items-start justify-between">
                      <div data-editor-id="app/saved-items/page.tsx:368:23" className="flex items-start space-x-4">
                        <input data-editor-id="app/saved-items/page.tsx:369:25"
                    type="checkbox"
                    checked={selectedItems.includes(savedItem.id)}
                    onChange={() => toggleItemSelection(savedItem.id)}
                    className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />

                        
                        <div data-editor-id="app/saved-items/page.tsx:376:25" className="flex-1">
                          <div data-editor-id="app/saved-items/page.tsx:377:27" className="flex items-center space-x-3 mb-3">
                            <span data-editor-id="app/saved-items/page.tsx:381:29" className="text-sm text-gray-500 font-mono">
                              {savedItem.lineItem.sel} {savedItem.lineItem.act}
                            </span>
                          </div>
                          
                          <h4 data-editor-id="app/saved-items/page.tsx:386:27" className="text-lg font-medium text-gray-900 mb-2">
                            {savedItem.lineItem.description}
                          </h4>
                          
                          <div data-editor-id="app/saved-items/page.tsx:390:27" className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm mb-3">
                            <div data-editor-id="app/saved-items/page.tsx:391:29">
                              <span data-editor-id="app/saved-items/page.tsx:392:31" className="text-gray-500">Unit:</span>
                              <span data-editor-id="app/saved-items/page.tsx:393:31" className="ml-2 font-medium">{savedItem.lineItem.unit}</span>
                            </div>
                            {savedItem.lineItem.source_sheet && (
                              <div>
                                <span className="text-gray-500">Source Sheet:</span>
                                <span className="ml-2 font-medium">{savedItem.lineItem.source_sheet}</span>
                              </div>
                            )}
                          </div>
                          
                          <div data-editor-id="app/saved-items/page.tsx:415:27" className="text-xs text-gray-500">
                            Saved on {new Date(savedItem.savedAt?.seconds ? savedItem.savedAt.seconds * 1000 : Date.now()).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <button data-editor-id="app/saved-items/page.tsx:421:23"
                  onClick={() => removeItem(savedItem.id)}
                  className="ml-4 p-2 text-gray-400 hover:text-red-600 transition-colors">

                        <Icon icon="material-symbols:delete" className="text-xl" />
                      </button>
                    </div>
                  </div>
                </motion.div>
            )}
            </div>
          </>
        }
      </div>
    </div>);

}

export default function SavedItemsPage() {
  return (
    <Suspense fallback={
    <div data-editor-id="app/saved-items/page.tsx:442:7" className="min-h-screen flex items-center justify-center">
        <div data-editor-id="app/saved-items/page.tsx:443:9" className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SavedItemsInterface />
    </Suspense>);

}