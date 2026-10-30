import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BillboardMode } from './components/BillboardMode';
import { CustomerReceiptMode } from './components/CustomerReceiptMode';
import { DualSplitMode } from './components/DualSplitMode';
import { ProductManagerModal } from './components/ProductManagerModal';
import { StoreSettingsModal } from './components/StoreSettingsModal';
import { ReceiptPrintModal } from './components/ReceiptPrintModal';
import { defaultProducts, initialSettings } from './data/defaultProducts';
import { Product, StoreSettings, CartItem, DisplayMode, CompletedSale } from './types';

export default function App() {
  // Store Settings State with offline persistence
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('ysm_settings_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse settings from storage', e);
    }
    return initialSettings;
  });

  // Product Catalog State with offline persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('ysm_products_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse products from storage', e);
    }
    return defaultProducts;
  });

  // Active Customer Cart / Bill State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ysm_active_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse active cart from storage', e);
    }
    return [];
  });

  // Completed Sales History State
  const [completedSales, setCompletedSales] = useState<CompletedSale[]>(() => {
    try {
      const saved = localStorage.getItem('ysm_sales_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse sales history from storage', e);
    }
    return [];
  });

  // Active Display Mode (Billboard, Customer Receipt, or Dual Split)
  const [displayMode, setDisplayMode] = useState<DisplayMode>(() => {
    try {
      const saved = localStorage.getItem('ysm_display_mode');
      if (saved && (saved === 'billboard' || saved === 'receipt' || saved === 'split')) {
        return saved as DisplayMode;
      }
    } catch (e) {
      console.error('Failed to parse display mode from storage', e);
    }
    return 'billboard';
  });

  // Modals State
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isProductManagerOpen, setIsProductManagerOpen] = useState<boolean>(false);
  const [activePrintSale, setActivePrintSale] = useState<CompletedSale | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('ysm_settings_v2', JSON.stringify(settings));
    } catch (e) {}
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('ysm_products_v2', JSON.stringify(products));
    } catch (e) {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('ysm_active_cart', JSON.stringify(cartItems));
    } catch (e) {}
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('ysm_sales_history', JSON.stringify(completedSales));
    } catch (e) {}
  }, [completedSales]);

  useEffect(() => {
    try {
      localStorage.setItem('ysm_display_mode', displayMode);
    } catch (e) {}
  }, [displayMode]);

  // Apply Theme class to documentElement
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Cart Operations
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: `item-${Date.now()}-${Math.random()}`, product, quantity: 1 }];
    });
  };

  // Direct 1-Click: Add all top mini mart items into customer bill
  const handleDirectAddAllToBill = () => {
    // Add top items (Biscuits, Cold Drinks, Chakki Atta, Basmati Rice, Pure Cooking Oil)
    const topItems = products.slice(0, 5);
    setCartItems((prev) => {
      const newItems = [...prev];
      topItems.forEach((product) => {
        const existing = newItems.find((item) => item.product.id === product.id);
        if (existing) {
          existing.quantity += 1;
        } else {
          newItems.push({ id: `item-${Date.now()}-${Math.random()}`, product, quantity: 1 });
        }
      });
      return newItems;
    });
    // If in billboard mode, switch to receipt or dual to let user see the bill immediately
    if (displayMode === 'billboard') {
      setDisplayMode('split');
    }
  };

  const handleAddCustomItem = (name: string, price: number, quantity: number) => {
    const customProduct: Product = {
      id: `custom-${Date.now()}`,
      name,
      category: 'Personal & Household',
      price,
      originalPrice: price,
      unit: 'Custom Item',
      image: '',
      barcode: `CUST-${Date.now().toString().slice(-4)}`,
      description: 'Manually added store counter item',
      inStock: true,
    };

    setCartItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}-${Math.random()}`,
        product: customProduct,
        quantity,
        customPrice: price,
      },
    ]);
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCompleteSale = (sale: CompletedSale) => {
    setCompletedSales((prev) => [sale, ...prev]);
    setCartItems([]);
  };

  const handleSaveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
  };

  const handleSaveSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset store inventory back to factory default products?')) {
      setProducts(defaultProducts);
    }
  };

  const handleToggleTheme = () => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  };

  // Offline Data Export (Full JSON backup)
  const handleExportData = () => {
    const backupData = {
      version: '2.0',
      exportDate: new Date().toISOString(),
      settings,
      products,
      completedSales,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `YSM_MiniMart_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Offline Data Import
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.products && Array.isArray(parsed.products)) setProducts(parsed.products);
        if (parsed.completedSales && Array.isArray(parsed.completedSales)) setCompletedSales(parsed.completedSales);
        alert('YSM Store backup restored successfully!');
      } catch (err) {
        alert('Invalid backup file. Please provide a valid YSM JSON backup.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      settings.theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* Header */}
      <Header
        settings={settings}
        mode={displayMode}
        onModeChange={(m) => setDisplayMode(m)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenProductManager={() => setIsProductManagerOpen(true)}
        onToggleTheme={handleToggleTheme}
        onQuickAddAllToBill={handleDirectAddAllToBill}
      />

      {/* Main View Area based on Selected Mode */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {displayMode === 'billboard' && (
          <BillboardMode
            products={products}
            settings={settings}
            onAddToCart={handleAddToCart}
            onAddAllToCart={handleDirectAddAllToBill}
          />
        )}

        {displayMode === 'receipt' && (
          <CustomerReceiptMode
            items={cartItems}
            products={products}
            settings={settings}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onAddToCart={handleAddToCart}
            onAddCustomItem={handleAddCustomItem}
            onCompleteSale={handleCompleteSale}
            onOpenPrintModal={(sale) => setActivePrintSale(sale)}
          />
        )}

        {displayMode === 'split' && (
          <DualSplitMode
            items={cartItems}
            products={products}
            settings={settings}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onAddToCart={handleAddToCart}
            onAddCustomItem={handleAddCustomItem}
            onCompleteSale={handleCompleteSale}
            onOpenPrintModal={(sale) => setActivePrintSale(sale)}
          />
        )}
      </main>

      {/* Product & Discount Manager Modal */}
      <ProductManagerModal
        products={products}
        settings={settings}
        isOpen={isProductManagerOpen}
        onClose={() => setIsProductManagerOpen(false)}
        onSaveProducts={handleSaveProducts}
        onResetDefaults={handleResetDefaults}
      />

      {/* Store Settings Modal */}
      <StoreSettingsModal
        settings={settings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaveSettings={handleSaveSettings}
        onExportData={handleExportData}
        onImportData={handleImportData}
      />

      {/* Thermal POS Receipt Print Preview Modal */}
      <ReceiptPrintModal
        sale={activePrintSale}
        settings={settings}
        isOpen={!!activePrintSale}
        onClose={() => setActivePrintSale(null)}
      />
    </div>
  );
}
