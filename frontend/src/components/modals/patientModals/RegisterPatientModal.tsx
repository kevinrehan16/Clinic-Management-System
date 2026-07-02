import React, { useState } from 'react';
import { X, User, Mail, Calendar, Phone, MapPin, Lock, Pencil, Ban, Loader2, Save, PencilOff } from 'lucide-react';
import { usePatientDetails, useRegisterPatient, useUpdatePatient } from '../../../hooks/usePatients';
import { InputField } from '../../inputs/InputField';
import { SelectField } from '../../inputs/SelectField';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId?: string | null; // Optional prop for patient ID
}

export default function RegisterPatientModal({ isOpen, onClose, patientId }: ModalProps) {
  const { data: patient, isLoading } = usePatientDetails(patientId);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const { mutate: register, isPending: isRegistering } = useRegisterPatient();
  const { mutate: update, isPending: isUpdating } = useUpdatePatient();
  
  const isEditMode = !!patientId;
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    if (patientId) {
        update({ id: patientId, data }, {
            onSuccess: () => {
                onClose();
                setErrors({}); // I-reset ang errors pag success
            },
            onError: (error: any) => {
                // I-set ang error mula sa Django (DRF response)
                if (error.response && error.response.data) {
                    setErrors(error.response.data);
                }
            }
        });
    }
    else{
        register(data, {
            onSuccess: () => {
                onClose();
                setErrors({}); // I-reset ang errors pag success
            },
            onError: (error: any) => {
                // I-set ang error mula sa Django (DRF response)
                if (error.response && error.response.data) {
                    setErrors(error.response.data);
                }
            }
        });
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header - Sticky */}
        <div className="px-8 py-6 bg-[var(--active-parent)] flex items-center justify-between text-white flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold">
                {patientId ? 'Patient Profile' : 'Register New Account'}
            </h2>
            <p className="text-rose-100 text-sm opacity-90">
                {patientId ? 'View and update patient information' : 'Enter patient credentials and personal details'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-8 overflow-y-auto flex-grow scrollbar-thin">
          <form id="patient-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField 
                label="Username" 
                name="username" 
                error={errors.username} 
                defaultValue={patient?.username || ''}
                readOnly={!!patientId}
                icon={<User size={16}/>} 
                placeholder="john_doe" 
              />

              <InputField 
              label="Email Address" 
              name="email" 
              error={errors.email} 
              defaultValue={patient?.email || ''}
              readOnly={isEditMode && !isEditing}
              type="email" 
              icon={<Mail size={16}/>} 
              placeholder="johndoe@example.com" />
              
              <InputField 
              label="First Name" 
              name="first_name" 
              error={errors.first_name} 
              icon={<User size={16}/>} 
              defaultValue={patient?.first_name || ''}
              readOnly={isEditMode && !isEditing}
              placeholder="John" />

              <InputField 
                label="Last Name" 
                name="last_name" 
                error={errors.last_name} 
                icon={<User size={16}/>} 
                placeholder="Doe" 
                defaultValue={patient?.last_name || ''}
                readOnly={isEditMode && !isEditing}
              />
              {!isEditMode && (
                <>
                    <InputField label="Password" name="password" error={errors.password} type="password" icon={<Lock size={16}/>} />
                    <InputField label="Confirm Password" name="password_confirm" error={errors.password_confirm} type="password" icon={<Lock size={16}/>} />
                </>
              )}
              <InputField 
                label="Birth Date" 
                name="birth_date" 
                error={errors.birth_date} 
                defaultValue={patient?.birth_date || ''}
                readOnly={isEditMode && !isEditing}
                type="date" 
                icon={<Calendar size={16}/>} 
              />
              
              <InputField 
                label="Phone Number" 
                name="phone_number" 
                error={errors.phone_number} 
                defaultValue={patient?.phone_number || ''}
                readOnly={isEditMode && !isEditing}
                icon={<Phone size={16}/>} 
                placeholder="0915..."
              />
              
              <SelectField 
                label="Gender" 
                name="gender" 
                error={errors.gender}
                defaultValue={patient?.gender || ''}
                readOnly={isEditMode && !isEditing}
                options={[{ label: 'MALE', value: 'MALE' }, { label: 'FEMALE', value: 'FEMALE' }]} 
              />

              <SelectField 
                label="Blood Type" 
                name="blood_type" 
                error={errors.blood_type}
                defaultValue={patient?.blood_type || ''}
                readOnly={isEditMode && !isEditing}
                options={[
                  { label: 'A+', value: 'A+' }, { label: 'A-', value: 'A-' },
                  { label: 'B+', value: 'B+' }, { label: 'B-', value: 'B-' },
                  { label: 'AB+', value: 'AB+' }, { label: 'AB-', value: 'AB-' },
                  { label: 'O+', value: 'O+' }, { label: 'O-', value: 'O-' }
                ]} 
              />

              <div className="md:col-span-2">
                <InputField 
                    label="Address" 
                    name="address" 
                    error={errors.address} 
                    icon={<MapPin size={16}/>} 
                    placeholder="Imus, Cavite"
                    defaultValue={patient?.address || ''}
                    readOnly={isEditMode && !isEditing}
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer - Sticky */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end flex-shrink-0">
            {/* CANCEL BUTTON (Yung pang-close ng modal) */}
            <button 
                type="button" 
                onClick={onClose} 
                className="px-6 py-2.5 text-sm font-semibold text-slate-500 hover:text-rose-700 hover:bg-rose-100 rounded-xl transition-all flex items-center gap-2"
            >
                <Ban size={16} /> Close
            </button>

            {/* EDIT / CANCEL EDIT BUTTON */}
            {isEditMode && (
                <button 
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className={`px-6 py-2.5 text-sm font-semibold rounded-xl transition-all flex items-center gap-2 
                ${isEditing 
                    ? 'text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200' // Amber para sa Cancel Edit
                    : 'text-cyan-600 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200' // Indigo para sa Edit
                }`}
                >
                {isEditing ? (
                    <> <PencilOff size={16} /> Cancel Edit </>
                ) : (
                    <> <Pencil size={16} /> Edit Profile </>
                )}
                </button>
            )}

            {/* SUBMIT BUTTON */}
            <button 
                type="submit" 
                form="patient-form"
                disabled={isRegistering || isUpdating || (isEditMode && !isEditing)}
                className={`px-6 py-2.5 text-sm font-semibold text-white rounded-xl shadow-lg transition-all flex items-center gap-2
                ${(isEditMode && !isEditing) 
                    ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                    : 'bg-[#16a34a] hover:bg-[#119140] shadow-rose-500/20 active:scale-95'
                }`}
            >
                {(isRegistering || isUpdating) ? (
                <> <Loader2 size={16} className="animate-spin" /> Saving... </>
                ) : (
                <> <Save size={16} /> {isEditMode ? 'Save Changes' : 'Register Patient'} </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
}