import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  Smartphone,
  Landmark,
  FileText,
  Clock,
  Users,
  ArrowRight,
  Zap,
  Copy,
  Mail,
  User,
  UserCheck
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { useToast } from '../../context/ToastContext';
import { CollegeManagementRole, SubscriptionReceipt } from '../../types';
import confetti from 'canvas-confetti';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({ isOpen, onClose }) => {
  const { subscription, purchase3MonthPass } = useSubscription();
  const { showToast } = useToast();

  const [step, setStep] = useState<'details' | 'method' | 'processing' | 'success'>('details');

  // Plan Tier: Standard 25,000 (50% OFF from 50,000) or Test Mode 1
  const [selectedPlanAmount, setSelectedPlanAmount] = useState<number>(25000);

  // Streamlined Form State (Only College Name, Person Name, and Designation)
  const [collegeName, setCollegeName] = useState<string>(subscription.collegeName || 'Coimbatore Institute of Technology');
  const [personName, setPersonName] = useState<string>(subscription.purchasedByName || 'Dr. R. Sundararajan');
  const [designation, setDesignation] = useState<CollegeManagementRole>(subscription.purchasedByRole || 'Principal');

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'po'>('upi');
  const [upiId, setUpiId] = useState<string>('9113811578@upi');
  const [cardNumber, setCardNumber] = useState<string>('4532 •••• •••• 8892');
  const [cardExpiry, setCardExpiry] = useState<string>('08/28');
  const [cardCvv, setCardCvv] = useState<string>('892');
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');
  const [poNumber, setPoNumber] = useState<string>('PO-CIT-2026-0912');

  const [completedReceipt, setCompletedReceipt] = useState<SubscriptionReceipt | null>(null);

  if (!isOpen) return null;

  const upiQrString = `upi://pay?pa=${upiId || '9113811578@upi'}&pn=SpeakSure+AI+College&am=${selectedPlanAmount}&cu=INR&tn=SpeakSure_3Month_Pass`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiQrString)}&color=6366f1&bgcolor=020617`;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collegeName.trim() || !personName.trim()) {
      showToast('Please enter your College Name and Person Name.', 'info');
      return;
    }
    setStep('method');
  };

  const handleExecutePayment = async () => {
    setStep('processing');

    const methodLabels: Record<string, string> = {
      upi: `Razorpay UPI (${upiId})`,
      card: `Credit/Debit Card (•••• ${cardNumber.slice(-4)})`,
      netbanking: `NetBanking (${selectedBank})`,
      po: `Institutional PO (${poNumber})`
    };

    const targetEmail = subscription.purchasedByEmail || 'management@college.edu.in';

    setTimeout(async () => {
      try {
        const receipt = await purchase3MonthPass({
          collegeName,
          purchaserName: personName,
          purchaserRole: designation,
          purchaserEmail: targetEmail,
          paymentMethod: methodLabels[paymentMethod] || 'Razorpay Gateway',
          amount: selectedPlanAmount
        });

        setCompletedReceipt(receipt);
        setStep('success');

        confetti({
          particleCount: 140,
          spread: 85,
          origin: { y: 0.6 }
        });

        showToast(`🎉 Payment of ₹${selectedPlanAmount} Successful! Formal receipt emailed.`, 'success');
      } catch (e) {
        showToast('Payment processing error. Please retry.', 'error');
        setStep('method');
      }
    }, 2000);
  };

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    showToast('UPI VPA 9113811578@upi copied! Open GPay/PhonePe to pay.', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">

        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white">College Management Payment Gateway</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold uppercase">
                  50% OFF Limited Offer
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Official Institutional Pass for CEO, Chairman, Principal & Management
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800/60 flex items-center justify-between text-xs">
          <div className={`flex items-center gap-2 ${step === 'details' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center text-[10px]">1</span>
            <span>College Details</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <div className={`flex items-center gap-2 ${step === 'method' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center text-[10px]">2</span>
            <span>Payment Method</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <div className={`flex items-center gap-2 ${step === 'success' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
            <span className="w-5 h-5 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center text-[10px]">3</span>
            <span>Email Receipt</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto custom-scrollbar">

          {/* STEP 1: Institutional Details & Amount Selection */}
          {step === 'details' && (
            <form onSubmit={handleProceedToPayment} className="space-y-5">

              {/* Amount Selector Tabs: 50% OFF 25,000 vs ₹1 Live Test */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Select Payment Amount</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPlanAmount(25000)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedPlanAmount === 25000
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/20'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">1 Semester Pass (3 Months)</span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        50% OFF
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-lg font-black text-emerald-400">₹25,000</span>
                      <span className="text-xs text-slate-500 line-through">₹50,000</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Unlimited Students Access</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPlanAmount(1)}
                    className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                      selectedPlanAmount === 1
                        ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[9px] uppercase">
                      Test Scan
                    </span>
                    <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-400" /> ₹1 Live Test Payment
                    </div>
                    <div className="text-lg font-black text-amber-400 mt-1">₹1.00</div>
                    <div className="text-[10px] text-slate-400">Scan QR via GPay / PhonePe</div>
                  </button>
                </div>
              </div>

              {/* Streamlined Institutional Details Form (College Name, Person Name, Designation ONLY) */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  <span>College Professional Details</span>
                </h4>

                {/* 1. College Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>College Name *</span>
                  </label>
                  <input
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="e.g. Coimbatore Institute of Technology"
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 2. Person Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Person Name *</span>
                    </label>
                    <input
                      type="text"
                      value={personName}
                      onChange={(e) => setPersonName(e.target.value)}
                      placeholder="e.g. Dr. R. Sundararajan"
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>

                  {/* 3. Designation */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Designation *</span>
                    </label>
                    <select
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value as CollegeManagementRole)}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Principal">Principal</option>
                      <option value="CEO">CEO</option>
                      <option value="Chairman">Chairman</option>
                      <option value="Placement Director">Placement Director</option>
                      <option value="Management Admin">Management Admin</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30"
                >
                  <span>Select Payment Method (₹{selectedPlanAmount.toLocaleString()})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Payment Gateway Selection */}
          {step === 'method' && (
            <div className="space-y-6">

              {/* Amount Header */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">College: {collegeName}</div>
                  <div className="text-sm font-extrabold text-white">{personName} ({designation})</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 line-through">₹50,000</div>
                  <div className="text-2xl font-black text-emerald-400">₹{selectedPlanAmount.toLocaleString()}</div>
                </div>
              </div>

              {/* Payment Methods Selection Grid */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Select Payment Option</label>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'upi'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/20'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-indigo-400 mb-2" />
                    <div>
                      <div className="text-xs font-bold text-white">UPI / QR Code</div>
                      <div className="text-[10px] text-slate-400">GPay, PhonePe, Paytm</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/20'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-purple-400 mb-2" />
                    <div>
                      <div className="text-xs font-bold text-white">Cards</div>
                      <div className="text-[10px] text-slate-400">Visa, Mastercard, RuPay</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'netbanking'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/20'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Landmark className="w-5 h-5 text-amber-400 mb-2" />
                    <div>
                      <div className="text-xs font-bold text-white">NetBanking</div>
                      <div className="text-[10px] text-slate-400">HDFC, ICICI, SBI</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('po')}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'po'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/20'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <FileText className="w-5 h-5 text-emerald-400 mb-2" />
                    <div>
                      <div className="text-xs font-bold text-white">College PO</div>
                      <div className="text-[10px] text-slate-400">Wire Transfer</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* UPI QR & VPA Live Scannable Option (9113811578@upi) */}
              {paymentMethod === 'upi' && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-6">

                    {/* QR Code Graphic */}
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-center shrink-0">
                      <img src={qrImageUrl} alt="UPI Payment QR Code" className="w-40 h-40 mx-auto rounded-xl shadow-md" />
                      <span className="text-[10px] text-indigo-300 font-bold mt-1.5 block">
                        Scan QR with GPay / PhonePe / Paytm
                      </span>
                    </div>

                    <div className="space-y-3 flex-1">
                      <div>
                        <label className="text-xs font-bold text-slate-300">Official UPI ID / VPA</label>
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-indigo-500"
                          />
                          <button
                            type="button"
                            onClick={handleCopyUpiId}
                            className="p-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 shrink-0"
                            title="Copy UPI ID"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-300 space-y-1">
                        <div className="font-semibold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Scannable for ₹{selectedPlanAmount.toLocaleString()}
                        </div>
                        <p className="text-slate-400">
                          Scan the QR code using Google Pay / PhonePe to send ₹{selectedPlanAmount.toLocaleString()} to <strong>9113811578@upi</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Corporate / Management Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <label className="block text-xs font-semibold text-slate-300">Select Institutional Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="HDFC Bank">HDFC Bank Corporate</option>
                    <option value="ICICI Bank">ICICI Bank Enterprise</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="Axis Bank">Axis Bank Commercial</option>
                    <option value="Canara Bank">Canara Bank Institutional</option>
                  </select>
                </div>
              )}

              {paymentMethod === 'po' && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Purchase Order (PO) / Wire Reference Number</label>
                    <input
                      type="text"
                      value={poNumber}
                      onChange={(e) => setPoNumber(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* Security Shield */}
              <div className="flex items-center gap-2 text-[11px] text-slate-400 justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>256-Bit SSL Encrypted Gateway • Formal Email Receipt Dispatch</span>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  Back to Details
                </button>

                <button
                  type="button"
                  onClick={handleExecutePayment}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-600/30 hover:scale-105 transition-transform"
                >
                  <Lock className="w-4 h-4" />
                  <span>Confirm & Pay ₹{selectedPlanAmount.toLocaleString()}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Processing Animation */}
          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
                <Lock className="w-8 h-8 text-indigo-400 animate-pulse" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-white">Authorizing ₹{selectedPlanAmount.toLocaleString()} Payment...</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Activating 3-Month Pass for {collegeName} & Dispatching Email Receipt
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: Success Receipt & Email Confirmation */}
          {step === 'success' && completedReceipt && (
            <div className="space-y-6">
              {/* Success Badge Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/40 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                    Institutional Access Activated
                  </span>
                  <h3 className="text-xl font-black text-white mt-2">
                    1 Semester (3 Months) Pass Activated!
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                    All students of {completedReceipt.collegeName} now have full unlimited access for 90 days.
                  </p>
                </div>
              </div>

              {/* Email Sent Confirmation Card */}
              <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/30 text-indigo-300 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <span>Official Payment Receipt Emailed</span>
                      <span className="text-[10px] text-emerald-400 font-bold">✓ Sent</span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      A formal payment receipt & tax invoice has been sent to your registered official email address.
                    </p>
                  </div>
                </div>

                {/* Email Summary Box */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2 font-mono">
                  <div className="text-slate-400 flex justify-between">
                    <span>Receipt ID:</span> <span className="text-indigo-400 font-bold">{completedReceipt.transactionId}</span>
                  </div>
                  <div className="text-slate-400 flex justify-between">
                    <span>College Name:</span> <span className="text-white font-bold">{completedReceipt.collegeName}</span>
                  </div>
                  <div className="text-slate-400 flex justify-between">
                    <span>Person Name:</span> <span className="text-white font-bold">{completedReceipt.purchaserName} ({completedReceipt.purchaserRole})</span>
                  </div>
                  <div className="text-slate-400 flex justify-between">
                    <span>Amount Paid:</span> <span className="text-emerald-400 font-bold">{completedReceipt.currency}{completedReceipt.amount.toLocaleString()}</span>
                  </div>
                  <div className="text-slate-400 flex justify-between">
                    <span>Validity Period:</span> <span className="text-amber-300 font-bold">90 Days (1 Semester)</span>
                  </div>
                  <div className="text-slate-400 flex justify-between">
                    <span>Institutional License Key:</span> <span className="text-purple-400 font-bold">{completedReceipt.licenseKey}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
                >
                  <span>Launch Student Portal</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
