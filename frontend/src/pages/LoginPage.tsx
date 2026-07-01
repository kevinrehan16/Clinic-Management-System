import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Stethoscope, Lock, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const loginSchema = z.object({
  username: z.string().min(3, "Username required"),
  password: z.string().min(6, "Password too short"),
});

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    login();
    navigate('/');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* LEFT PANEL: Deep Blue Background for high contrast */}
      <div className="hidden lg:flex w-1/2 bg-[#0284c7] p-12 flex-col justify-between text-white">
        <div className="flex items-center gap-2 text-2xl font-bold">
          <Stethoscope className="w-8 h-8 text-white" />
          <span>ClinicOS</span>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold leading-tight">Patient care, managed with precision.</h1>
          <p className="text-sky-100 text-lg font-medium max-w-md">
            The most reliable platform for modern clinics. Secure, scalable, and built for healthcare professionals.
          </p>
        </div>
        
        <div className="text-sm text-sky-200/80 font-medium">© 2026 ClinicOS Systems</div>
      </div>

      {/* RIGHT PANEL: Crisp White Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-slate-200"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
            <p className="text-slate-500 mt-2">Sign in to your professional portal.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input 
                  {...register('username')} 
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0284c7] outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="Enter your ID"
                />
              </div>
              {errors.username && <p className="text-red-600 text-xs font-medium">{errors.username.message as string}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  {...register('password')} 
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0284c7] outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-600 text-xs font-medium">{errors.password.message as string}</p>}
            </div>

            <button 
              disabled={isLoading}
              type="submit" 
              className="w-full bg-[#0284c7] hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
            >
              {isLoading ? "Authenticating..." : "Sign in to Portal"}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}