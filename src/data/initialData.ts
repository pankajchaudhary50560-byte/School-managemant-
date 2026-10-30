import { FeeDemand, FeePayment, MarksheetRecord, Student } from '../types';

export const STORAGE_STUDENTS_KEY = 'spChaudharyStudentsDemo';
export const STORAGE_ATTENDANCE_KEY = 'spChaudharyAttendance';
export const STORAGE_FEE_DEMANDS_KEY = 'spChaudharyFeesDemandsDemo';
export const STORAGE_FEE_PAYMENTS_KEY = 'spChaudharyFeesPaymentsDemo';
export const STORAGE_MARKSHEETS_KEY = 'spChaudharyMarksheetsDemo';

export const INITIAL_STUDENTS: Student[] = [
  // Class 10 - Section A
  {
    id: 'std-10a-1',
    admissionNo: 'SPC-2024-101',
    rollNo: '1',
    studentName: 'Aarav Sharma',
    className: '10',
    section: 'A',
    gender: 'Male',
    fatherName: 'Rajesh Sharma',
    motherName: 'Sunita Sharma',
    phone: '9876543210',
    dob: '2010-05-15',
    address: 'Near Gandhi Chowk, Mathura, UP',
    createdAt: '2024-04-01',
  },
  {
    id: 'std-10a-2',
    admissionNo: 'SPC-2024-102',
    rollNo: '2',
    studentName: 'Priya Patel',
    className: '10',
    section: 'A',
    gender: 'Female',
    fatherName: 'Mukesh Patel',
    motherName: 'Geeta Patel',
    phone: '9876543211',
    dob: '2010-08-20',
    address: 'Station Road, Aligarh, UP',
    createdAt: '2024-04-02',
  },
  {
    id: 'std-10a-3',
    admissionNo: 'SPC-2024-103',
    rollNo: '3',
    studentName: 'Rohan Verma',
    className: '10',
    section: 'A',
    gender: 'Male',
    fatherName: 'Anil Verma',
    motherName: 'Kavita Verma',
    phone: '9876543212',
    dob: '2010-02-11',
    address: 'Civil Lines, Agra, UP',
    createdAt: '2024-04-02',
  },
  {
    id: 'std-10a-4',
    admissionNo: 'SPC-2024-104',
    rollNo: '4',
    studentName: 'Ananya Singh',
    className: '10',
    section: 'A',
    gender: 'Female',
    fatherName: 'Ramesh Singh',
    motherName: 'Suman Singh',
    phone: '9876543213',
    dob: '2010-11-04',
    address: 'Vikas Nagar, Mathura, UP',
    createdAt: '2024-04-03',
  },
  {
    id: 'std-10a-5',
    admissionNo: 'SPC-2024-105',
    rollNo: '5',
    studentName: 'Rahul Chaudhary',
    className: '10',
    section: 'A',
    gender: 'Male',
    fatherName: 'Devendra Chaudhary',
    motherName: 'Anita Chaudhary',
    phone: '9876543214',
    dob: '2010-07-28',
    address: 'Kalyanpur, Mathura, UP',
    createdAt: '2024-04-04',
  },
  {
    id: 'std-10a-6',
    admissionNo: 'SPC-2024-106',
    rollNo: '6',
    studentName: 'Sneha Gupta',
    className: '10',
    section: 'A',
    gender: 'Female',
    fatherName: 'Vinod Gupta',
    motherName: 'Pooja Gupta',
    phone: '9876543215',
    dob: '2010-09-17',
    address: 'Sadabad Gate, Hathras, UP',
    createdAt: '2024-04-04',
  },

  // Class 9 - Section A
  {
    id: 'std-9a-1',
    admissionNo: 'SPC-2024-201',
    rollNo: '1',
    studentName: 'Ayush Pandey',
    className: '9',
    section: 'A',
    gender: 'Male',
    fatherName: 'Santosh Pandey',
    motherName: 'Aarti Pandey',
    phone: '9876543230',
    dob: '2011-03-12',
    address: 'Shastri Nagar, Mathura, UP',
    createdAt: '2024-04-05',
  },
  {
    id: 'std-9a-2',
    admissionNo: 'SPC-2024-202',
    rollNo: '2',
    studentName: 'Simran Kaur',
    className: '9',
    section: 'A',
    gender: 'Female',
    fatherName: 'Harpreet Singh',
    motherName: 'Jaspreet Kaur',
    phone: '9876543231',
    dob: '2011-06-18',
    address: 'Govind Nagar, Mathura, UP',
    createdAt: '2024-04-05',
  },

  // Class 8 - Section A
  {
    id: 'std-8a-1',
    admissionNo: 'SPC-2024-301',
    rollNo: '1',
    studentName: 'Karan Saxena',
    className: '8',
    section: 'A',
    gender: 'Male',
    fatherName: 'Sanjay Saxena',
    motherName: 'Neelam Saxena',
    phone: '9876543240',
    dob: '2012-01-25',
    address: 'Kosi Kalan, UP',
    createdAt: '2024-04-06',
  },

  // Class 12 - Section A
  {
    id: 'std-12a-1',
    admissionNo: 'SPC-2024-701',
    rollNo: '1',
    studentName: 'Mayank Sen',
    className: '12',
    section: 'A',
    gender: 'Male',
    fatherName: 'Girish Sen',
    motherName: 'Mamta Sen',
    phone: '9876543280',
    dob: '2008-10-14',
    address: 'Krishna Nagar, Mathura, UP',
    createdAt: '2024-04-06',
  },
];

export const INITIAL_DEMANDS: FeeDemand[] = [
  {
    id: 'FEE-DEM-001',
    studentId: 'std-10a-1',
    feeType: 'Tuition Fee (मासिक शिक्षण शुल्क)',
    period: 'Quarter 1 (April - June 2026)',
    amountDue: 4500,
    note: 'Tuition + Lab Fee',
    createdAt: '2026-04-05',
  },
  {
    id: 'FEE-DEM-002',
    studentId: 'std-10a-2',
    feeType: 'Tuition Fee (मासिक शिक्षण शुल्क)',
    period: 'Quarter 1 (April - June 2026)',
    amountDue: 4500,
    note: 'Tuition Fee',
    createdAt: '2026-04-05',
  },
  {
    id: 'FEE-DEM-003',
    studentId: 'std-10a-3',
    feeType: 'Annual Examination Fee (वार्षिक परीक्षा शुल्क)',
    period: 'Session 2026-27',
    amountDue: 1800,
    note: 'Board Examination fee',
    createdAt: '2026-04-10',
  },
  {
    id: 'FEE-DEM-004',
    studentId: 'std-10a-4',
    feeType: 'Transport Fee (बस किराया)',
    period: 'Month of April 2026',
    amountDue: 1200,
    note: 'Route: Highway',
    createdAt: '2026-04-05',
  },
  {
    id: 'FEE-DEM-005',
    studentId: 'std-12a-1',
    feeType: 'Tuition Fee (मासिक शिक्षण शुल्क)',
    period: 'Quarter 1 (April - June 2026)',
    amountDue: 6000,
    note: 'Science Stream Tuition + Lab',
    createdAt: '2026-04-05',
  },
];

export const INITIAL_PAYMENTS: FeePayment[] = [
  {
    id: 'PAY-1001',
    receiptNo: 'SPF-20260408-001001',
    demandId: 'FEE-DEM-001',
    studentId: 'std-10a-1',
    amount: 4500,
    method: 'UPI',
    date: '2026-04-08',
    note: 'Paid via PhonePe',
  },
  {
    id: 'PAY-1002',
    receiptNo: 'SPF-20260410-001002',
    demandId: 'FEE-DEM-002',
    studentId: 'std-10a-2',
    amount: 2500,
    method: 'Cash',
    date: '2026-04-10',
    note: 'Partial cash payment',
  },
];

export const INITIAL_MARKSHEETS: MarksheetRecord[] = [
  {
    id: 'MARK-10a-1',
    studentId: 'std-10a-1',
    examTerm: 'Annual Examination 2026',
    academicYear: '2026-2027',
    subjects: [
      { subject: 'Hindi (हिंदी)', maxMarks: 100, theoryMarks: 88, totalMarks: 88 },
      { subject: 'English (अंग्रेजी)', maxMarks: 100, theoryMarks: 85, totalMarks: 85 },
      { subject: 'Mathematics (गणित)', maxMarks: 100, theoryMarks: 94, totalMarks: 94 },
      { subject: 'Science (विज्ञान)', maxMarks: 100, theoryMarks: 91, totalMarks: 91 },
      { subject: 'Social Science (सामाजिक विज्ञान)', maxMarks: 100, theoryMarks: 87, totalMarks: 87 },
      { subject: 'Computer Applications', maxMarks: 100, theoryMarks: 95, totalMarks: 95 },
    ],
    totalMaxMarks: 600,
    totalObtained: 540,
    percentage: 90.0,
    grade: 'A+',
    result: 'PASS',
    attendanceRate: 96,
    teacherRemarks: 'Outstanding academic excellence and leadership in classroom activities.',
    updatedAt: '2026-04-20T10:00:00.000Z',
  },
  {
    id: 'MARK-10a-2',
    studentId: 'std-10a-2',
    examTerm: 'Annual Examination 2026',
    academicYear: '2026-2027',
    subjects: [
      { subject: 'Hindi (हिंदी)', maxMarks: 100, theoryMarks: 82, totalMarks: 82 },
      { subject: 'English (अंग्रेजी)', maxMarks: 100, theoryMarks: 78, totalMarks: 78 },
      { subject: 'Mathematics (गणित)', maxMarks: 100, theoryMarks: 80, totalMarks: 80 },
      { subject: 'Science (विज्ञान)', maxMarks: 100, theoryMarks: 75, totalMarks: 75 },
      { subject: 'Social Science (सामाजिक विज्ञान)', maxMarks: 100, theoryMarks: 84, totalMarks: 84 },
      { subject: 'Computer Applications', maxMarks: 100, theoryMarks: 88, totalMarks: 88 },
    ],
    totalMaxMarks: 600,
    totalObtained: 487,
    percentage: 81.2,
    grade: 'A',
    result: 'PASS',
    attendanceRate: 92,
    teacherRemarks: 'Very good performance, disciplined and punctual.',
    updatedAt: '2026-04-20T10:00:00.000Z',
  },
];

// Helper methods to get data from localStorage with defaults
export function loadStoredData<T>(key: string, defaultData: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as unknown as T;
      if (typeof parsed === 'object' && parsed !== null && Object.keys(parsed).length > 0) return parsed as unknown as T;
    }
  } catch (e) {
    console.error(`Error loading key ${key}:`, e);
  }
  try {
    localStorage.setItem(key, JSON.stringify(defaultData));
  } catch (e) {
    console.error(`Error setting key ${key}:`, e);
  }
  return defaultData;
}
