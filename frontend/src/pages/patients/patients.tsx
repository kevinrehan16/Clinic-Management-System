import { useState, useEffect } from 'react';
import { Plus, Search, Filter, ArrowUpDown, Users } from 'lucide-react';
import ModuleHeader from '../../components/ModuleHeader';
import { MOCK_PATIENTS, type Patient } from '../../types/mockPatients';

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // FIX: Siguradong 5 ang items per page
  const itemsPerPage = 4;

  useEffect(() => {
    const timer = setTimeout(() => {
      setPatients(MOCK_PATIENTS);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // FIX: Inalis ang '|| p.id...' para Name lang ang basehan ng search
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // PAGINATION LOGIC:
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  
  // Reset sa page 1 kapag nag-search
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirst, indexOfLast);

  return (
    <div className="w-full bg-slate-50 text-slate-800 p-8 space-y-6">
      
      <ModuleHeader
        title="Patients Directory"
        description="Centralized health records registry and real-time patient status management."
        icon={<Users size={24} />}
        actions={
          <button className="group flex items-center gap-2 px-5 py-2.5 bg-[#e11d48] hover:bg-[#be123c] active:scale-95 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-rose-500/10">
            <Plus size={16} className="transition-transform group-hover:rotate-90" />
            Register New Patient
          </button>
        }
      />

      <div className="flex flex-col md:flex-row items-center gap-4 justify-between w-full bg-transparent">
        <div className="group/search flex items-center bg-white border border-slate-200/80 focus-within:border-[var(--active-parent,rgb(99,102,241))] focus-within:ring-4 focus-within:ring-[var(--active-parent,rgb(99,102,241))]/5 rounded-2xl px-4 py-2.5 w-full md:max-w-md transition-all shadow-sm">
          <Search size={18} className="text-slate-400 group-focus-within/search:text-[var(--active-parent,rgb(99,102,241))] mr-3 transition-colors" />
          <input 
            type="text" 
            placeholder="Search patients by name..."
            value={searchTerm}
            onChange={(e) => { 
              setSearchTerm(e.target.value); 
              setCurrentPage(1); // Importante: balik sa page 1 kapag nag-search
            }}
            className="bg-transparent w-full border-none outline-none text-sm placeholder-slate-400 text-slate-700"
          />
        </div>
        
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-600 rounded-2xl text-sm font-semibold shadow-sm transition-all">
            <Filter size={14} /> Advanced Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-600 rounded-2xl text-sm font-semibold shadow-sm transition-all">
            <ArrowUpDown size={14} /> Sort By
          </button>
        </div>
      </div>

      <div className="w-full bg-white border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200/60">
                <th className="px-6 py-4">Patient Details</th>
                <th className="px-6 py-4">Age / Gender</th>
                <th className="px-6 py-4">Contact Gateway</th>
                <th className="px-6 py-4">Last Visit</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-400">Loading records...</td></tr>
              ) : currentPatients.length > 0 ? (
                currentPatients.map((patient) => (
                  <tr key={patient.id} className="group hover:bg-[var(--active-parent,rgb(99,102,241))]/5 transition-all duration-200">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs border border-slate-200 group-hover:bg-[var(--active-parent,rgb(99,102,241))]/10 group-hover:text-[var(--active-parent,rgb(99,102,241))] transition-colors">
                          {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 group-hover:text-[var(--active-parent,rgb(99,102,241))] transition-colors">{patient.name}</p>
                          <p className="text-[10px] font-mono text-slate-400 group-hover:text-[var(--active-parent,rgb(99,102,241))]/60 transition-colors">{patient.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{patient.age} yrs / {patient.gender}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{patient.phone}</td>
                    <td className="px-6 py-4 text-slate-600 text-xs">{patient.lastVisit}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${patient.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 group-hover:text-[var(--active-parent,rgb(99,102,241))] font-semibold text-xs hover:underline transition-colors">View Profile</button>
                    </td>
                  </tr>
                ))
              ) : (
                 <tr><td colSpan={6} className="p-8 text-center text-slate-400">No patients found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <p className="text-xs text-slate-500 font-medium">
            Showing <span className="text-slate-800 font-bold">{filteredPatients.length > 0 ? indexOfFirst + 1 : 0}</span> to <span className="text-slate-800 font-bold">{Math.min(indexOfLast, filteredPatients.length)}</span> of <span className="text-slate-800 font-bold">{filteredPatients.length}</span> entries
          </p>

          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-30">Prev</button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Logic para sa pagination dots
              if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                return (
                  <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${currentPage === page ? 'bg-[var(--active-parent,rgb(99,102,241))] text-white' : 'text-slate-600 hover:bg-slate-200'}`}>
                    {page}
                  </button>
                );
              }
              if (page === currentPage - 2 || page === currentPage + 2) return <span key={page} className="px-2 text-slate-400">...</span>;
              return null;
            })}

            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-30">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}