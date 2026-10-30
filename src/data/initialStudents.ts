import { Student } from '../types';

export const STORAGE_STUDENTS_KEY = 'spChaudharyStudentsDemo';
export const STORAGE_ATTENDANCE_KEY = 'spChaudharyAttendance';

export const INITIAL_STUDENTS: Student[] = [
  // Class 10 - Section A
  { id: 'std-10a-1', admissionNo: 'SPC-2024-101', rollNo: '1', studentName: 'Aarav Sharma', className: '10', section: 'A', gender: 'Male', phone: '9876543210' },
  { id: 'std-10a-2', admissionNo: 'SPC-2024-102', rollNo: '2', studentName: 'Priya Patel', className: '10', section: 'A', gender: 'Female', phone: '9876543211' },
  { id: 'std-10a-3', admissionNo: 'SPC-2024-103', rollNo: '3', studentName: 'Rohan Verma', className: '10', section: 'A', gender: 'Male', phone: '9876543212' },
  { id: 'std-10a-4', admissionNo: 'SPC-2024-104', rollNo: '4', studentName: 'Ananya Singh', className: '10', section: 'A', gender: 'Female', phone: '9876543213' },
  { id: 'std-10a-5', admissionNo: 'SPC-2024-105', rollNo: '5', studentName: 'Rahul Chaudhary', className: '10', section: 'A', gender: 'Male', phone: '9876543214' },
  { id: 'std-10a-6', admissionNo: 'SPC-2024-106', rollNo: '6', studentName: 'Sneha Gupta', className: '10', section: 'A', gender: 'Female', phone: '9876543215' },
  { id: 'std-10a-7', admissionNo: 'SPC-2024-107', rollNo: '7', studentName: 'Aditya Kumar', className: '10', section: 'A', gender: 'Male', phone: '9876543216' },
  { id: 'std-10a-8', admissionNo: 'SPC-2024-108', rollNo: '8', studentName: 'Kavya Yadav', className: '10', section: 'A', gender: 'Female', phone: '9876543217' },
  { id: 'std-10a-9', admissionNo: 'SPC-2024-109', rollNo: '9', studentName: 'Manish Tiwari', className: '10', section: 'A', gender: 'Male', phone: '9876543218' },
  { id: 'std-10a-10', admissionNo: 'SPC-2024-110', rollNo: '10', studentName: 'Divya Rajput', className: '10', section: 'A', gender: 'Female', phone: '9876543219' },

  // Class 10 - Section B
  { id: 'std-10b-1', admissionNo: 'SPC-2024-111', rollNo: '1', studentName: 'Vikas Meena', className: '10', section: 'B', gender: 'Male', phone: '9876543220' },
  { id: 'std-10b-2', admissionNo: 'SPC-2024-112', rollNo: '2', studentName: 'Ritu Jha', className: '10', section: 'B', gender: 'Female', phone: '9876543221' },
  { id: 'std-10b-3', admissionNo: 'SPC-2024-113', rollNo: '3', studentName: 'Gaurav Joshi', className: '10', section: 'B', gender: 'Male', phone: '9876543222' },
  { id: 'std-10b-4', admissionNo: 'SPC-2024-114', rollNo: '4', studentName: 'Pooja Bishnoi', className: '10', section: 'B', gender: 'Female', phone: '9876543223' },
  { id: 'std-10b-5', admissionNo: 'SPC-2024-115', rollNo: '5', studentName: 'Deepak Saini', className: '10', section: 'B', gender: 'Male', phone: '9876543224' },

  // Class 9 - Section A
  { id: 'std-9a-1', admissionNo: 'SPC-2024-201', rollNo: '1', studentName: 'Ayush Pandey', className: '9', section: 'A', gender: 'Male', phone: '9876543230' },
  { id: 'std-9a-2', admissionNo: 'SPC-2024-202', rollNo: '2', studentName: 'Simran Kaur', className: '9', section: 'A', gender: 'Female', phone: '9876543231' },
  { id: 'std-9a-3', admissionNo: 'SPC-2024-203', rollNo: '3', studentName: 'Mohit Rawat', className: '9', section: 'A', gender: 'Male', phone: '9876543232' },
  { id: 'std-9a-4', admissionNo: 'SPC-2024-204', rollNo: '4', studentName: 'Bhavna Mishra', className: '9', section: 'A', gender: 'Female', phone: '9876543233' },
  { id: 'std-9a-5', admissionNo: 'SPC-2024-205', rollNo: '5', studentName: 'Harsh Vardhan', className: '9', section: 'A', gender: 'Male', phone: '9876543234' },

  // Class 8 - Section A
  { id: 'std-8a-1', admissionNo: 'SPC-2024-301', rollNo: '1', studentName: 'Karan Saxena', className: '8', section: 'A', gender: 'Male', phone: '9876543240' },
  { id: 'std-8a-2', admissionNo: 'SPC-2024-302', rollNo: '2', studentName: 'Khushi Chawla', className: '8', section: 'A', gender: 'Female', phone: '9876543241' },
  { id: 'std-8a-3', admissionNo: 'SPC-2024-303', rollNo: '3', studentName: 'Nitin Baghel', className: '8', section: 'A', gender: 'Male', phone: '9876543242' },
  { id: 'std-8a-4', admissionNo: 'SPC-2024-304', rollNo: '4', studentName: 'Muskan Khatun', className: '8', section: 'A', gender: 'Female', phone: '9876543243' },

  // Class 7 - Section A
  { id: 'std-7a-1', admissionNo: 'SPC-2024-401', rollNo: '1', studentName: 'Yash Rathore', className: '7', section: 'A', gender: 'Male', phone: '9876543250' },
  { id: 'std-7a-2', admissionNo: 'SPC-2024-402', rollNo: '2', studentName: 'Tanya Dixit', className: '7', section: 'A', gender: 'Female', phone: '9876543251' },
  { id: 'std-7a-3', admissionNo: 'SPC-2024-403', rollNo: '3', studentName: 'Sumit Solanki', className: '7', section: 'A', gender: 'Male', phone: '9876543252' },

  // Class 6 - Section A
  { id: 'std-6a-1', admissionNo: 'SPC-2024-501', rollNo: '1', studentName: 'Aman Goyal', className: '6', section: 'A', gender: 'Male', phone: '9876543260' },
  { id: 'std-6a-2', admissionNo: 'SPC-2024-502', rollNo: '2', studentName: 'Chhavi Choudhary', className: '6', section: 'A', gender: 'Female', phone: '9876543261' },
  { id: 'std-6a-3', admissionNo: 'SPC-2024-503', rollNo: '3', studentName: 'Tarun Lodhi', className: '6', section: 'A', gender: 'Male', phone: '9876543262' },

  // Class 11 - Section A
  { id: 'std-11a-1', admissionNo: 'SPC-2024-601', rollNo: '1', studentName: 'Varun Grover', className: '11', section: 'A', gender: 'Male', phone: '9876543270' },
  { id: 'std-11a-2', admissionNo: 'SPC-2024-602', rollNo: '2', studentName: 'Isha Aggarwal', className: '11', section: 'A', gender: 'Female', phone: '9876543271' },

  // Class 12 - Section A
  { id: 'std-12a-1', admissionNo: 'SPC-2024-701', rollNo: '1', studentName: 'Mayank Sen', className: '12', section: 'A', gender: 'Male', phone: '9876543280' },
  { id: 'std-12a-2', admissionNo: 'SPC-2024-702', rollNo: '2', studentName: 'Ritika Chauhan', className: '12', section: 'A', gender: 'Female', phone: '9876543281' },
];

export function getStoredStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STORAGE_STUDENTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse students from localStorage', e);
  }
  // Initialize with seed data if none
  try {
    localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(INITIAL_STUDENTS));
  } catch (e) {
    console.error('Failed to save initial students', e);
  }
  return INITIAL_STUDENTS;
}

export function saveStoredStudents(students: Student[]): void {
  try {
    localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(students));
  } catch (e) {
    console.error('Failed to save students', e);
  }
}
