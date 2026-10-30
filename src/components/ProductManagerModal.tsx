import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  Check, 
  ShoppingBag, 
  Tag, 
  Zap,
  Sparkles,
  Layers
} from 'lucide-react';
import { Product, StoreSettings } from '../types';
import { defaultProducts } from '../data/defaultProducts';

interface ProductManagerModalProps {
  products: Product[];
  settings: StoreSettings;
  isOpen: boolean;
  onClose: () => void;
  onSaveProducts: (products: Product[]) => void;
  onResetDefaults: () => void;
}

export const ProductManagerModal: React.FC<ProductManagerModalProps> = ({
  products,
  settings,
  isOpen,
  onClose,
  onSaveProducts,
  onResetDefaults,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [notification, setNotification] = useState<string>('');

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'Staples & Grains',
    price: 0,
    originalPrice: 0,
    discountPercent: 0,
    unit: '1 kg',
    image: '',
    barcode: '',
    description: '',
    inStock: true,
    badge: 'Special',
  });

  if (!isOpen) return null;

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  // Direct 1-Click: Add All Products / Load Complete Mart Inventory
  const handleLoadAllProducts = () => {
    onSaveProducts(defaultProducts);
    showNotice('All Mini Mart products (Biscuits, Cold Drinks, Flour, Rice, Oil) added successfully!');
  };

  // Direct Add Category Bundle
  const handleAddCategoryBundle = (category: string) => {
    const bundleItems = defaultProducts.filter((p) => {
      if (category === 'Biscuits') return p.name.toLowerCase().includes('biscuit') || p.category === 'Snacks & Biscuits';
      if (category === 'Drinks') return p.category === 'Tea & Beverages' && (p.name.includes('Drink') || p.name.includes('Cola') || p.name.includes('Sting') || p.name.includes('Sprite'));
      if (category === 'Flour') return p.name.toLowerCase().includes('flour') || p.name.toLowerCase().includes('atta') || p.name.toLowerCase().includes('maida');
      if (category === 'Rice') return p.name.toLowerCase().includes('rice') || p.name.toLowerCase().includes('basmati');
      if (category === 'Oil') return p.category === 'Cooking Oils & Ghee';
      return false;
    });

    const existingIds = new Set(products.map((p) => p.id));
    const toAdd = bundleItems.filter((b) => !existingIds.has(b.id));

    if (toAdd.length > 0) {
      onSaveProducts([...toAdd, ...products]);
      showNotice(`Added ${toAdd.length} items to your catalog!`);
    } else {
      showNotice('All items from this category are already in your catalog.');
    }
  };

  const handleStartAdd = () => {
    setIsAddingNew(true);
    setEditingId(null);
    setFormData({
      name: '',
      category: 'Snacks & Biscuits',
      price: 150,
      originalPrice: 180,
      discountPercent: 15,
      unit: '1 Pack',
      image: '',
      barcode: `8964000${Math.floor(10000 + Math.random() * 90000)}`,
      description: 'Fresh quality product from Younas & Sons Mini Mart.',
      inStock: true,
      badge: 'Fresh',
    });
  };

  const handleStartEdit = (product: Product) => {
    setEditingId(product.id);
    setIsAddingNew(false);
    setFormData({ ...product });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updated = products.filter((p) => p.id !== id);
      onSaveProducts(updated);
      if (editingId === id) setEditingId(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.price) return;

    const original = Number(formData.originalPrice) || Number(formData.price);
    const price = Number(formData.price);
    const calculatedDiscount = original > price ? Math.round(((original - price) / original) * 100) : 0;

    if (isAddingNew) {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: formData.name.trim(),
        category: (formData.category || 'Snacks & Biscuits') as Product['category'],
        price,
        originalPrice: original,
        discountPercent: formData.discountPercent || calculatedDiscount,
        unit: formData.unit || 'Standard',
        image: formData.image || '',
        barcode: formData.barcode || `896400${Date.now().toString().slice(-6)}`,
        description: formData.description || '',
        inStock: formData.inStock ?? true,
        badge: formData.badge || '',
      };
      onSaveProducts([newProduct, ...products]);
      setIsAddingNew(false);
      showNotice('Product created successfully!');
    } else if (editingId) {
      const updated = products.map((p) => {
        if (p.id === editingId) {
          return {
            ...p,
            ...formData,
            price,
            originalPrice: original,
            discountPercent: formData.discountPercent || calculatedDiscount,
          } as Product;
        }
        return p;
      });
      onSaveProducts(updated);
      setEditingId(null);
      showNotice('Product updated successfully!');
    }
  };

  const categories: Product['category'][] = [
    'Snacks & Biscuits',
    'Tea & Beverages',
    'Staples & Grains',
    'Cooking Oils & Ghee',
    'Dairy & Bakery',
    'Spices & Sauces',
    'Personal & Household',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Store Inventory & Products Manager
              </h3>
              <p className="text-xs text-slate-400">
                Manage biscuits, cold drinks, flour, rice, and cooking oils for YSM
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* ONE-CLICK DIRECT ADD ALL PRODUCTS BUTTON */}
            <button
              onClick={handleLoadAllProducts}
              className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-900/40 border border-emerald-400/30 transition-all hover:scale-102"
              title="Add all authentic mini mart products directly in 1 click"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Direct Add All Products</span>
            </button>

            <button
              onClick={handleStartAdd}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Add Custom Product</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Category Bundles Bar */}
        <div className="px-5 py-2.5 bg-slate-950 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Quick Category Presets (1-Click Add):</span>
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleAddCategoryBundle('Biscuits')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-semibold transition-colors"
            >
              + All Biscuits
            </button>
            <button
              onClick={() => handleAddCategoryBundle('Drinks')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-semibold transition-colors"
            >
              + All Cold Drinks
            </button>
            <button
              onClick={() => handleAddCategoryBundle('Flour')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-semibold transition-colors"
            >
              + All Flours (آٹا)
            </button>
            <button
              onClick={() => handleAddCategoryBundle('Rice')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-semibold transition-colors"
            >
              + All Rices (چاول)
            </button>
            <button
              onClick={() => handleAddCategoryBundle('Oil')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-semibold transition-colors"
            >
              + All Oils & Ghee
            </button>
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-semibold text-center transition-all">
            {notification}
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Product List */}
          <div className={`${isAddingNew || editingId ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-2.5`}>
            <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
              <span className="font-semibold text-white">{products.length} Products in YSM Catalog</span>
              <button
                onClick={onResetDefaults}
                className="text-amber-400 hover:underline flex items-center gap-1 font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to All Mini Mart Essentials</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[58vh] overflow-y-auto pr-1">
              {products.map((p) => (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    editingId === p.id
                      ? 'bg-emerald-950/40 border-emerald-500/60'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 shrink-0 overflow-hidden flex items-center justify-center">
                      {p.image ? (
                        <img src={p.image} alt={p.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag className="w-5 h-5 text-slate-600" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-white text-xs sm:text-sm truncate">
                        {p.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="text-emerald-400 font-medium">{p.category}</span>
                        <span>·</span>
                        <span className="text-white font-mono-numbers font-bold">
                          {settings.currency} {p.price.toLocaleString()}
                        </span>
                        {p.discountPercent ? (
                          <span className="text-rose-400 font-medium">({p.discountPercent}% OFF)</span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 pl-2">
                    <button
                      onClick={() => handleStartEdit(p)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Edit Product"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Edit / Add Form */}
          {(isAddingNew || editingId) && (
            <div className="lg:col-span-6 bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <h4 className="font-display font-bold text-sm text-white">
                    {isAddingNew ? 'Add New Mart Product' : 'Edit Product Details'}
                  </h4>
                  <button
                    onClick={() => {
                      setIsAddingNew(false);
                      setEditingId(null);
                    }}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                <form id="product-form" onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Product Title</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sooper Biscuits Family Pack"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 block mb-1">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as Product['category'] })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">Unit / Pack Size</label>
                      <input
                        type="text"
                        value={formData.unit || ''}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        placeholder="e.g. 1.5 Liters, 10 kg, 375g"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="text-slate-400 block mb-1">Special Price</label>
                      <input
                        type="number"
                        value={formData.price || ''}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        placeholder="1850"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono-numbers focus:outline-none focus:border-emerald-500"
                        required
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">Regular Price</label>
                      <input
                        type="number"
                        value={formData.originalPrice || ''}
                        onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                        placeholder="2150"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono-numbers focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">Discount %</label>
                      <input
                        type="number"
                        value={formData.discountPercent || ''}
                        onChange={(e) => setFormData({ ...formData, discountPercent: Number(e.target.value) })}
                        placeholder="14"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono-numbers focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Image URL or Local Path</label>
                    <input
                      type="text"
                      value={formData.image || ''}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="/src/assets/images/... or image URL"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-[11px] focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Barcode / SKU</label>
                    <input
                      type="text"
                      value={formData.barcode || ''}
                      onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                      placeholder="896400012001"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-[11px] focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Billboard Description</label>
                    <textarea
                      rows={2}
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Product highlights, quality, taste, freshness..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </form>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingId(null);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  form="product-form"
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/30 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>{isAddingNew ? 'Create Product' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
