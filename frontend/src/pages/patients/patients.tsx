import { useState } from 'react';
import { Plus, Search, Filter, ArrowUpDown, Users, Mail, Phone, Eye, Droplet } from 'lucide-react';
import ModuleHeader from '../../components/ModuleHeader';
import { usePatients } from '../../hooks/usePatients';
import { calculateAge } from '../../utils/formatters';
import RegisterPatientModal from '../../components/modals/patientModals/RegisterPatientModal';

export default function Patients() {
  const { data: patients = [], isLoading, isError } = usePatients();
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter logic: Base sa nested user data
  const filteredPatients = patients.filter(p => 
    `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // PAGINATION LOGIC
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirst, indexOfLast);

  const handleViewProfile = (id: string) => {
    setSelectedPatientId(id);
    setIsRegisterModalOpen(true);
  };

  return (
    <div className="w-full bg-slate-50 text-slate-800 px-6 py-4 space-y-6">
      
      <ModuleHeader
        title="Patients Directory"
        description="Centralized health records registry and real-time patient status management."
        icon={<Users size={24} />}
        actions={
          <button 
            className="group flex items-center gap-2 px-5 py-2.5 bg-[#0284c7] hover:bg-[#026ca1] active:scale-95 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-rose-500/10"
            onClick={() => handleViewProfile(null)}
          >
            <Plus size={16} className="transition-transform group-hover:rotate-90" />
            Register New Patient
          </button>
        }
      />

      <div className="flex flex-col md:flex-row items-center gap-4 justify-between w-full bg-transparent">
        <div className="group/search flex items-center bg-white border border-slate-200/80 focus-within:border-[var(--active-parent,rgb(99,102,241))] focus-within:ring-4 focus-within:ring-[var(--active-parent,rgb(99,102,241))]/5 rounded-xl px-4 py-2.5 w-full md:max-w-md transition-all shadow-sm">
          <Search size={18} className="text-slate-400 group-focus-within/search:text-[var(--active-parent,rgb(99,102,241))] mr-3 transition-colors" />
          <input 
            type="text" 
            placeholder="Search patients by name..."
            value={searchTerm}
            onChange={(e) => { 
              setSearchTerm(e.target.value); 
              setCurrentPage(1); 
            }}
            className="bg-transparent w-full border-none outline-none text-sm placeholder-slate-400 text-slate-700"
          />
        </div>
        
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-600 rounded-xl text-sm font-semibold shadow-sm transition-all">
            <Filter size={14} /> Advanced Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-600 rounded-xl text-sm font-semibold shadow-sm transition-all">
            <ArrowUpDown size={14} /> Sort By
          </button>
        </div>
      </div>

      <div className="w-full bg-white border border-slate-200/60 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-y-auto overflow-x-auto h-[calc(100vh-325px)] border border-slate-200/60 rounded-lg">
            <table className="w-full text-left text-sm border-separate border-spacing-0">
                <thead className="sticky top-0 z-10 bg-[var(--active-parent)]">
                  <tr className="text-white uppercase tracking-wider text-[10px] font-extrabold border-b border-slate-200/60">
                    <th className="px-6 py-4">Patient Details</th>
                    <th className="px-6 py-4">Age / Gender</th>
                    <th className="px-6 py-4">Contact Gateway</th>
                    <th className="px-6 py-4 text-center">Blood Type</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">Loading records...</td>
                    </tr>
                ) : isError ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-red-500">Error loading data</td>
                    </tr>
                ) : currentPatients.length > 0 ? (
                    currentPatients.map((patient) => (
                    <tr key={patient.id} className="group hover:bg-[var(--active-parent,rgb(99,102,241))]/5 transition-all duration-200">
                        <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs border border-slate-200 group-hover:bg-[var(--active-parent,rgb(99,102,241))]/10 group-hover:text-[var(--active-parent,rgb(99,102,241))] transition-colors">
                            {patient.first_name[0]}{patient.last_name[0]}
                            </div>
                            <div>
                            <p className="font-semibold text-slate-800 group-hover:text-[var(--active-parent,rgb(99,102,241))] transition-colors">{patient.first_name} {patient.last_name}</p>
                            <p className="text-[10px] font-mono text-slate-400 group-hover:text-[var(--active-parent,rgb(99,102,241))]/60 transition-colors">{patient.id.slice(0, 8)}...</p>
                            </div>
                        </div>
                        </td>
                        {/* Age / Gender Column */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-normal text-slate-800 text-sm">
                              <b className='font-mono'>{calculateAge(patient.birth_date)}</b> <span className="text-slate-400 font-normal">years old</span>
                            </span>
                            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                              {patient.gender}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5">
                            {/* Email */}
                            <div className="flex items-center gap-2 text-slate-600">
                              <Mail size={12} className="text-slate-400 shrink-0" />
                              <span className="text-xs truncate max-w-[150px]">{patient.email}</span>
                            </div>
                            
                            {/* Phone Number */}
                            <div className="flex items-center gap-2 text-slate-600">
                              <Phone size={12} className="text-slate-400 shrink-0" />
                              <span className="text-xs font-mono">
                                {patient.phone_number || <span className="text-slate-300 italic">No number</span>}
                              </span>
                            </div>
                          </div>
                        </td>
                        {/* Blood Type Column */}
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center">
                            {/* Nagdagdag tayo ng 'w-20' para sa fixed width at 'justify-center' para laging nasa gitna ang content */}
                            <span className="flex items-center justify-center w-16 px-3 py-1.5 rounded-full bg-rose-600 text-white font-black text-xs shadow-md shadow-rose-200">
                              <Droplet size={14} className="text-rose-200 fill-rose-200" />
                              {patient.blood_type}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center">
                            <span className={`inline-flex items-center justify-center gap-1.5 w-22 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all duration-300 ${
                              patient.is_active 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm' 
                                : 'bg-slate-50 border-slate-200 text-slate-500'
                            }`}>
                              {/* Pulsing Indicator Dot */}
                              <span className="relative flex h-2 w-2">
                                {patient.is_active && (
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                )}
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${patient.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                              </span>
                              
                              {patient.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => handleViewProfile(patient.id)} // Ipasa mo yung ID ng patient
                            className="inline-flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium 
                            text-slate-600 bg-slate-100 hover:bg-cyan-500 hover:text-white 
                            transition-all duration-200 active:scale-95 hover:cursor-pointer"
                          >
                            <Eye size={14} />
                          </button>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">No patients found.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-100/50">
          <p className="text-xs text-slate-500 font-medium">
            Showing <span className="text-slate-800 font-bold">{filteredPatients.length > 0 ? indexOfFirst + 1 : 0}</span> to <span className="text-slate-800 font-bold">{Math.min(indexOfLast, filteredPatients.length)}</span> of <span className="text-slate-800 font-bold">{filteredPatients.length}</span> entries
          </p>

          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-30">Prev</button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${currentPage === page ? 'bg-[var(--active-parent,rgb(99,102,241))] text-white' : 'text-slate-600 hover:bg-slate-200'}`}>
                {page}
              </button>
            ))}

            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-30">Next</button>
          </div>
        </div>
      </div>

      {/* Register Patient Modal */}
      {isRegisterModalOpen && (
        <RegisterPatientModal 
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)} 
          patientId={selectedPatientId}
        />
      )}
    </div>
  );
}