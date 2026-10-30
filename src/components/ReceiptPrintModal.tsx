import React from 'react';
import { X, Printer, Check, Copy } from 'lucide-react';
import { CompletedSale, StoreSettings } from '../types';

interface ReceiptPrintModalProps {
  sale: CompletedSale | null;
  settings: StoreSettings;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptPrintModal: React.FC<ReceiptPrintModalProps> = ({
  sale,
  settings,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(sale.timestamp).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Toolbar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <span className="font-display font-bold text-sm text-white flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-400" />
            Thermal POS Receipt Preview
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Bill</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container (Styled like standard 80mm POS paper) */}
        <div className="p-6 overflow-y-auto max-h-[75vh] flex justify-center bg-slate-950/60">
          <div
            id="printable-receipt"
            className="w-full max-w-[340px] bg-white text-slate-900 font-mono text-[12px] p-5 rounded-lg shadow-xl border border-slate-200"
          >
            {/* Mart Brand & Header */}
            <div className="text-center pb-3 border-b border-dashed border-slate-300">
              <div className="inline-block bg-slate-900 text-white font-black text-sm px-2.5 py-0.5 rounded mb-1 tracking-widest">
                {settings.shortCode}
              </div>
              <h2 className="font-bold text-base uppercase tracking-tight text-slate-950 font-sans">
                {settings.storeName}
              </h2>
              <p className="text-[11px] text-slate-600 mt-0.5">{settings.location}</p>
              <p className="text-[10px] text-slate-500">{settings.houseAddress}</p>
              <p className="text-[11px] font-bold text-slate-900 mt-1">
                WhatsApp: {settings.phone}
              </p>
              <p className="text-[10px] text-emerald-800 font-semibold">
                (EasyPaisa Available on 03163514886)
              </p>
            </div>

            {/* Bill Meta Data */}
            <div className="py-2.5 border-b border-dashed border-slate-300 text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-600">Bill No:</span>
                <span className="font-bold text-slate-950">{sale.billNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Date & Time:</span>
                <span className="text-slate-800">{formattedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Cashier:</span>
                <span className="text-slate-800">{settings.cashierName}</span>
              </div>
              {sale.customerPhone && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Customer:</span>
                  <span className="text-slate-800">{sale.customerPhone}</span>
                </div>
              )}
            </div>

            {/* Line Items Table */}
            <div className="py-2.5 border-b border-dashed border-slate-300">
              <div className="grid grid-cols-12 font-bold text-[11px] pb-1 border-b border-slate-200 mb-2">
                <span className="col-span-6">Item</span>
                <span className="col-span-2 text-center">Qty</span>
                <span className="col-span-2 text-right">Price</span>
                <span className="col-span-2 text-right">Total</span>
              </div>

              <div className="space-y-1.5">
                {sale.items.map((item, idx) => {
                  const unitPrice = item.customPrice !== undefined ? item.customPrice : item.product.price;
                  return (
                    <div key={idx} className="grid grid-cols-12 text-[11px] leading-tight">
                      <span className="col-span-6 truncate font-sans font-medium text-slate-900">
                        {item.product.name}
                      </span>
                      <span className="col-span-2 text-center text-slate-700">
                        {item.quantity}
                      </span>
                      <span className="col-span-2 text-right text-slate-700">
                        {unitPrice}
                      </span>
                      <span className="col-span-2 text-right font-bold text-slate-950">
                        {unitPrice * item.quantity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Receipt Totals Summary */}
            <div className="py-2.5 border-b border-dashed border-slate-300 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-600">Total Items / Qty:</span>
                <span className="font-semibold text-slate-900">
                  {sale.items.length} items ({sale.items.reduce((s, i) => s + i.quantity, 0)} pcs)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal:</span>
                <span className="text-slate-900">{settings.currency} {sale.subtotal.toLocaleString()}</span>
              </div>
              {sale.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount / Savings:</span>
                  <span>- {settings.currency} {sale.discount.toLocaleString()}</span>
                </div>
              )}

              {/* NET GRAND TOTAL */}
              <div className="flex justify-between items-baseline pt-2 mt-1 border-t border-slate-300 font-sans">
                <span className="font-bold text-sm uppercase text-slate-950">NET PAYABLE:</span>
                <span className="font-black text-lg text-slate-950 font-mono">
                  {settings.currency} {sale.total.toLocaleString()}
                </span>
              </div>

              {/* Payment Details */}
              <div className="pt-2 border-t border-slate-200 space-y-0.5 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-slate-600">Payment Mode:</span>
                  <span className="font-semibold">{sale.paymentMethod}</span>
                </div>
                {sale.amountPaid > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Cash Received:</span>
                      <span>{settings.currency} {sale.amountPaid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>Change Returned:</span>
                      <span>{settings.currency} {sale.changeDue.toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Polite Urdu and English Store Footer */}
            <div className="pt-3 text-center space-y-1">
              <p className="font-semibold text-[11px] text-slate-900">
                Thank you for shopping with us!
              </p>
              <p className="text-[10px] text-slate-600" dir="rtl">
                آپ کے تعاون کا بہت بہت شکریہ!
              </p>
              <p className="text-[9px] text-slate-400">
                Please check your items before leaving the counter.
              </p>
              <div className="pt-2 text-[9px] text-slate-400 tracking-widest uppercase">
                *** YOUNAS & SONS MINI MART ***
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
