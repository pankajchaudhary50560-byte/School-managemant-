import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateGrade,
  evaluateResult,
  computeMarksheetStats,
  formatINR,
  calculateFeeSummary,
  getDemandBalance,
} from './schoolLogic';
import { FeeDemand, FeePayment, SubjectMark } from '../types';

test('calculateGrade calculates CBSE standard grades correctly', () => {
  assert.equal(calculateGrade(95), 'A+');
  assert.equal(calculateGrade(82), 'A');
  assert.equal(calculateGrade(74), 'B+');
  assert.equal(calculateGrade(65), 'B');
  assert.equal(calculateGrade(55), 'C');
  assert.equal(calculateGrade(35), 'D');
  assert.equal(calculateGrade(28), 'F');
});

test('evaluateResult accurately decides PASS, COMPARTMENT, or FAIL', () => {
  const passingSubjects: SubjectMark[] = [
    { subject: 'Hindi', maxMarks: 100, theoryMarks: 70, totalMarks: 70 },
    { subject: 'English', maxMarks: 100, theoryMarks: 65, totalMarks: 65 },
    { subject: 'Maths', maxMarks: 100, theoryMarks: 80, totalMarks: 80 },
  ];
  assert.equal(evaluateResult(passingSubjects), 'PASS');

  const oneFailedSubjects: SubjectMark[] = [
    { subject: 'Hindi', maxMarks: 100, theoryMarks: 70, totalMarks: 70 },
    { subject: 'English', maxMarks: 100, theoryMarks: 20, totalMarks: 20 },
    { subject: 'Maths', maxMarks: 100, theoryMarks: 80, totalMarks: 80 },
  ];
  assert.equal(evaluateResult(oneFailedSubjects), 'COMPARTMENT');

  const threeFailedSubjects: SubjectMark[] = [
    { subject: 'Hindi', maxMarks: 100, theoryMarks: 10, totalMarks: 10 },
    { subject: 'English', maxMarks: 100, theoryMarks: 20, totalMarks: 20 },
    { subject: 'Maths', maxMarks: 100, theoryMarks: 15, totalMarks: 15 },
  ];
  assert.equal(evaluateResult(threeFailedSubjects), 'FAIL');
});

test('computeMarksheetStats computes total and percentage', () => {
  const subjects: SubjectMark[] = [
    { subject: 'Hindi', maxMarks: 100, theoryMarks: 90, totalMarks: 90 },
    { subject: 'English', maxMarks: 100, theoryMarks: 85, totalMarks: 85 },
    { subject: 'Mathematics', maxMarks: 100, theoryMarks: 95, totalMarks: 95 },
  ];
  const stats = computeMarksheetStats(subjects);
  assert.equal(stats.totalMax, 300);
  assert.equal(stats.totalObtained, 270);
  assert.equal(stats.percentage, 90);
  assert.equal(stats.grade, 'A+');
  assert.equal(stats.result, 'PASS');
});

test('formatINR formats currency properly', () => {
  const formatted = formatINR(15000);
  assert.ok(formatted.includes('15,000'));
});

test('calculateFeeSummary sums up demanded, collected and pending fees', () => {
  const demands: FeeDemand[] = [
    { id: 'd1', studentId: 's1', feeType: 'Tuition Fee', period: 'Apr', amountDue: 5000, createdAt: '2026-04-01' },
    { id: 'd2', studentId: 's2', feeType: 'Exam Fee', period: 'Apr', amountDue: 2000, createdAt: '2026-04-01' },
  ];
  const payments: FeePayment[] = [
    { id: 'p1', receiptNo: 'SPF-001', demandId: 'd1', studentId: 's1', amount: 5000, method: 'UPI', date: '2026-04-05' },
  ];

  const summary = calculateFeeSummary(demands, payments);
  assert.equal(summary.totalDemanded, 7000);
  assert.equal(summary.totalCollected, 5000);
  assert.equal(summary.totalPending, 2000);
  assert.equal(summary.paymentCount, 1);
});

test('getDemandBalance calculates balance and status correctly', () => {
  const demand: FeeDemand = { id: 'd1', studentId: 's1', feeType: 'Tuition Fee', period: 'Apr', amountDue: 5000, createdAt: '2026-04-01' };
  const partialPayment: FeePayment[] = [
    { id: 'p1', receiptNo: 'SPF-001', demandId: 'd1', studentId: 's1', amount: 2000, method: 'Cash', date: '2026-04-05' },
  ];

  const status1 = getDemandBalance(demand, partialPayment);
  assert.equal(status1.paid, 2000);
  assert.equal(status1.balance, 3000);
  assert.equal(status1.status, 'PARTIAL');

  const fullPayment: FeePayment[] = [
    ...partialPayment,
    { id: 'p2', receiptNo: 'SPF-002', demandId: 'd1', studentId: 's1', amount: 3000, method: 'UPI', date: '2026-04-10' },
  ];
  const status2 = getDemandBalance(demand, fullPayment);
  assert.equal(status2.paid, 5000);
  assert.equal(status2.balance, 0);
  assert.equal(status2.status, 'PAID');
});
