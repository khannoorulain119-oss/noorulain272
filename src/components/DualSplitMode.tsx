import React from 'react';
import { CustomerReceiptMode } from './CustomerReceiptMode';
import { BillboardMode } from './BillboardMode';
import { CartItem, Product, StoreSettings, CompletedSale } from '../types';

interface DualSplitModeProps {
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
}

export const DualSplitMode: React.FC<DualSplitModeProps> = ({
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
}) => {
  return (
    <div className="flex-1 flex flex-col xl:flex-row bg-slate-950 overflow-hidden divide-y xl:divide-y-0 xl:divide-x divide-slate-800">
      {/* Left Pane: Customer Bill & POS (58% width on 27" screen) */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <CustomerReceiptMode
          items={items}
          products={products}
          settings={settings}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
          onClearCart={onClearCart}
          onAddToCart={onAddToCart}
          onAddCustomItem={onAddCustomItem}
          onCompleteSale={onCompleteSale}
          onOpenPrintModal={onOpenPrintModal}
          compact={true}
        />
      </div>

      {/* Right Pane: Live Billboard Showcase (42% width on 27" screen) */}
      <div className="w-full xl:w-[48%] flex flex-col min-w-0 h-full overflow-hidden bg-slate-950">
        <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
          <span className="font-semibold text-emerald-400 uppercase tracking-wider">
            Today's Promotional Deals
          </span>
          <span className="text-slate-400 font-mono-numbers text-[11px]">
            YSM Mini Mart · Dargai
          </span>
        </div>
        <BillboardMode
          products={products}
          settings={settings}
          onAddToCart={onAddToCart}
          compact={true}
        />
      </div>
    </div>
  );
};
