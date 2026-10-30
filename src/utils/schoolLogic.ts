import { FeeDemand, FeePayment, MarksheetRecord, SubjectMark } from '../types';

export function calculateGrade(percentage: number): 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F' {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 33) return 'D';
  return 'F';
}

export function evaluateResult(subjects: SubjectMark[]): 'PASS' | 'COMPARTMENT' | 'FAIL' {
  let failedCount = 0;
  for (const sub of subjects) {
    const minPass = Math.round(sub.maxMarks * 0.33);
    if (sub.totalMarks < minPass) {
      failedCount++;
    }
  }

  if (failedCount === 0) return 'PASS';
  if (failedCount <= 2) return 'COMPARTMENT';
  return 'FAIL';
}

export function computeMarksheetStats(subjects: SubjectMark[]): {
  totalMax: number;
  totalObtained: number;
  percentage: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';
  result: 'PASS' | 'COMPARTMENT' | 'FAIL';
} {
  const totalMax = subjects.reduce((sum, s) => sum + s.maxMarks, 0);
  const totalObtained = subjects.reduce((sum, s) => sum + s.totalMarks, 0);
  const percentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 1000) / 10 : 0;
  const grade = calculateGrade(percentage);
  const result = evaluateResult(subjects);

  return { totalMax, totalObtained, percentage, grade, result };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateFeeSummary(
  demands: FeeDemand[],
  payments: FeePayment[]
): {
  totalDemanded: number;
  totalCollected: number;
  totalPending: number;
  paymentCount: number;
} {
  const totalDemanded = demands.reduce((acc, d) => acc + (Number(d.amountDue) || 0), 0);
  const totalCollected = payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  const totalPending = Math.max(0, totalDemanded - totalCollected);

  return {
    totalDemanded,
    totalCollected,
    totalPending,
    paymentCount: payments.length,
  };
}

export function getDemandBalance(
  demand: FeeDemand,
  payments: FeePayment[]
): {
  paid: number;
  balance: number;
  status: 'PAID' | 'PARTIAL' | 'PENDING';
} {
  const paid = payments
    .filter((p) => p.demandId === demand.id)
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const balance = Math.max(0, (Number(demand.amountDue) || 0) - paid);

  let status: 'PAID' | 'PARTIAL' | 'PENDING' = 'PENDING';
  if (balance === 0 && paid > 0) status = 'PAID';
  else if (paid > 0 && balance > 0) status = 'PARTIAL';

  return { paid, balance, status };
}
