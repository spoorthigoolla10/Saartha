import React, { useState } from 'react';
import { api } from '../services/api';
import { Application } from '../types';

interface SimulatedPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application;
  onPaymentSuccess: () => void;
}

export const SimulatedPaymentModal: React.FC<SimulatedPaymentModalProps> = ({
  isOpen,
  onClose,
  application,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'netbanking' | 'card'>('netbanking');
  const [processing, setProcessing] = useState(false);
  const [outcome, setOutcome] = useState<'success' | 'failure' | null>(null);
  const [txRef, setTxRef] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const baseFee = application.priority === 'Tatkaal' ? 3500 : 1500;

  const handleSimulatePayment = async (shouldSucceed: boolean) => {
    setProcessing(true);
    setErrorMsg('');
    setOutcome(null);

    setTimeout(async () => {
      try {
        if (!shouldSucceed) {
          setProcessing(false);
          setOutcome('failure');
          setErrorMsg('Simulated Transaction Failure: Bank server timeout or mock insufficient balance.');
          return;
        }

        const methodName =
          selectedMethod === 'upi'
            ? 'Unified Payments Interface (UPI Demo)'
            : selectedMethod === 'netbanking'
            ? 'Net Banking (Consular Partner Bank Demo)'
            : 'Debit/Credit Card (Demo Gateway)';

        const res = await api.makeSimulatedPayment(application.id, baseFee, methodName);
        setTxRef(res.transaction_reference);
        setProcessing(false);
        setOutcome('success');
      } catch (err: any) {
        setProcessing(false);
        setErrorMsg(err.message || 'Payment simulation failed.');
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#29231F]/40 backdrop-blur-xs">
      <div 
        className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-[#E7DED6] overflow-hidden animate-in fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#F8ECE5] border-b border-[#E7DED6] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#6F4E37] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">payments</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-[#201A17]">Consular Fee Simulation Desk</h3>
              <p className="text-[11px] text-[#756B63]">Application {application.application_number}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-[#756B63] hover:text-[#201A17]">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Notice of Simulation */}
        <div className="px-4 py-2.5 bg-[#FEF8E7] border-b border-[#E7DED6] flex items-center gap-2 text-[12px] text-[#B37D14]">
          <span className="material-symbols-outlined text-[16px]">info</span>
          <span>
            <strong>Simulated Academic Payment:</strong> No real currency, bank details, card numbers, or PINs are collected.
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {outcome === 'success' ? (
            <div className="text-center py-4 space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#EAF5ED] text-[#2E6F40] mx-auto flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px]">check_circle</span>
              </div>
              <h4 className="font-semibold text-lg text-[#201A17]">Payment Successfully Acknowledged</h4>
              <p className="text-xs text-[#756B63] max-w-sm mx-auto">
                Fee of ₹{baseFee.toLocaleString()} received for {application.application_type}. Reference has been archived to the database ledger.
              </p>
              <div className="p-3 bg-[#F8F5F2] rounded-lg border border-[#E7DED6] font-mono text-xs text-[#201A17]">
                Reference ID: <strong className="text-[#6F4E37]">{txRef}</strong>
              </div>
              <button
                onClick={() => {
                  onPaymentSuccess();
                  onClose();
                }}
                className="w-full mt-4 py-2.5 rounded bg-[#6F4E37] text-white font-medium text-xs hover:bg-[#4B3621]"
              >
                Proceed to Appointment Booking
              </button>
            </div>
          ) : outcome === 'failure' ? (
            <div className="text-center py-4 space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#FFDAD6] text-[#BA1A1A] mx-auto flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px]">cancel</span>
              </div>
              <h4 className="font-semibold text-base text-[#201A17]">Transaction Simulated as Failed</h4>
              <p className="text-xs text-[#756B63]">{errorMsg}</p>
              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={() => setOutcome(null)}
                  className="px-4 py-2 text-xs font-medium rounded bg-[#6F4E37] text-white"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium rounded bg-[#F8ECE5] text-[#201A17]"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Fee Breakdown Box */}
              <div className="p-3.5 rounded-lg bg-[#FFF8F5] border border-[#E7DED6] space-y-2">
                <div className="flex justify-between text-xs text-[#756B63]">
                  <span>Statutory Intake Application Fee</span>
                  <span className="font-mono text-[#201A17]">₹{application.priority === 'Tatkaal' ? '2,000' : '1,500'}</span>
                </div>
                {application.priority === 'Tatkaal' && (
                  <div className="flex justify-between text-xs text-[#756B63]">
                    <span>Expedited Tatkaal Surcharge</span>
                    <span className="font-mono text-[#201A17]">₹1,500</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-[#756B63]">
                  <span>Electronic Vault Archival &amp; SMS Alerts</span>
                  <span className="font-mono text-[#201A17]">₹0 (Included)</span>
                </div>
                <div className="border-t border-[#E7DED6] pt-2 flex justify-between text-sm font-semibold text-[#201A17]">
                  <span>Total Payable (Simulated)</span>
                  <span className="font-mono text-[#6F4E37]">₹{baseFee.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-semibold text-[#201A17] mb-2 uppercase tracking-wider">
                  Select Mock Gateway Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('netbanking')}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      selectedMethod === 'netbanking'
                        ? 'border-[#6F4E37] bg-[#F8ECE5] text-[#6F4E37] font-semibold'
                        : 'border-[#E7DED6] bg-white text-[#756B63] hover:bg-[#FFF8F5]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px] block mb-1">account_balance</span>
                    <span className="text-xs">Net Banking</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('upi')}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      selectedMethod === 'upi'
                        ? 'border-[#6F4E37] bg-[#F8ECE5] text-[#6F4E37] font-semibold'
                        : 'border-[#E7DED6] bg-white text-[#756B63] hover:bg-[#FFF8F5]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px] block mb-1">qr_code_scanner</span>
                    <span className="text-xs">UPI Instant</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('card')}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      selectedMethod === 'card'
                        ? 'border-[#6F4E37] bg-[#F8ECE5] text-[#6F4E37] font-semibold'
                        : 'border-[#E7DED6] bg-white text-[#756B63] hover:bg-[#FFF8F5]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px] block mb-1">credit_card</span>
                    <span className="text-xs">Credit/Debit</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  disabled={processing}
                  onClick={() => handleSimulatePayment(true)}
                  className="w-full py-2.5 rounded bg-[#6F4E37] text-white hover:bg-[#4B3621] font-semibold text-xs transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">check</span>
                      <span>Simulate Successful Payment (₹{baseFee})</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  disabled={processing}
                  onClick={() => handleSimulatePayment(false)}
                  className="w-full py-2 rounded bg-white text-[#BA1A1A] border border-[#FFDAD6] hover:bg-[#FFDAD6]/30 font-medium text-xs transition-colors"
                >
                  Simulate Bank Gateway Failure
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
