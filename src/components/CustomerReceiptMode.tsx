import React, { useState } from 'react';
import { 
  Plus, 
  Minus, 
  Trash2, 
  Printer, 
  RotateCcw, 
  Search, 
  DollarSign, 
  CreditCard, 
  Smartphone, 
  Wallet, 
  ShoppingBag, 
  Receipt as ReceiptIcon, 
  CheckCircle2, 
  Tag, 
  Coins, 
  Calculator,
  User,
  Phone
} from 'lucide-react';
import { CartItem, Product, StoreSettings, CompletedSale } from '../types';

interface CustomerReceiptModeProps {
  items: CartItem[];
  products: Product[];
  settings: StoreSettings;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onAddToCart: (product: Product) => void;
  onAddCustomItem: (name: string, price: number, qty: number) => void;
  onCompleteSale: (sale: CompletedSale) => void;
  onOpenPrintModal: (sale: CompletedSale) => void;
  compact?: boolean;
}

export const CustomerReceiptMode: React.FC<CustomerReceiptModeProps> = ({
  items,
  products,
  settings,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onAddToCart,
  onAddCustomItem,
  onCompleteSale,
  onOpenPrintModal,
  compact = false,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cashTendered, setCashTendered] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'EasyPaisa' | 'JazzCash'>('Cash');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'pos' | 'custom'>('pos');

  // Custom Item Form State
  const [customName, setCustomName] = useState<string>('');
  const [customPrice, setCustomPrice] = useState<string>('');
  const [customQty, setCustomQty] = useState<number>(1);

  // Calculations
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => {
    const price = item.customPrice !== undefined ? item.customPrice : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  // Calculate savings compared to original price
  const totalSavings = items.reduce((sum, item) => {
    if (item.product.originalPrice > item.product.price) {
      return sum + (item.product.originalPrice - item.product.price) * item.quantity;
    }
    return sum;
  }, 0);

  const tax = settings.taxRate > 0 ? (subtotal * settings.taxRate) / 100 : 0;
  const grandTotal = Math.max(0, subtotal + tax);

  const tenderedAmount = parseFloat(cashTendered) || 0;
  const changeDue = tenderedAmount > 0 ? Math.max(0, tenderedAmount - grandTotal) : 0;

  // Filter products for quick-add list
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.barcode.includes(searchQuery);
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateSale = (triggerPrint: boolean = false) => {
    if (items.length === 0) return;

    const sale: CompletedSale = {
      id: `bill-${Date.now()}`,
      billNumber: `YSM-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString(),
      items: [...items],
      subtotal,
      discount: totalSavings,
      tax,
      total: grandTotal,
      amountPaid: tenderedAmount > 0 ? tenderedAmount : grandTotal,
      changeDue: tenderedAmount > 0 ? changeDue : 0,
      paymentMethod,
      customerName: customerName.trim() || undefined,
      customerPhone: customerPhone.trim() || undefined,
    };

    onCompleteSale(sale);
    if (triggerPrint) {
      onOpenPrintModal(sale);
    }
    setCashTendered('');
    setCustomerName('');
    setCustomerPhone('');
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(customPrice);
    if (!customName.trim() || isNaN(price) || price <= 0 || customQty <= 0) return;

    onAddCustomItem(customName.trim(), price, customQty);
    setCustomName('');
    setCustomPrice('');
    setCustomQty(1);
    setActiveTab('pos');
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-slate-950 text-slate-100 overflow-hidden">
      {/* LEFT COLUMN: The Master Customer Screen (The 27-inch Bill Table & Grand Total) */}
      <div className={`flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 overflow-hidden ${compact ? 'w-full' : ''}`}>
        
        {/* Customer Screen Bill Header */}
        <div className="p-4 sm:p-5 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ReceiptIcon className="w-5 h-5 text-emerald-400" />
              <h2 className="font-display font-bold text-lg sm:text-xl text-white">
                Customer Live Bill
              </h2>
              <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono-numbers">
                Active Sale
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live receipt updated in real-time on {settings.storeName} display
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClearCart}
              disabled={items.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 disabled:opacity-40 transition-colors"
              title="Clear current customer bill"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Bill</span>
            </button>
          </div>
        </div>

        {/* Live Items Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
              <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-slate-600">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-1">
                Your Bill is Empty
              </h3>
              <p className="text-sm max-w-md text-slate-400 mb-6">
                Items scanned or added by the cashier at Younas & Sons Mini Mart counter will appear here immediately.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 font-mono-numbers">
                <span>Waiting for next customer...</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-12 text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 pb-2 border-b border-slate-800">
                <span className="col-span-6 sm:col-span-6">Item & Specifications</span>
                <span className="col-span-2 text-center">Unit Price</span>
                <span className="col-span-2 text-center">Qty</span>
                <span className="col-span-2 text-right">Total Amount</span>
              </div>

              {items.map((item, idx) => {
                const unitPrice = item.customPrice !== undefined ? item.customPrice : item.product.price;
                const lineTotal = unitPrice * item.quantity;
                const hasDiscount = item.product.originalPrice > item.product.price && item.customPrice === undefined;

                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 items-center p-3 sm:p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-colors group"
                  >
                    {/* Item Name & Details */}
                    <div className="col-span-6 flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-400 w-5">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-white text-sm sm:text-base leading-snug truncate">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>{item.product.unit || 'Standard'}</span>
                          {hasDiscount && (
                            <span className="text-emerald-400 font-medium">
                              (Save {settings.currency} {((item.product.originalPrice - item.product.price) * item.quantity).toLocaleString()})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div className="col-span-2 text-center">
                      <span className="font-mono-numbers text-sm text-slate-300 font-medium">
                        {settings.currency} {unitPrice.toLocaleString()}
                      </span>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="col-span-2 flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors"
                        title="Decrease Quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-bold text-white font-mono-numbers text-sm sm:text-base">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors"
                        title="Increase Quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Line Total & Remove */}
                    <div className="col-span-2 flex items-center justify-end gap-3 text-right">
                      <span className="font-mono-numbers font-bold text-sm sm:text-lg text-emerald-400">
                        {settings.currency} {lineTotal.toLocaleString()}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="opacity-40 group-hover:opacity-100 hover:text-rose-400 text-slate-400 transition-opacity p-1"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* BOTTOM MASTER TOTALS CARD (Designed specifically for 27" customer readability) */}
        <div className="p-4 sm:p-6 bg-slate-900 border-t border-slate-800 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-slate-800/80">
            <div>
              <span className="text-xs text-slate-400 block mb-0.5">Total Items:</span>
              <span className="font-mono-numbers font-bold text-base sm:text-lg text-white">
                {items.length} items ({totalItemCount} qty)
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-0.5">Subtotal:</span>
              <span className="font-mono-numbers font-bold text-base sm:text-lg text-slate-300">
                {settings.currency} {subtotal.toLocaleString()}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-0.5">Customer Savings:</span>
              <span className="font-mono-numbers font-bold text-base sm:text-lg text-emerald-400">
                {totalSavings > 0 ? `- ${settings.currency} ${totalSavings.toLocaleString()}` : 'Rs. 0'}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-0.5">Payment Method:</span>
              <span className="font-semibold text-xs sm:text-sm text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded inline-block">
                {paymentMethod}
              </span>
            </div>
          </div>

          {/* GIANT GRAND TOTAL BOX */}
          <div className="flex flex-wrap items-center justify-between p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/60 border border-emerald-500/30 shadow-xl">
            <div>
              <span className="text-xs sm:text-sm uppercase tracking-widest text-emerald-300 font-semibold block mb-1">
                Net Payable Amount
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-emerald-400 font-mono-numbers tracking-tight">
                  {settings.currency} {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {tenderedAmount > 0 && (
              <div className="text-right pl-4 border-l border-emerald-500/20">
                <span className="text-xs text-slate-400 block">Change Return:</span>
                <span className="font-mono-numbers font-extrabold text-2xl sm:text-3xl text-amber-400">
                  {settings.currency} {changeDue.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Paid: {settings.currency} {tenderedAmount.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Cashier Quick-Add Panel & POS Terminal */}
      <div className={`w-full lg:w-96 xl:w-[420px] bg-slate-900/90 flex flex-col shrink-0 overflow-hidden ${compact ? 'hidden xl:flex' : ''}`}>
        {/* Terminal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('pos')}
              className={`px-3 py-1.5 font-semibold rounded-md transition-colors ${
                activeTab === 'pos' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Scan & Catalog
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-3 py-1.5 font-semibold rounded-md transition-colors ${
                activeTab === 'custom' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Custom Item
            </button>
          </div>

          <span className="text-[11px] text-slate-400 font-mono-numbers">
            {settings.cashierName}
          </span>
        </div>

        {activeTab === 'pos' ? (
          /* Scan & Catalog Search View */
          <div className="flex-1 flex flex-col p-4 overflow-hidden">
            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search item or barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Category Quick Chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === c
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Quick-Add Product List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onAddToCart(p)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/50 hover:bg-slate-950 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-900 shrink-0 flex items-center justify-center border border-slate-800">
                      {p.image ? (
                        <img src={p.image} alt={p.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag className="w-5 h-5 text-slate-600" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-semibold text-white truncate group-hover:text-emerald-300">
                        {p.name}
                      </h5>
                      <span className="text-[10px] text-slate-400">{p.unit}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-2">
                    <span className="text-xs font-bold font-mono-numbers text-emerald-400 block">
                      {settings.currency} {p.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400">Click to add</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Custom Item Entry Form (for unlisted or loose weight items) */
          <form onSubmit={handleAddCustom} className="p-4 space-y-4 flex-1">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Add Loose or Custom Item
            </h4>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Item Name / Description</label>
              <input
                type="text"
                placeholder="e.g. Sugar 2kg, Loose Eggs, Onions"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Price ({settings.currency})</label>
                <input
                  type="number"
                  placeholder="350"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono-numbers"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Quantity</label>
                <input
                  type="number"
                  value={customQty}
                  onChange={(e) => setCustomQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono-numbers"
                  required
                  min="1"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-900/30"
            >
              Add Custom Item to Bill
            </button>
          </form>
        )}

        {/* Payment & Settlement Panel */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3.5">
          {/* Payment Method Selector */}
          <div>
            <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">Customer Payment Method</span>
            <div className="grid grid-cols-4 gap-1.5">
              {(['Cash', 'Card', 'EasyPaisa', 'JazzCash'] as const).map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-semibold text-center border transition-all ${
                    paymentMethod === method
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Cash Tendered & Change Calculation */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Cash Given ({settings.currency})</label>
              <input
                type="number"
                placeholder={grandTotal.toString()}
                value={cashTendered}
                onChange={(e) => setCashTendered(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono-numbers focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Customer Phone (Opt)</label>
              <input
                type="text"
                placeholder="0345..."
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono-numbers focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Checkout Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => handleCreateSale(true)}
              disabled={items.length === 0}
              className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all disabled:opacity-40"
              title="Print 80mm thermal receipt"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Print Receipt</span>
            </button>

            <button
              onClick={() => handleCreateSale(false)}
              disabled={items.length === 0}
              className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-900/40 disabled:opacity-40"
              title="Finalize sale & clear for next customer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Sale</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
