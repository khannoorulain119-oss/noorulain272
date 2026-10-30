import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Tag, 
  Sparkles, 
  Percent, 
  ShoppingBag, 
  LayoutGrid, 
  Scan, 
  Layers, 
  CheckCircle2,
  Phone,
  Truck,
  Flame,
  Zap
} from 'lucide-react';
import { Product, StoreSettings } from '../types';

interface BillboardModeProps {
  products: Product[];
  settings: StoreSettings;
  onAddToCart: (product: Product) => void;
  onAddAllToCart?: () => void;
  compact?: boolean; // For split screen mode
}

export const BillboardMode: React.FC<BillboardModeProps> = ({
  products,
  settings,
  onAddToCart,
  onAddAllToCart,
  compact = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [viewCatalog, setViewCatalog] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [progress, setProgress] = useState<number>(0);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);
  const [bulkNotice, setBulkNotice] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);
  const intervalSeconds = settings.slideshowInterval || 6;

  // Filter available products
  const activeProducts = products.length > 0 ? products : [];
  const currentProduct = activeProducts[currentIndex] || activeProducts[0];

  // Auto-play slideshow logic
  useEffect(() => {
    if (!isPlaying || activeProducts.length <= 1) return;

    setProgress(0);
    const stepMs = 50;
    const totalSteps = (intervalSeconds * 1000) / stepMs;
    let currentStep = 0;

    const timer = window.setInterval(() => {
      currentStep++;
      setProgress((currentStep / totalSteps) * 100);

      if (currentStep >= totalSteps) {
        setCurrentIndex((prev) => (prev + 1) % activeProducts.length);
        currentStep = 0;
        setProgress(0);
      }
    }, stepMs);

    timerRef.current = timer;

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPlaying, intervalSeconds, activeProducts.length]);

  // Keyboard navigation (Left / Right arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeProducts.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeProducts.length);
    setProgress(0);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeProducts.length) % activeProducts.length);
    setProgress(0);
  };

  const handleQuickAdd = () => {
    if (!currentProduct) return;
    onAddToCart(currentProduct);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleBulkAdd = () => {
    if (onAddAllToCart) {
      onAddAllToCart();
    } else {
      activeProducts.slice(0, 5).forEach((p) => onAddToCart(p));
    }
    setBulkNotice(true);
    setTimeout(() => setBulkNotice(false), 2500);
  };

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];
  const filteredCatalog = selectedCategory === 'All' 
    ? products 
    : products.filter((p) => p.category === selectedCategory);

  if (!currentProduct) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-center text-slate-400">
        <div>
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-slate-600 animate-pulse" />
          <h2 className="text-xl font-bold text-white mb-2">No Products Configured</h2>
          <p className="text-sm">Add products through the "Products" manager in the header to start the billboard.</p>
        </div>
      </div>
    );
  }

  const savingsAmount = (currentProduct.originalPrice || currentProduct.price) - currentProduct.price;
  const discountPct = currentProduct.discountPercent || 
    (currentProduct.originalPrice > currentProduct.price 
      ? Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100) 
      : 0);

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-hidden relative">
      {/* Top Floating Controls (when not in compact mode) */}
      {!compact && (
        <div className="absolute top-4 right-6 z-20 flex items-center gap-2.5">
          <button
            onClick={handleBulkAdd}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg border shadow-lg transition-all ${
              bulkNotice
                ? 'bg-emerald-500 text-white border-emerald-400 scale-105'
                : 'bg-emerald-700/80 hover:bg-emerald-600 text-white border-emerald-500/40'
            }`}
            title="Directly add items to customer bill"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>{bulkNotice ? 'Added to Bill!' : 'Direct Add Top Items'}</span>
          </button>

          <button
            onClick={() => setViewCatalog(!viewCatalog)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900/90 hover:bg-slate-800 text-xs font-semibold rounded-lg border border-slate-700/80 shadow-lg text-slate-200 transition-colors"
          >
            {viewCatalog ? <Layers className="w-3.5 h-3.5 text-emerald-400" /> : <LayoutGrid className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{viewCatalog ? 'Back to Billboard' : 'Browse All Products'}</span>
          </button>
        </div>
      )}

      {/* Mode A: Full Catalog Browser Grid */}
      {viewCatalog && !compact ? (
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 max-w-7xl mx-auto w-full">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-display font-bold text-white">Full Store Catalog</h2>
              <p className="text-xs text-slate-400">Younas & Sons Mini Mart · {products.length} Items Available in Dargai</p>
            </div>

            {/* Category Filter Pills (Functional Buttons) */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCatalog.map((prod) => (
              <div
                key={prod.id}
                className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden flex flex-col hover:border-slate-700 transition-all hover:scale-[1.01] group"
              >
                <div className="relative aspect-[4/3] bg-slate-950 flex items-center justify-center overflow-hidden">
                  {prod.image ? (
                    <img
                      src={prod.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-950 text-slate-500">
                      <ShoppingBag className="w-12 h-12 mb-2 text-slate-600" />
                      <span className="text-[11px] font-mono text-center text-slate-400 line-clamp-1">{prod.category}</span>
                    </div>
                  )}

                  {prod.discountPercent && prod.discountPercent > 0 && (
                    <span className="absolute top-2 left-2 bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow">
                      {prod.discountPercent}% OFF
                    </span>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                      {prod.category}
                    </span>
                    <h3 className="font-semibold text-white text-sm line-clamp-2 mb-2 leading-snug">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                      {prod.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-end justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-emerald-400 font-mono-numbers">
                          {settings.currency} {prod.price.toLocaleString()}
                        </span>
                        {prod.originalPrice > prod.price && (
                          <span className="text-xs line-through text-slate-500 font-mono-numbers">
                            {settings.currency} {prod.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 block">{prod.unit}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setCurrentIndex(products.findIndex((p) => p.id === prod.id));
                          setViewCatalog(false);
                        }}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
                        title="Display on Billboard"
                      >
                        Showcase
                      </button>
                      <button
                        onClick={() => onAddToCart(prod)}
                        className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shadow-sm"
                        title="Add to Customer Bill"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Mode B: ONE-BY-ONE Showcase Screen */
        <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 lg:p-8 xl:p-10 max-w-7xl mx-auto w-full">
          {/* Main Stage Grid: Left big image + Right product details */}
          <div className={`grid ${compact ? 'grid-cols-1 md:grid-cols-2 gap-4' : 'grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12'} items-center my-auto`}>
            
            {/* Left Column: Big Product Image Showcase */}
            <div className={`${compact ? 'col-span-1' : 'lg:col-span-6 xl:col-span-6'} relative`}>
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center p-3 group">
                {currentProduct.image ? (
                  <img
                    src={currentProduct.image}
                    alt={currentProduct.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-2xl transform hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 rounded-2xl">
                    <div className="w-24 h-24 rounded-2xl bg-emerald-950/60 border border-emerald-500/20 flex items-center justify-center mb-4">
                      <ShoppingBag className="w-12 h-12 text-emerald-400" />
                    </div>
                    <span className="text-sm font-semibold uppercase tracking-wider text-emerald-400 mb-1">
                      {currentProduct.category}
                    </span>
                    <h3 className="text-lg font-bold text-white max-w-xs">{currentProduct.name}</h3>
                  </div>
                )}

                {/* Top Left Discount Badge */}
                {discountPct > 0 && (
                  <div className="absolute top-6 left-6 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600/95 text-white font-display font-extrabold text-sm sm:text-base shadow-xl backdrop-blur border border-rose-400/40 tracking-wider">
                    <Percent className="w-4 h-4" />
                    <span>{discountPct}% SPECIAL DISCOUNT</span>
                  </div>
                )}

                {/* Top Right Product Tag / Quality Mark */}
                {currentProduct.badge && (
                  <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/90 text-amber-300 font-semibold text-xs border border-amber-400/30 backdrop-blur shadow-md">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{currentProduct.badge}</span>
                  </div>
                )}

                {/* Bottom Barcode Strip */}
                <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between px-4 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-xs text-slate-300">
                  <div className="flex items-center gap-2 font-mono-numbers">
                    <Scan className="w-3.5 h-3.5 text-emerald-400" />
                    <span>SKU: {currentProduct.barcode}</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium">In Stock & Verified</span>
                </div>
              </div>
            </div>

            {/* Right Column: High-Impact Typography & Pricing Information */}
            <div className={`${compact ? 'col-span-1' : 'lg:col-span-6 xl:col-span-6'} flex flex-col justify-center space-y-5 lg:space-y-6`}>
              {/* Category & Store Assurance */}
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-md bg-emerald-950/70 text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider">
                  {currentProduct.category}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-slate-400 font-medium">{currentProduct.unit}</span>
              </div>

              {/* Product Headline */}
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-white tracking-tight leading-[1.15] text-balance">
                {currentProduct.name}
              </h2>

              {/* Price Banner Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-baseline flex-wrap gap-x-4 gap-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Special Price:</span>
                    <span className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-emerald-400 font-mono-numbers tracking-tight">
                      {settings.currency} {currentProduct.price.toLocaleString()}
                    </span>
                  </div>

                  {currentProduct.originalPrice > currentProduct.price && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base text-slate-500 line-through font-mono-numbers">
                        {settings.currency} {currentProduct.originalPrice.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Savings Callout */}
                {savingsAmount > 0 && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-300 font-semibold">
                    <Tag className="w-4 h-4 text-emerald-400" />
                    <span>
                      Customer Saves: <span className="font-mono-numbers text-white font-bold">{settings.currency} {savingsAmount.toLocaleString()}</span> today!
                    </span>
                  </div>
                )}
              </div>

              {/* Description Prose */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                {currentProduct.description}
              </p>

              {/* Quick Actions (Add to Customer Cart or Point) */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleQuickAdd}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm sm:text-base transition-all shadow-lg ${
                    addedNotice
                      ? 'bg-emerald-500 text-white scale-105'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40 hover:shadow-emerald-900/60'
                  }`}
                >
                  {addedNotice ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Added to Bill!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>Add to Customer Bill</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-slate-400 border border-slate-800 text-xs">
                  <span>Available at YSM Dargai Counter</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Billboard Controls & Thumbnail Strip */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-4">
            {/* Progress Bar */}
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Slideshow Controller Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPrev}
                  className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl transition-colors shadow-sm"
                  title="Previous Product"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    isPlaying
                      ? 'bg-slate-900 text-emerald-400 border-slate-700/80'
                      : 'bg-amber-600 text-white border-amber-500'
                  }`}
                  title={isPlaying ? 'Pause Auto-slide' : 'Resume Auto-slide'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? 'Auto-Playing' : 'Paused'}</span>
                </button>

                <button
                  onClick={goToNext}
                  className="p-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl transition-colors shadow-sm"
                  title="Next Product"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <span className="text-xs text-slate-400 font-mono-numbers ml-2 hidden sm:inline">
                  {currentIndex + 1} of {activeProducts.length} Products
                </span>
              </div>

              {/* Next Products Thumbnail Previews */}
              <div className="flex items-center gap-2 overflow-x-auto max-w-md py-1">
                {activeProducts.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setProgress(0);
                    }}
                    className={`relative w-11 h-11 shrink-0 rounded-lg overflow-hidden border transition-all ${
                      idx === currentIndex
                        ? 'border-emerald-500 scale-105 shadow-md ring-2 ring-emerald-500/30'
                        : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
                    }`}
                    title={p.name}
                  >
                    {p.image ? (
                      <img src={p.image} alt={p.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-900 flex items-center justify-center text-[10px] text-slate-400">
                        {p.name.slice(0, 2)}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ENLARGED PROMINENT TICKER BANNER (As requested by user with all details) */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-t-2 border-emerald-500/40 px-4 sm:px-6 py-3.5 flex items-center shadow-2xl overflow-hidden z-10">
        {/* Left Badge: YSM DEALS (Enlarged) */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shrink-0 mr-4 shadow-lg border border-amber-300">
          <Flame className="w-4 h-4 text-rose-700 animate-bounce" />
          <span>YSM DEALS</span>
        </div>

        {/* Scrolling Animated Ticker Text with User's Exact Content */}
        <div className="whitespace-nowrap overflow-hidden text-sm sm:text-base font-bold text-white flex-1">
          <div className="animate-marquee inline-flex items-center gap-8 font-display">
            <span className="flex items-center gap-2 text-emerald-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Welcome to Younas & Sons Mini Mart (YSM)
            </span>
            <span className="text-amber-400 font-black">★</span>
            <span className="flex items-center gap-2 text-white">
              Fresh Stock Arrived Daily
            </span>
            <span className="text-amber-400 font-black">★</span>
            <span className="flex items-center gap-2 text-emerald-300">
              Wholesale Rates on Ghee, Rice & Flour
            </span>
            <span className="text-amber-400 font-black">★</span>
            <span className="flex items-center gap-2 text-amber-300">
              <Truck className="w-4 h-4 text-emerald-400" />
              Free Home Delivery in Dargai on Orders over Rs. 2,000
            </span>
            <span className="text-amber-400 font-black">★</span>
            <span className="flex items-center gap-2 text-emerald-300 bg-emerald-900/60 px-3 py-1 rounded-lg border border-emerald-400/40">
              <Phone className="w-4 h-4 text-emerald-400" />
              Call & WhatsApp: 03163514886 (EasyPaisa Available)
            </span>
            <span className="text-amber-400 font-black">★</span>
          </div>
        </div>
      </div>
    </div>
  );
};
