import React, { useState, useMemo, useRef } from 'react';
import {
  UserPlus,
  Search,
  Filter,
  Download,
  Printer,
  Trash2,
  Edit2,
  GraduationCap,
  Phone,
  MapPin,
  Calendar,
  User,
  Users,
  IdCard,
  X,
  Check,
  School,
  Camera,
  Upload,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { Student } from '../types';
import { compressImageFile, STUDENT_AVATAR_PRESETS } from '../utils/imageHelper';

interface StudentsViewProps {
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onShowToast: (type: 'success' | 'error' | 'info', msg: string) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onShowToast,
}) => {
  // Tabs: 'directory' or 'admission'
  const [activeTab, setActiveTab] = useState<'directory' | 'admission'>('directory');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');

  // ID Card modal state
  const [selectedStudentForId, setSelectedStudentForId] = useState<Student | null>(null);

  // Edit Student modal state
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Admission Form Fields
  const [formName, setFormName] = useState('');
  const [formRollNo, setFormRollNo] = useState('');
  const [formAdmNo, setFormAdmNo] = useState('');
  const [formClass, setFormClass] = useState('10');
  const [formSection, setFormSection] = useState('A');
  const [formFather, setFormFather] = useState('');
  const [formMother, setFormMother] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formDob, setFormDob] = useState('2010-01-01');
  const [formGender, setFormGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [formAddress, setFormAddress] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file);
      setPhotoPreview(compressed);
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (event) => setPhotoPreview(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleIdCardPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedStudentForId) return;
    try {
      const compressed = await compressImageFile(file);
      const updated: Student = { ...selectedStudentForId, photoUrl: compressed };
      setSelectedStudentForId(updated);
      onUpdateStudent(updated);
      onShowToast('success', `छात्र "${updated.studentName}" की फोटो पहचान पत्र (ID Card) में अपडेट हो गई!`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetIdCardAvatar = (avatarUrl: string) => {
    if (!selectedStudentForId) return;
    const updated: Student = { ...selectedStudentForId, photoUrl: avatarUrl };
    setSelectedStudentForId(updated);
    onUpdateStudent(updated);
    onShowToast('success', 'पहचान पत्र के लिए फोटो अवतार चुन लिया गया!');
  };

  const handleAdmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formRollNo.trim() || !formClass) {
      alert('कृपया छात्र का नाम, रोल नंबर और कक्षा भरें।');
      return;
    }

    const adm = formAdmNo.trim() || `SPC-2024-${Math.floor(100 + Math.random() * 900)}`;

    onAddStudent({
      studentName: formName.trim(),
      rollNo: formRollNo.trim(),
      admissionNo: adm,
      className: formClass,
      section: formSection,
      fatherName: formFather.trim(),
      motherName: formMother.trim(),
      phone: formPhone.trim(),
      dob: formDob,
      gender: formGender,
      address: formAddress.trim(),
      photoUrl: photoPreview,
      createdAt: new Date().toISOString().split('T')[0],
    });

    onShowToast('success', `छात्र "${formName}" का प्रवेश सफलतापूर्वक दर्ज हो गया!`);

    // Reset Form
    setFormName('');
    setFormRollNo('');
    setFormAdmNo('');
    setFormFather('');
    setFormMother('');
    setFormPhone('');
    setFormAddress('');
    setPhotoPreview('');
    setActiveTab('directory');
  };

  // Filter students
  const filteredList = useMemo(() => {
    return students.filter((s) => {
      const matchClass = !filterClass || s.className === filterClass;
      const matchSection = !filterSection || s.section === filterSection;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        s.studentName.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.admissionNo.toLowerCase().includes(q) ||
        (s.fatherName && s.fatherName.toLowerCase().includes(q));

      return matchClass && matchSection && matchSearch;
    });
  }, [students, filterClass, filterSection, searchQuery]);

  // Export Directory to CSV
  const handleExportCsv = () => {
    const headers = ['Roll No', 'Admission No', 'Student Name', 'Class', 'Section', 'Father Name', 'Phone', 'Address'];
    const rows = filteredList.map((s) => [
      `"${s.rollNo}"`,
      `"${s.admissionNo}"`,
      `"${s.studentName}"`,
      `"${s.className}"`,
      `"${s.section}"`,
      `"${s.fatherName || ''}"`,
      `"${s.phone || ''}"`,
      `"${(s.address || '').replace(/"/g, '""')}"`,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Students_Directory_${filterClass ? `Class${filterClass}` : 'All'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('info', 'छात्र सूची CSV फ़ाइल डाउनलोड हो गई।');
  };

  return (
    <div className="space-y-6">
      {/* Top Header with Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 flex items-center gap-2">
            <span>👨‍🎓 Student Management (विद्यार्थी प्रबंधन)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            नया छात्र प्रवेश लें, छात्र डायरेक्टरी देखें, पहचान पत्र (ID Card) प्रिंट करें।
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-200/80 p-1 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'directory'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            विद्यार्थी सूची (Directory) ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('admission')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'admission'
                ? 'bg-[#12366b] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>नया प्रवेश (+ New Admission)</span>
          </button>
        </div>
      </div>

      {/* ADMISSION FORM TAB */}
      {activeTab === 'admission' && (
        <section className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-xs max-w-4xl mx-auto">
          <div className="pb-5 border-b border-slate-100 mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">छात्र प्रवेश फॉर्म (Student Admission Form)</h2>
                <p className="text-xs text-slate-400">सत्र 2026-2027 के लिए नए विद्यार्थी का विवरण भरें</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('directory')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              वापस सूची पर जाएँ
            </button>
          </div>

          <form id="studentForm" onSubmit={handleAdmissionSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Student Name (विद्यार्थी का नाम) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Roll Number (रोल नंबर) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 18"
                  value={formRollNo}
                  onChange={(e) => setFormRollNo(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Admission No. (प्रवेश संख्या)
                </label>
                <input
                  type="text"
                  placeholder="e.g. SPC-2024-118 (Optional)"
                  value={formAdmNo}
                  onChange={(e) => setFormAdmNo(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Class (कक्षा) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formClass}
                  onChange={(e) => setFormClass(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
                >
                  <option value="6">Class 6</option>
                  <option value="7">Class 7</option>
                  <option value="8">Class 8</option>
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                  <option value="11">Class 11</option>
                  <option value="12">Class 12</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Section (सेक्शन)
                </label>
                <select
                  value={formSection}
                  onChange={(e) => setFormSection(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                  <option value="D">Section D</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Father's Name (पिता का नाम)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shri Suresh Kumar"
                  value={formFather}
                  onChange={(e) => setFormFather(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mother's Name (माता का नाम)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Smt. Radha Devi"
                  value={formMother}
                  onChange={(e) => setFormMother(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mobile Number (मोबाइल)
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Date of Birth (जन्म तिथि)
                </label>
                <input
                  type="date"
                  value={formDob}
                  onChange={(e) => setFormDob(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Gender (लिंग)
                </label>
                <select
                  value={formGender}
                  onChange={(e) => setFormGender(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Male">Male (छात्र)</option>
                  <option value="Female">Female (छात्रा)</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Address (स्थायी पता)
              </label>
              <textarea
                rows={2}
                placeholder="गाँव/शहर, पोस्ट, जिला, राज्य, पिनकोड..."
                value={formAddress}
                onChange={(e) => setFormAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Photo Upload and Preview Section */}
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/50 border border-blue-200/80">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-24 h-28 rounded-2xl bg-white border-2 border-dashed border-blue-300 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                  {photoPreview ? (
                    <>
                      <img src={photoPreview} alt="Student Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPhotoPreview('')}
                        className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white shadow-xs hover:bg-rose-700"
                        title="Remove Photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-2 text-slate-400">
                      <Camera className="w-7 h-7 mx-auto mb-1 text-blue-400" />
                      <span className="text-[10px] block font-semibold text-slate-500">फोटो</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-800">
                      Student Passport Photo (छात्र की फोटो जोड़ें)
                    </label>
                    <p className="text-[11px] text-slate-500">
                      पहचान पत्र (ID Card) व मार्कशीट में उपयोग के लिए फोन गैलरी या कैमरे से फोटो अपलोड करें।
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{photoPreview ? 'फोटो बदलें (Change)' : 'फ़ोन/कैमरे से फोटो चुनें'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>

                    {photoPreview && (
                      <button
                        type="button"
                        onClick={() => setPhotoPreview('')}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold"
                      >
                        हटाएँ (Remove)
                      </button>
                    )}
                  </div>

                  {/* Avatar Presets for instant photo setup */}
                  <div className="pt-2 border-t border-blue-200/60 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" /> त्वरित अवतार:
                    </span>
                    {STUDENT_AVATAR_PRESETS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPhotoPreview(p.url)}
                        className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-white hover:bg-blue-100 border border-slate-200 text-[10px] font-medium text-slate-700 transition-colors"
                      >
                        <img src={p.url} alt={p.name} className="w-4 h-4 rounded-full" />
                        <span>{p.name.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setActiveTab('directory')}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                रद्द करें (Cancel)
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#12366b] hover:bg-blue-900 text-white font-bold text-xs sm:text-sm shadow-md active:scale-95 transition-all"
              >
                💾 प्रवेश सुरक्षित करें (Save Admission)
              </button>
            </div>
          </form>
        </section>
      )}

      {/* DIRECTORY TAB */}
      {activeTab === 'directory' && (
        <section className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              {/* Search */}
              <div className="relative min-w-[220px] flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search name, roll no, adm, father..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Class Filter */}
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">All Classes (सभी कक्षाएँ)</option>
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>

              {/* Section Filter */}
              <select
                value={filterSection}
                onChange={(e) => setFilterSection(e.target.value)}
                className="px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">All Sections</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
                <option value="D">Section D</option>
              </select>
            </div>

            {/* Actions: Export CSV & View Toggle */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={handleExportCsv}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs"
                title="Download CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Table / Cards List */}
          {filteredList.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 text-slate-500">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-sm">कोई छात्र रिकॉर्ड नहीं मिला।</p>
              <p className="text-xs text-slate-400 mt-1">फ़िल्टर बदलें या नया छात्र जोड़ें।</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px] text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-3 px-4 w-16 text-center">Roll</th>
                      <th className="py-3 px-4 w-32">Adm No</th>
                      <th className="py-3 px-4">Student Details</th>
                      <th className="py-3 px-4">Class / Section</th>
                      <th className="py-3 px-4">Father / Contact</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredList.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 text-center font-bold text-slate-700">
                          #{student.rollNo}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-slate-600">
                          {student.admissionNo}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden border border-slate-200">
                              {student.photoUrl ? (
                                <img src={student.photoUrl} alt={student.studentName} className="w-full h-full object-cover" />
                              ) : (
                                student.studentName.charAt(0)
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800">{student.studentName}</div>
                              <div className="text-[11px] text-slate-400">{student.gender || 'Student'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-800">Class {student.className}</span>
                          <span className="text-xs text-slate-400 ml-1">({student.section || 'A'})</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-xs text-slate-700 font-medium">
                            {student.fatherName || '—'}
                          </div>
                          {student.phone && (
                            <div className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Phone className="w-2.5 h-2.5" />
                              <span>{student.phone}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center space-x-1.5">
                            <button
                              onClick={() => setSelectedStudentForId(student)}
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                              title="Print Student ID Card"
                            >
                              <IdCard className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`क्या आप छात्र "${student.studentName}" को हटाना चाहते हैं?`)) {
                                  onDeleteStudent(student.id);
                                  onShowToast('info', 'छात्र हटा दिया गया।');
                                }
                              }}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                              title="Delete Student"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Student ID Card Modal Preview */}
      {selectedStudentForId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-[#12366b] text-white p-4 flex items-center justify-between no-print">
              <span className="text-xs font-bold uppercase tracking-wider">Student ID Card</span>
              <button
                onClick={() => setSelectedStudentForId(null)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable ID Card Body */}
            <div className="p-6 text-center bg-gradient-to-b from-blue-50/60 to-white">
              <div className="flex items-center justify-center space-x-2 text-[#12366b] mb-2">
                <School className="w-5 h-5" />
                <h3 className="font-extrabold text-sm uppercase tracking-wide">SP CHAUDHARY SCHOOL</h3>
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4">
                Student Identity Card
              </p>

              {/* ID Card Photo Frame with Upload Trigger */}
              <div className="relative group mx-auto w-24 h-28 rounded-2xl bg-blue-100 border-2 border-[#12366b] flex items-center justify-center mb-2 overflow-hidden shadow-sm">
                {selectedStudentForId.photoUrl ? (
                  <img src={selectedStudentForId.photoUrl} alt="Student" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-2 text-slate-400">
                    <User className="w-10 h-10 mx-auto text-blue-700 opacity-60" />
                    <span className="text-[9px] block font-semibold text-slate-500">फोटो नहीं है</span>
                  </div>
                )}
                <label className="no-print absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-bold">
                  <Camera className="w-5 h-5 mb-0.5 text-amber-300" />
                  <span>फोटो बदलें</span>
                  <input type="file" accept="image/*" onChange={handleIdCardPhotoUpload} className="hidden" />
                </label>
              </div>

              {/* Direct Touch-Friendly Photo Upload and Avatar Options on ID Card */}
              <div className="no-print mb-3 space-y-2">
                <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold border border-blue-200/80 shadow-xs active:scale-95 transition-all">
                  <Camera className="w-3.5 h-3.5" />
                  <span>{selectedStudentForId.photoUrl ? '📷 फोटो बदलें (Change Photo)' : '📷 फोटो जोड़ें (Add Photo)'}</span>
                  <input type="file" accept="image/*" onChange={handleIdCardPhotoUpload} className="hidden" />
                </label>

                <div className="flex items-center justify-center space-x-1.5">
                  <span className="text-[10px] text-slate-400 font-medium">अवतार:</span>
                  {STUDENT_AVATAR_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSetIdCardAvatar(p.url)}
                      className="w-6 h-6 rounded-full border border-slate-300 overflow-hidden hover:scale-115 transition-transform"
                      title={p.name}
                    >
                      <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <h4 className="font-extrabold text-base text-slate-800">{selectedStudentForId.studentName}</h4>
              <p className="text-xs font-bold text-blue-700 mt-0.5">
                Class {selectedStudentForId.className} - Section {selectedStudentForId.section}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-200 text-left space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Roll No:</span>
                  <span className="font-bold text-slate-800">#{selectedStudentForId.rollNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Adm No:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedStudentForId.admissionNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Father's Name:</span>
                  <span className="font-medium text-slate-800">{selectedStudentForId.fatherName || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Contact:</span>
                  <span className="font-medium text-slate-800">{selectedStudentForId.phone || '—'}</span>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-dashed border-slate-300 flex justify-between text-[10px] text-slate-400">
                <span>Principal Signature</span>
                <span>Session 2026-27</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-2 no-print">
              <button
                onClick={() => setSelectedStudentForId(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center space-x-1 px-4 py-1.5 rounded-xl bg-blue-700 text-white text-xs font-bold"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print ID Card</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
