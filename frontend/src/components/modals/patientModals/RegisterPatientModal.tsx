import React, { useState } from 'react';
import { X, User, Mail, Calendar, Phone, MapPin, Lock } from 'lucide-react';
import { useRegisterPatient } from '../../../hooks/usePatients';
import { InputField } from '../../inputs/InputField';
import { SelectField } from '../../inputs/SelectField';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId?: string | null; // Optional prop for patient ID
}

export default function RegisterPatientModal({ isOpen, onClose, patientId }: ModalProps) {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const { mutate: register, isPending } = useRegisterPatient();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
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
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header - Sticky */}
        <div className="px-8 py-6 bg-[#e11d48] flex items-center justify-between text-white flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold">Register New Account</h2>
            <p className="text-rose-100 text-sm opacity-90">Enter patient credentials and personal details</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-8 overflow-y-auto flex-grow scrollbar-thin">
          <form id="patient-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Username" name="username" error={errors.username} icon={<User size={16}/>} placeholder="ivy_quinones" />
              <InputField label="Email Address" name="email" error={errors.email} type="email" icon={<Mail size={16}/>} placeholder="ivy@example.com" />
              
              <InputField label="First Name" name="first_name" error={errors.first_name} icon={<User size={16}/>} placeholder="Ivy" />
              <InputField label="Last Name" name="last_name" error={errors.last_name} icon={<User size={16}/>} placeholder="Quiñones" />
              
              <InputField label="Password" name="password" error={errors.password} type="password" icon={<Lock size={16}/>} />
              <InputField label="Confirm Password" name="password_confirm" error={errors.password_confirm} type="password" icon={<Lock size={16}/>} />
              
              <InputField label="Birth Date" name="birth_date" error={errors.birth_date} type="date" icon={<Calendar size={16}/>} />
              <InputField label="Phone Number" name="phone_number" error={errors.phone_number} icon={<Phone size={16}/>} placeholder="0915..." />
              
              <SelectField 
                label="Gender" 
                name="gender" 
                error={errors.gender}
                options={[{ label: 'MALE', value: 'MALE' }, { label: 'FEMALE', value: 'FEMALE' }]} 
              />

              <SelectField 
                label="Blood Type" 
                name="blood_type" 
                error={errors.blood_type}
                options={[
                  { label: 'A+', value: 'A+' }, { label: 'A-', value: 'A-' },
                  { label: 'B+', value: 'B+' }, { label: 'B-', value: 'B-' },
                  { label: 'AB+', value: 'AB+' }, { label: 'AB-', value: 'AB-' },
                  { label: 'O+', value: 'O+' }, { label: 'O-', value: 'O-' }
                ]} 
              />

              <div className="md:col-span-2">
                <InputField label="Address" name="address" error={errors.address} icon={<MapPin size={16}/>} placeholder="Imus, Cavite" />
              </div>
            </div>
          </form>
        </div>

        {/* Footer - Sticky */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end flex-shrink-0">
          <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-all">
            Cancel
          </button>
          <button 
            type="submit" 
            form="patient-form" // Ito ang nagko-connect sa <form> sa taas
            disabled={isPending}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-[#e11d48] hover:bg-[#be123c] rounded-xl shadow-lg shadow-rose-500/20 active:scale-95 transition-all"
          >
            {isPending ? 'Registering...' : 'Register Patient'}
          </button>
        </div>
      </div>
    </div>
  );
}