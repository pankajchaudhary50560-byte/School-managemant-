import React, { useState, useMemo } from 'react';
import {
  Receipt,
  PlusCircle,
  CreditCard,
  Printer,
  Download,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  School,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FeeDemand, FeePayment, Student } from '../types';
import { calculateFeeSummary, formatINR, getDemandBalance } from '../utils/schoolLogic';
import { formatIndianDate } from '../utils/attendanceLogic';

interface FeesViewProps {
  students: Student[];
  demands: FeeDemand[];
  payments: FeePayment[];
  onAddDemand: (demand: Omit<FeeDemand, 'id' | 'createdAt'>) => void;
  onAddPayment: (payment: Omit<FeePayment, 'id' | 'receiptNo'>) => void;
  onShowToast: (type: 'success' | 'error' | 'info', msg: string) => void;
}

export const FeesView: React.FC<FeesViewProps> = ({
  students,
  demands,
  payments,
  onAddDemand,
  onAddPayment,
  onShowToast,
}) => {
  // Tabs: 'ledger' | 'collect' | 'demand'
  const [activeTab, setActiveTab] = useState<'ledger' | 'collect' | 'demand'>('ledger');

  // Search in ledger
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('');

  // Collect Payment Form state
  const [payStudentId, setPayStudentId] = useState('');
  const [payDemandId, setPayDemandId] = useState('');
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<'Cash' | 'UPI' | 'Net Banking' | 'Cheque'>('UPI');
  const [payDate, setPayDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [payNote, setPayNote] = useState('');

  // Add Demand Form state
  const [demandStudentId, setDemandStudentId] = useState('');
  const [demandType, setDemandType] = useState('Tuition Fee (मासिक शिक्षण शुल्क)');
  const [demandPeriod, setDemandPeriod] = useState('Month of ' + new Date().toLocaleString('en-US', { month: 'long' }) + ' 2026');
  const [demandAmount, setDemandAmount] = useState<number>(2000);
  const [demandNote, setDemandNote] = useState('');

  // Active Receipt Modal
  const [activeReceipt, setActiveReceipt] = useState<{
    payment: FeePayment;
    demand: FeeDemand;
    student: Student;
    balance: number;
  } | null>(null);

  // Overall calculations
  const summary = useMemo(() => calculateFeeSummary(demands, payments), [demands, payments]);

  // Pending demands for chosen student
  const studentPendingDemands = useMemo(() => {
    if (!payStudentId) return [];
    return demands
      .filter((d) => d.studentId === payStudentId)
      .map((d) => {
        const { paid, balance, status } = getDemandBalance(d, payments);
        return { ...d, paid, balance, status };
      })
      .filter((d) => d.balance > 0);
  }, [payStudentId, demands, payments]);

  // When payStudentId changes, default demand to first pending demand
  const handleSelectStudentForPayment = (stId: string) => {
    setPayStudentId(stId);
    const pendings = demands
      .filter((d) => d.studentId === stId)
      .map((d) => {
        const { balance } = getDemandBalance(d, payments);
        return { ...d, balance };
      })
      .filter((d) => d.balance > 0);

    if (pendings.length > 0) {
      setPayDemandId(pendings[0].id);
      setPayAmount(pendings[0].balance);
    } else {
      setPayDemandId('');
      setPayAmount(0);
    }
  };

  const handleSelectDemandForPayment = (demId: string) => {
    setPayDemandId(demId);
    const d = demands.find((item) => item.id === demId);
    if (d) {
      const { balance } = getDemandBalance(d, payments);
      setPayAmount(balance);
    }
  };

  // Submit Payment
  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payStudentId || !payDemandId || payAmount <= 0) {
      alert('कृपया विद्यार्थी, फीस मद और सही राशि चुनें।');
      return;
    }

    const demand = demands.find((d) => d.id === payDemandId);
    const student = students.find((s) => s.id === payStudentId);
    if (!demand || !student) return;

    const receiptNo = `SPF-${payDate.replace(/-/g, '')}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newPayment: FeePayment = {
      id: `PAY-${Date.now()}`,
      receiptNo,
      demandId: payDemandId,
      studentId: payStudentId,
      amount: payAmount,
      method: payMethod,
      date: payDate,
      note: payNote,
    };

    onAddPayment(newPayment);

    const prevBalance = getDemandBalance(demand, payments).balance;
    const remaining = Math.max(0, prevBalance - payAmount);

    setActiveReceipt({
      payment: newPayment,
      demand,
      student,
      balance: remaining,
    });

    confetti({ particleCount: 35, spread: 60 });
    onShowToast('success', `फीस राशि ${formatINR(payAmount)} सफलतापूर्वक जमा हो गई! रसीद तैयार है।`);
    setPayNote('');
    setActiveTab('ledger');
  };

  // Submit Demand
  const handleSubmitDemand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demandStudentId || demandAmount <= 0) {
      alert('कृपया विद्यार्थी और सही राशि भरें।');
      return;
    }

    onAddDemand({
      studentId: demandStudentId,
      feeType: demandType,
      period: demandPeriod,
      amountDue: demandAmount,
      note: demandNote,
    });

    onShowToast('success', `फीस रिकॉर्ड (₹${demandAmount}) जोड़ दिया गया!`);
    setDemandNote('');
    setActiveTab('ledger');
  };

  // Export Ledger
  const handleExportLedgerCsv = () => {
    const headers = ['Receipt No', 'Date', 'Student Name', 'Admission No', 'Fee Type', 'Amount Paid', 'Method'];
    const rows = payments.map((p) => {
      const student = students.find((s) => s.id === p.studentId);
      const demand = demands.find((d) => d.id === p.demandId);
      return [
        `"${p.receiptNo}"`,
        `"${p.date}"`,
        `"${student?.studentName || ''}"`,
        `"${student?.admissionNo || ''}"`,
        `"${demand?.feeType || ''}"`,
        `"${p.amount}"`,
        `"${p.method}"`,
      ];
    });

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Fees_Collections_Ledger_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('info', 'फीस बहीखाता CSV फ़ाइल डाउनलोड हो गई।');
  };

  return (
    <div className="space-y-6">
      {/* Title & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 flex items-center gap-2">
            <span>💰 Fees Management (फीस प्रबंधन)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            फीस जमा करें, नई मांग दर्ज करें, रसीद (Receipt) निकालें एवं कुल संग्रह देखें।
          </p>
        </div>

        <div className="flex items-center space-x-1.5 bg-slate-200/80 p-1 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'ledger'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            बहीखाता (Ledger)
          </button>
          <button
            onClick={() => setActiveTab('collect')}
            className={`flex items-center space-x-1 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'collect'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>फीस जमा (Collect)</span>
          </button>
          <button
            onClick={() => setActiveTab('demand')}
            className={`flex items-center space-x-1 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'demand'
                ? 'bg-[#12366b] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>नई फीस जोड़ें</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Demanded</span>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-1">
            {formatINR(summary.totalDemanded)}
          </p>
          <p className="text-[11px] text-slate-400">कुल फीस मांग</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-100 shadow-xs">
          <span className="text-xs font-bold text-emerald-700 uppercase">Total Collected</span>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-1">
            {formatINR(summary.totalCollected)}
          </p>
          <p className="text-[11px] text-emerald-600/70">कुल प्राप्त राशि</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-rose-100 shadow-xs">
          <span className="text-xs font-bold text-rose-700 uppercase">Pending Balance</span>
          <p className="text-xl sm:text-2xl font-extrabold text-rose-600 mt-1">
            {formatINR(summary.totalPending)}
          </p>
          <p className="text-[11px] text-rose-600/70">कुल बकाया राशि</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Receipts Issued</span>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-1">
            {summary.paymentCount}
          </p>
          <p className="text-[11px] text-slate-400">रसीदों की संख्या</p>
        </div>
      </div>

      {/* COLLECT FEE PAYMENT TAB */}
      {activeTab === 'collect' && (
        <section className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-xs max-w-2xl mx-auto">
          <div className="pb-4 border-b border-slate-100 mb-6 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">फीस जमा फॉर्म (Fee Payment Form)</h2>
              <p className="text-xs text-slate-400">विद्यार्थी चुनें एवं रसीद जनरेट करें</p>
            </div>
          </div>

          <form onSubmit={handleSubmitPayment} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Select Student (विद्यार्थी चुनें) <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={payStudentId}
                onChange={(e) => handleSelectStudentForPayment(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold"
              >
                <option value="">-- विद्यार्थी चुनें --</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.studentName} (Roll: #{s.rollNo}, Class {s.className}-{s.section})
                  </option>
                ))}
              </select>
            </div>

            {payStudentId && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Pending Fee (बकाया फीस चुनें) <span className="text-rose-500">*</span>
                </label>
                {studentPendingDemands.length === 0 ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl">
                    ✅ इस छात्र की कोई बकाया फीस नहीं है!
                  </div>
                ) : (
                  <select
                    required
                    value={payDemandId}
                    onChange={(e) => handleSelectDemandForPayment(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
                  >
                    <option value="">-- फीस चुनें --</option>
                    {studentPendingDemands.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.feeType} ({d.period}) — बकाया: {formatINR(d.balance)}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Payment Amount (जमा राशि ₹) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={payAmount || ''}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-bold text-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Payment Method (भुगतान माध्यम) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold"
                >
                  <option value="UPI">UPI / PhonePe / GPay</option>
                  <option value="Cash">Cash (नकद)</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Cheque">Cheque (चेक)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Payment Date (भुगतान की तारीख)
              </label>
              <input
                type="date"
                value={payDate}
                onChange={(e) => setPayDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Notes / Transaction Ref (टिप्पणी)
              </label>
              <input
                type="text"
                placeholder="e.g. UPI Ref: 3948201948 or Receipt note"
                value={payNote}
                onChange={(e) => setPayNote(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="pt-4 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setActiveTab('ledger')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                disabled={!payDemandId || payAmount <= 0}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all"
              >
                💾 फीस जमा करें व रसीद प्राप्त करें
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ADD DEMAND TAB */}
      {activeTab === 'demand' && (
        <section className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-xs max-w-2xl mx-auto">
          <div className="pb-4 border-b border-slate-100 mb-6 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#12366b] flex items-center justify-center">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">नई फीस मांग जोड़ें (Add Fee Demand)</h2>
              <p className="text-xs text-slate-400">छात्र के खाते में शुल्क मांग दर्ज करें</p>
            </div>
          </div>

          <form onSubmit={handleSubmitDemand} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Select Student <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={demandStudentId}
                onChange={(e) => setDemandStudentId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
              >
                <option value="">-- विद्यार्थी चुनें --</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.studentName} (Roll: #{s.rollNo}, Class {s.className}-{s.section})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Fee Type (शुल्क प्रकार) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={demandType}
                  onChange={(e) => setDemandType(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Tuition Fee (मासिक शिक्षण शुल्क)">Tuition Fee (शिक्षण शुल्क)</option>
                  <option value="Annual Examination Fee (वार्षिक परीक्षा शुल्क)">Examination Fee (परीक्षा शुल्क)</option>
                  <option value="Transport Fee (बस किराया)">Transport Fee (बस शुल्क)</option>
                  <option value="Admission / Registration Fee">Admission Fee (प्रवेश शुल्क)</option>
                  <option value="Computer & Lab Fee">Computer Lab Fee (कंप्यूटर लैब)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Amount Due (राशि ₹) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={demandAmount || ''}
                  onChange={(e) => setDemandAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Period / Details (सत्र / माह का विवरण)
              </label>
              <input
                type="text"
                placeholder="e.g. Quarter 1 (April - June 2026)"
                value={demandPeriod}
                onChange={(e) => setDemandPeriod(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Remarks / Note
              </label>
              <input
                type="text"
                placeholder="e.g. Standard fees"
                value={demandNote}
                onChange={(e) => setDemandNote(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="pt-4 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setActiveTab('ledger')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#12366b] hover:bg-blue-900 text-white font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all"
              >
                💾 मांग दर्ज करें (Save Demand)
              </button>
            </div>
          </form>
        </section>
      )}

      {/* LEDGER & TRANSACTIONS TAB */}
      {activeTab === 'ledger' && (
        <section className="space-y-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              <div className="relative min-w-[220px] flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search student, fee type, receipt no..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">All Classes</option>
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>
            </div>

            <button
              onClick={handleExportLedgerCsv}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Ledger</span>
            </button>
          </div>

          {/* Demands Table with Status */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base text-slate-800">
                फीस मांग एवं भुगतान स्थिति (Fee Status Ledger)
              </h3>
              <span className="text-xs text-slate-400">{demands.length} Records</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px] text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Fee Type & Period</th>
                    <th className="py-3 px-4">Due</th>
                    <th className="py-3 px-4">Paid</th>
                    <th className="py-3 px-4">Balance</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {demands
                    .filter((d) => {
                      const student = students.find((s) => s.id === d.studentId);
                      if (!student) return false;
                      if (filterClass && student.className !== filterClass) return false;
                      if (!searchQuery) return true;
                      const q = searchQuery.toLowerCase();
                      return (
                        student.studentName.toLowerCase().includes(q) ||
                        student.admissionNo.toLowerCase().includes(q) ||
                        d.feeType.toLowerCase().includes(q) ||
                        d.period.toLowerCase().includes(q)
                      );
                    })
                    .map((demand) => {
                      const student = students.find((s) => s.id === demand.studentId);
                      const { paid, balance, status } = getDemandBalance(demand, payments);

                      return (
                        <tr key={demand.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-800 block">
                              {student ? student.studentName : 'Unknown'}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">
                              {student?.admissionNo}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-700">
                            Class {student?.className} ({student?.section})
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-slate-800">{demand.feeType}</div>
                            <div className="text-[11px] text-slate-400">{demand.period}</div>
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-800">
                            {formatINR(demand.amountDue)}
                          </td>
                          <td className="py-3 px-4 font-bold text-emerald-600">
                            {formatINR(paid)}
                          </td>
                          <td className="py-3 px-4 font-bold text-rose-600">
                            {formatINR(balance)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                status === 'PAID'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : status === 'PARTIAL'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Official Printable Fee Receipt Modal */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-[#12366b] text-white px-5 py-3.5 flex items-center justify-between no-print">
              <span className="font-bold text-sm">Official Fee Payment Receipt</span>
              <button
                onClick={() => setActiveReceipt(null)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Receipt Body */}
            <div className="p-6 text-slate-800 text-xs sm:text-sm bg-white" id="printableReceipt">
              <div className="text-center pb-4 border-b-2 border-slate-800">
                <div className="inline-flex items-center justify-center space-x-2 text-[#12366b] mb-1">
                  <School className="w-6 h-6" />
                  <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider">
                    SP CHAUDHARY SCHOOL
                  </h2>
                </div>
                <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                  FEE PAYMENT RECEIPT (फीस रसीद)
                </h3>
              </div>

              <div className="mt-4 space-y-2 font-medium">
                <div className="flex justify-between pb-1 border-b border-slate-100">
                  <span className="text-slate-400">Receipt No:</span>
                  <strong className="font-mono text-slate-800">{activeReceipt.payment.receiptNo}</strong>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-100">
                  <span className="text-slate-400">Date:</span>
                  <strong className="text-slate-800">{formatIndianDate(activeReceipt.payment.date)}</strong>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-100">
                  <span className="text-slate-400">Student Name:</span>
                  <strong className="text-slate-800">{activeReceipt.student.studentName}</strong>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-100">
                  <span className="text-slate-400">Admission No:</span>
                  <strong className="font-mono text-slate-800">{activeReceipt.student.admissionNo}</strong>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-100">
                  <span className="text-slate-400">Class / Section:</span>
                  <strong className="text-slate-800">
                    Class {activeReceipt.student.className} ({activeReceipt.student.section})
                  </strong>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-100">
                  <span className="text-slate-400">Fee Type:</span>
                  <strong className="text-slate-800">{activeReceipt.demand.feeType}</strong>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-100">
                  <span className="text-slate-400">Fee Details / Period:</span>
                  <strong className="text-slate-800">{activeReceipt.demand.period}</strong>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-100">
                  <span className="text-slate-400">Payment Method:</span>
                  <strong className="text-slate-800">{activeReceipt.payment.method}</strong>
                </div>
                <div className="flex justify-between py-2 text-base font-extrabold bg-emerald-50 px-2 rounded-lg text-emerald-800">
                  <span>Amount Received:</span>
                  <span>{formatINR(activeReceipt.payment.amount)}</span>
                </div>
                <div className="flex justify-between pb-1 pt-1 border-b border-slate-100">
                  <span className="text-slate-400">Remaining Balance:</span>
                  <strong className="text-rose-600">{formatINR(activeReceipt.balance)}</strong>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-dashed border-slate-300 flex justify-between items-end text-xs">
                <div>
                  <p className="text-[11px] text-slate-500 italic">राशि जमा करने के लिए धन्यवाद।</p>
                  <p className="text-[10px] text-slate-400 mt-1">Computer Generated Receipt</p>
                </div>
                <div className="text-right">
                  <div className="h-8 border-b border-slate-400 w-32 ml-auto mb-1"></div>
                  <strong className="text-slate-800 block">अधिकृत हस्ताक्षर</strong>
                  <span className="text-[10px] text-slate-400">(Authorized Signatory)</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-2 no-print">
              <button
                onClick={() => setActiveReceipt(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt (रसीद प्रिंट करें)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
