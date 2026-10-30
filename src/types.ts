export type AttendanceStatus = 'Present' | 'Absent' | 'Leave';

export interface Student {
  id: string;
  admissionNo: string;
  rollNo: string;
  studentName: string;
  className: string;
  section: string;
  fatherName?: string;
  motherName?: string;
  gender?: 'Male' | 'Female' | 'Other';
  dob?: string;
  phone?: string;
  address?: string;
  photoUrl?: string;
  createdAt?: string;
}

export interface AttendanceEntry {
  studentId: string;
  admissionNo: string;
  rollNo: string;
  studentName: string;
  status: AttendanceStatus;
  remark?: string;
}

export interface AttendanceRecord {
  date: string;
  className: string;
  section: string;
  entries: AttendanceEntry[];
  updatedAt: string;
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  leave: number;
  percent: number;
  statusLabel: 'Excellent' | 'Good' | 'Average' | 'Low';
}

export interface FeeDemand {
  id: string;
  studentId: string;
  feeType: string; // 'Tuition Fee' | 'Admission Fee' | 'Exam Fee' | 'Transport Fee' | 'Computer Lab Fee'
  period: string; // e.g. 'April - June 2026', 'Term 1'
  amountDue: number;
  note?: string;
  createdAt: string;
}

export interface FeePayment {
  id: string;
  receiptNo: string;
  demandId: string;
  studentId: string;
  amount: number;
  method: 'Cash' | 'UPI' | 'Net Banking' | 'Cheque';
  date: string;
  note?: string;
}

export interface SubjectMark {
  subject: string;
  maxMarks: number;
  theoryMarks: number;
  practicalMarks?: number;
  totalMarks: number;
}

export interface MarksheetRecord {
  id: string;
  studentId: string;
  examTerm: string; // 'Term 1 / Half-Yearly' | 'Final / Annual Exam' | 'Unit Test'
  academicYear: string;
  subjects: SubjectMark[];
  totalMaxMarks: number;
  totalObtained: number;
  percentage: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';
  result: 'PASS' | 'COMPARTMENT' | 'FAIL';
  attendanceRate?: number;
  teacherRemarks?: string;
  updatedAt: string;
}
