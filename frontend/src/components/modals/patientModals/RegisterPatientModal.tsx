import React, { useState } from 'react';
import { 
  X, User, Mail, Calendar, Phone, MapPin, Lock, Pencil, Ban, Loader2, Save, PencilOff,
  Shield, ShieldAlert, ClipboardList, HeartHandshake, Briefcase, Globe, Fingerprint, FileText, Building, LockKeyhole, Edit2, Trash2, Plus, Search,
  Smartphone
} from 'lucide-react';
import { usePatientDetails, useRegisterPatient, useUpdatePatient, usePatientAllergies } from '../../../hooks/usePatients';
import { modalAnimation } from '../../../utils/ModalAnimation';
import { AllergyModal } from './AllergyModal';
import { InputField } from '../../inputs/InputField';
import { SelectField } from '../../inputs/SelectField';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId?: string | null;
}

type TabType = 'personal' | 'contact' | 'insurance' | 'medhistory' | 'allergies';

const getSeverityBadge = (severity: string) => {
  switch (severity?.toUpperCase()) {
    case 'HIGH':
    case 'SEVERE':
      return 'bg-red-50 text-red-600 border-red-100';
    case 'MEDIUM':
    case 'MODERATE':
      return 'bg-amber-50 text-amber-600 border-amber-100';
    case 'LOW':
    default:
      return 'bg-blue-50 text-blue-600 border-blue-100';
  }
};

export default function RegisterPatientModal({ isOpen, onClose, patientId }: ModalProps) {
  const { isClosing, startClose, handleAnimationEnd } = modalAnimation(onClose);
  const { data: patient, isLoading } = usePatientDetails(patientId);
  const { data: allergies, isLoading: loadingAllergies } = usePatientAllergies(patientId);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const { mutate: register, isPending: isRegistering } = useRegisterPatient();
  const { mutate: update, isPending: isUpdating } = useUpdatePatient();
  
  const isEditMode = !!patientId;
  const [isEditing, setIsEditing] = useState(false);

  const [isModalAllergyOpen, setIsModalAllergyOpen] = useState(false);
  const [allergyId, setAllergyId] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    if (patientId) {
        update({ id: patientId, data }, {
            onSuccess: () => {
                onClose();
                setErrors({});
            },
            onError: (error: any) => {
                if (error.response && error.response.data) {
                    setErrors(error.response.data);
                }
            }
        });
    } else {
        register(data, {
            onSuccess: () => {
                onClose();
                setErrors({});
            },
            onError: (error: any) => {
                if (error.response && error.response.data) {
                    setErrors(error.response.data);
                }
            }
        });
    }
  };

  const editAllergy = (allergyId) => {
    setIsModalAllergyOpen(true);
    setAllergyId(allergyId);
  }
  
  if (!isOpen) return null;

  const readOnlyCondition = isEditMode && !isEditing;

  return (
    <>
      {/* BACKDROP CONTAINER */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 ${isClosing ? 'modal-overlay closing' : 'modal-overlay'}`}
      onAnimationEnd={handleAnimationEnd}>
        
        {/* MODAL WRAPPER BODY */}
        <div className={`bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-200/80 flex flex-col max-h-[92vh] ${isClosing ? 'modal-content closing' : 'modal-content'}`}>
          
          {/* ==========================================
              HEADER - STICKY
             ========================================== */}
          <div className="px-8 py-6 bg-[var(--active-parent)] flex items-center justify-between text-white flex-shrink-0">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight">
                  {patientId ? 'Patient Core Profile' : 'Enterprise Patient Registration'}
              </h2>
              <p className="text-white/80 text-xs mt-0.5 font-medium">
                  {patientId ? 'Comprehensive view and record governance' : 'Create standardized clinical record for health tracking'}
              </p>
            </div>
            <button onClick={startClose} className="p-2 hover:bg-white/10 active:scale-95 rounded-full transition-all">
              <X size={20} />
            </button>
          </div>

          {/* ==========================================
              PREMIUM TABS CONTROLLER BAR
             ========================================== */}
          <div className="flex bg-slate-50 border-b border-slate-200/60 px-6 gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('personal')}
              className={`px-4 py-3.5 text-xs font-bold tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'personal'
                  ? 'border-[var(--active-parent)] text-[var(--active-parent)] bg-white font-black'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <User size={14} /> Personal Information
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('contact')}
              className={`px-4 py-3.5 text-xs font-bold tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'contact'
                  ? 'border-[var(--active-parent)] text-[var(--active-parent)] bg-white font-black'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <MapPin size={14} /> Contacts & Demographics
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('insurance')}
              className={`px-4 py-3.5 text-xs font-bold tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'insurance'
                  ? 'border-[var(--active-parent)] text-[var(--active-parent)] bg-white font-black'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Shield size={14} /> Insurance & Emergency
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('medhistory')}
              className={`px-4 py-3.5 text-xs font-bold tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'medhistory'
                  ? 'border-[var(--active-parent)] text-[var(--active-parent)] bg-white font-black'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <ClipboardList size={14} /> MEDICAL HISTORY
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('allergies')}
              className={`px-4 py-3.5 text-xs font-bold tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'allergies'
                  ? 'border-[var(--active-parent)] text-[var(--active-parent)] bg-white font-black'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <ShieldAlert size={14} /> ALLERGIES
            </button>
          </div>

          {/* ==========================================
              SCROLLABLE CONTAINER BODY
             ========================================== */}
          <div className="p-8 overflow-y-auto flex-grow scrollbar-thin bg-slate-50/30">
            <form id="patient-form" onSubmit={handleSubmit} className="space-y-8">
              
              {/* ------------------------------------------
                  TAB 1: PERSONAL INFORMATION
                 ------------------------------------------ */}
              <div className={`space-y-6 animate-in fade-in duration-200 ${activeTab === 'personal' ? 'block' : 'hidden'}`}>
                <div className="flex items-center gap-4 w-full">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap">Account Credentials</h3>
                  <div className="h-px flex-grow bg-slate-200" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField 
                    label="Username" name="username" error={errors.username} 
                    defaultValue={patient?.username || ''} readOnly={!!patientId}
                    icon={<User size={15}/>} placeholder="ex. johndoe" 
                  />
                  <InputField 
                    label="Email Address" name="email" error={errors.email} type="email"
                    defaultValue={patient?.email || ''} readOnly={readOnlyCondition}
                    icon={<Mail size={15}/>} placeholder="johndoe@example.com" 
                  />
                  {!isEditMode && (
                    <>
                      <InputField label="Password" name="password" error={errors.password} type="password" icon={<Lock size={15}/>} placeholder="••••••••" />
                      <InputField label="Confirm Password" name="password_confirm" error={errors.password_confirm} type="password" icon={<LockKeyhole  size={15}/>} placeholder="••••••••" />
                    </>
                  )}
                </div>

                <div className="flex items-center gap-4 w-full pt-2">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap">Bio Identity Data</h3>
                  <div className="h-px flex-grow bg-slate-200" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <InputField 
                    label="First Name" name="first_name" error={errors.first_name} 
                    defaultValue={patient?.first_name || ''} readOnly={readOnlyCondition}
                    icon={<User size={15}/>} placeholder="First Name" 
                  />
                  <InputField 
                    label="Last Name" name="last_name" error={errors.last_name} 
                    defaultValue={patient?.last_name || ''} readOnly={readOnlyCondition}
                    icon={<User size={15}/>} placeholder="Last Name" 
                  />
                  <InputField 
                    label="Suffix (Optional)" name="suffix" error={errors.suffix} 
                    defaultValue={patient?.suffix || ''} readOnly={readOnlyCondition}
                    icon={<User size={15}/>} placeholder="e.g. Jr., III" 
                  />
                  <InputField 
                    label="Birth Date" name="birth_date" error={errors.birth_date} type="date"
                    defaultValue={patient?.birth_date || ''} readOnly={readOnlyCondition}
                    icon={<Calendar size={15}/>} 
                  />
                  <SelectField 
                    label="Gender" name="gender" error={errors.gender}
                    defaultValue={patient?.gender || ''} readOnly={readOnlyCondition}
                    options={[{ label: 'MALE', value: 'MALE' }, { label: 'FEMALE', value: 'FEMALE' }]} 
                  />
                  <SelectField 
                    label="Civil Status" name="civil_status" error={errors.civil_status}
                    defaultValue={patient?.civil_status || ''} readOnly={readOnlyCondition}
                    options={[
                      { label: 'Single', value: 'Single' }, { label: 'Married', value: 'Married' },
                      { label: 'Widowed', value: 'Widowed' }, { label: 'Separated', value: 'Separated' }
                    ]} 
                  />
                  <InputField 
                    label="Nationality" name="nationality" error={errors.nationality} 
                    defaultValue={patient?.nationality || 'Filipino'} readOnly={readOnlyCondition}
                    icon={<Globe size={15}/>} placeholder="Filipino" 
                  />
                  <InputField 
                    label="Occupation" name="occupation" error={errors.occupation} 
                    defaultValue={patient?.occupation || ''} readOnly={readOnlyCondition}
                    icon={<Briefcase size={15}/>} placeholder="e.g. Accountant" 
                  />
                  <SelectField 
                    label="Blood Type" name="blood_type" error={errors.blood_type}
                    defaultValue={patient?.blood_type || ''} readOnly={readOnlyCondition}
                    options={[
                      { label: 'A+', value: 'A+' }, { label: 'A-', value: 'A-' },
                      { label: 'B+', value: 'B+' }, { label: 'B-', value: 'B-' },
                      { label: 'AB+', value: 'AB+' }, { label: 'AB-', value: 'AB-' },
                      { label: 'O+', value: 'O+' }, { label: 'O-', value: 'O-' }
                    ]} 
                  />
                </div>
              </div>

              {/* ------------------------------------------
                  TAB 2: CONTACTS & LOCATION
                 ------------------------------------------ */}
              <div className={`space-y-6 animate-in fade-in duration-200 ${activeTab === 'contact' ? 'block' : 'hidden'}`}>
                <div className="flex items-center gap-4 w-full">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap">Telecommunication Gateway</h3>
                  <div className="h-px flex-grow bg-slate-200" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField 
                    label="Mobile Number" name="phone_number" error={errors.phone_number} 
                    defaultValue={patient?.phone_number || ''} readOnly={readOnlyCondition}
                    icon={<Smartphone size={15}/>} placeholder="09XXXXXXXXX"
                  />
                  <InputField 
                    label="Landline Number" name="land_line" error={errors.land_line} 
                    defaultValue={patient?.land_line || ''} readOnly={readOnlyCondition}
                    icon={<Phone size={15}/>} placeholder="e.g. 046XXXXXXX"
                  />
                </div>

                <div className="flex items-center gap-4 w-full pt-2">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap">Geographical Core Address</h3>
                  <div className="h-px flex-grow bg-slate-200" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <InputField 
                      label="Primary Address (Baseline)" name="address" error={errors.address} 
                      defaultValue={patient?.address || ''} readOnly={readOnlyCondition}
                      icon={<MapPin size={15}/>} placeholder="Street Name, Subd, Brgy, City, Province"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <InputField 
                      label="Address Info (House No./Bldg/Unit/Floor)" name="address_info" error={errors.address_info} 
                      defaultValue={patient?.address_info || ''} readOnly={readOnlyCondition}
                      icon={<Building size={15}/>} placeholder="Blk 1 Lot 2, Phase 3, Golden City"
                    />
                  </div>
                  <InputField 
                    label="Barangay" name="brgy" error={errors.brgy} 
                    defaultValue={patient?.brgy || ''} readOnly={readOnlyCondition}
                    icon={<MapPin size={15}/>} placeholder="e.g. Anabu II-F"
                  />
                  <InputField 
                    label="City / Municipality" name="city" error={errors.city} 
                    defaultValue={patient?.city || ''} readOnly={readOnlyCondition}
                    icon={<MapPin size={15}/>} placeholder="e.g. Imus"
                  />
                  <InputField 
                    label="Province" name="province" error={errors.province} 
                    defaultValue={patient?.province || ''} readOnly={readOnlyCondition}
                    icon={<MapPin size={15}/>} placeholder="e.g. Cavite"
                  />
                  <InputField 
                    label="Region" name="region" error={errors.region} 
                    defaultValue={patient?.region || ''} readOnly={readOnlyCondition}
                    icon={<MapPin size={15}/>} placeholder="e.g. IV-A (CALABARZON)"
                  />
                </div>
              </div>

              {/* ------------------------------------------
                  TAB 3: INSURANCE & EMERGENCY
                 ------------------------------------------ */}
              <div className={`space-y-6 animate-in fade-in duration-200 ${activeTab === 'insurance' ? 'block' : 'hidden'}`}>
                <div className="flex items-center gap-4 w-full">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap">Health Coverage & Gov IDs</h3>
                  <div className="h-px flex-grow bg-slate-200" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField 
                    label="PhilHealth Number" name="phil_health" error={errors.phil_health} 
                    defaultValue={patient?.phil_health || ''} readOnly={readOnlyCondition}
                    icon={<FileText size={15}/>} placeholder="XX-XXXXXXXXX-X"
                  />
                  <InputField 
                    label="Senior Citizen / PWD ID" name="senior_id" error={errors.senior_id} 
                    defaultValue={patient?.senior_id || ''} readOnly={readOnlyCondition}
                    icon={<Fingerprint size={15}/>} placeholder="ID Number"
                  />
                  <InputField 
                    label="HMO Provider / Carrier" name="hmo_provider" error={errors.hmo_provider} 
                    defaultValue={patient?.hmo_provider || ''} readOnly={readOnlyCondition}
                    icon={<Building size={15}/>} placeholder="e.g. Maxicare, Intellicare"
                  />
                  <InputField 
                    label="HMO Account/Policy Number" name="hmo_accnum" error={errors.hmo_accnum} 
                    defaultValue={patient?.hmo_accnum || ''} readOnly={readOnlyCondition}
                    icon={<FileText size={15}/>} placeholder="Policy / Reference ID"
                  />
                </div>

                <div className="flex items-center gap-4 w-full pt-2">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap">Primary Emergency Contact</h3>
                  <div className="h-px flex-grow bg-slate-200" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="md:col-span-1">
                    <InputField 
                      label="Contact Name" name="emergency_contact_name" error={errors.emergency_contact_name} 
                      defaultValue={patient?.emergency_contact_name || ''} readOnly={readOnlyCondition}
                      icon={<User size={15}/>} placeholder="Full Name"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <InputField 
                      label="Contact Mobile" name="emergency_contact_phone" error={errors.emergency_contact_phone} 
                      defaultValue={patient?.emergency_contact_phone || ''} readOnly={readOnlyCondition}
                      icon={<Phone size={15}/>} placeholder="0917XXXXXXX"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <InputField 
                      label="Relationship" name="emergency_relationship" error={errors.emergency_relationship} 
                      defaultValue={patient?.emergency_relationship || ''} readOnly={readOnlyCondition}
                      icon={<HeartHandshake size={15}/>} placeholder="e.g. Spouse, Mother"
                    />
                  </div>
                </div>
              </div>

              {/* ------------------------------------------
                  TAB 3: MEDICAL HISTORY
                 ------------------------------------------ */}
              <div className={`space-y-6 animate-in fade-in duration-200 ${activeTab === 'medhistory' ? 'block' : 'hidden'}`}>
                <div className="flex items-center gap-4 w-full">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap">Patient Medical Records</h3>
                  <div className="h-px flex-grow bg-slate-200" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField 
                    label="PhilHealth Number" name="phil_health" error={errors.phil_health} 
                    defaultValue={patient?.phil_health || ''} readOnly={readOnlyCondition}
                    icon={<FileText size={15}/>} placeholder="XX-XXXXXXXXX-X"
                  />
                  
                </div>

                <div className="flex items-center gap-4 w-full pt-2">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap">Primary Emergency Contact</h3>
                  <div className="h-px flex-grow bg-slate-200" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="md:col-span-1">
                    <InputField 
                      label="Contact Name" name="emergency_contact_name" error={errors.emergency_contact_name} 
                      defaultValue={patient?.emergency_contact_name || ''} readOnly={readOnlyCondition}
                      icon={<User size={15}/>} placeholder="Full Name"
                    />
                  </div>
                  
                </div>
              </div>

              {/* ------------------------------------------
                  TAB 3: ALLERGIES
                 ------------------------------------------ */}
              <div className={`space-y-6 animate-in fade-in duration-200 ${activeTab === 'allergies' ? 'block' : 'hidden'}`}>
                <div className="flex items-center gap-4 w-full">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap">Allergen Registry</h3>
                  <div className="h-px flex-grow bg-slate-200" />
                </div>
                <div className="grid grid-cols-12 md:grid-cols-12 gap-5">
                  <div className="flex col-span-12 flex-col gap-4">
                    {/* Header Section */}
                    <div className="flex items-center justify-between pb-2">
                      <div className="group/search flex items-center bg-white border border-slate-200/80 focus-within:border-[var(--active-parent,rgb(99,102,241))] focus-within:ring-4 focus-within:ring-[var(--active-parent,rgb(99,102,241))]/5 rounded-xl px-4 py-2.5 w-full md:max-w-md transition-all shadow-sm">
                        <Search size={18} className="text-slate-400 group-focus-within/search:text-[var(--active-parent,rgb(99,102,241))] mr-3 transition-colors" />
                        <input 
                          type="text" 
                          placeholder="Search patients by name..."
                          // value={searchTerm}
                          onChange={(e) => { 
                            // setSearchTerm(e.target.value); 
                            // setCurrentPage(1); 
                          }}
                          className="bg-transparent w-full border-none outline-none text-sm placeholder-slate-400 text-slate-700"
                        />
                      </div>
                      <button 
                        type="button"
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition-all text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-sm"
                        onClick={() => setIsModalAllergyOpen(true)}
                      >
                        <Plus size={14} /> ALLERGY
                      </button>
                    </div>
                    {/* Table Area */}
                    <div className="overflow-hidden border border-slate-200 rounded-xl shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Allergen</th>
                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Severity</th>
                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reaction Details</th>
                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Added Date</th>
                            <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allergies && allergies.length > 0 ? (
                            allergies.map((allergy) => (
                              <tr key={allergy.id} className="group hover:bg-slate-50/50 transition-all">
                                {/* ALLERGEN */}
                                <td className="p-4 text-sm font-semibold text-slate-900">
                                  {allergy.allergen}
                                </td>

                                {/* SEVERITY BADGE */}
                                <td className="p-4">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${getSeverityBadge(allergy.severity)}`}>
                                    {allergy.severity}
                                  </span>
                                </td>

                                {/* REACTION */}
                                <td className="p-4 text-sm text-slate-600">
                                  {allergy.reaction}
                                </td>

                                {/* DATE CREATED */}
                                <td className="p-4 text-sm text-slate-400 font-mono">
                                  {allergy.created_at ? new Date(allergy.created_at).toLocaleDateString('en-CA') : 'N/A'}
                                </td>

                                {/* ACTIONS */}
                                <td className="p-4 text-right">
                                  <button 
                                    type='button'
                                    className="text-slate-300 hover:text-indigo-600 p-1"
                                    onClick={()=>editAllergy(allergy.id)}
                                    // onClick={() => handleEditAllergy(allergy)} // Kung may edit handler ka
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button 
                                    type='button'
                                    className="text-slate-300 hover:text-red-500 p-1 ml-2"
                                    // onClick={() => handleDeleteAllergy(allergy.id)} // Kung may delete handler ka
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="p-8 text-center text-sm text-slate-400">
                                No reported allergies for this patient.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

            </form>
          </div>

          {/* ==========================================
              FOOTER - STICKY
             ========================================== */}
          <div className="px-8 py-4 bg-slate-50 border-t border-slate-200/60 flex gap-3 justify-end flex-shrink-0">
              <button 
                  type="button" 
                  onClick={startClose} 
                  className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all flex items-center gap-2"
              >
                  <Ban size={15} /> Close Gateway
              </button>

              {isEditMode && (
                  <button 
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 border ${
                    isEditing 
                      ? 'text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200 shadow-sm' 
                      : 'text-cyan-700 bg-cyan-50/50 hover:bg-cyan-100/80 border-cyan-200'
                  }`}
                  >
                  {isEditing ? (
                      <> <PencilOff size={15} /> Lock Changes </>
                  ) : (
                      <> <Pencil size={15} /> Unlock Profile </>
                  )}
                  </button>
              )}

              <button 
                  type="submit" 
                  form="patient-form"
                  disabled={isRegistering || isUpdating || (isEditMode && !isEditing)}
                  className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white rounded-xl shadow-lg transition-all flex items-center gap-2 ${
                  (isEditMode && !isEditing) 
                      ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10 active:scale-95'
                  }`}
              >
                  {(isRegistering || isUpdating) ? (
                  <> <Loader2 size={15} className="animate-spin" /> Saving Registry... </>
                  ) : (
                  <> <Save size={15} /> {isEditMode ? 'Commit Updates' : 'Authorize Account'} </>
                  )}
              </button>
          </div>

        </div>
      </div>
      
      <AllergyModal 
        isOpen={isModalAllergyOpen}
        onClose={() => setIsModalAllergyOpen(false)}
        patientId={patientId || ""}
        allergyId={allergyId}
      />

    </>
  );
}