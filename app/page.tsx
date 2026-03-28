"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import dynamic from 'next/dynamic';
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { Users, Briefcase, Shield, Mail, Lock } from "lucide-react";

type LoginForm = {
  email: string;
  password: string;
  role: "admin" | "manager" | "employee";
};

function LoginPage() {
  const router = useRouter();
  const {
    login,
    loading: loginLoading,
    isAuthenticated,
    user,
    loading: authLoading,
  } = useAuth();

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
    role: "employee",
  });
  
  const [mounted, setMounted] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated() && user) {
      const dashboardPath = 
        user.role === "admin" ? "/Admin/dashboard" :
        user.role === "manager" ? "/Manager/dashboard" :
        "/Employee/dashboard";
      router.push(dashboardPath);
    }
  }, [isAuthenticated, user, router]);

  if (!mounted) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gradient-to-br from-teal-400 via-cyan-500 to-indigo-600">
        <div className="relative z-10 glass-card rounded-2xl w-full max-w-md p-6 md:p-8 text-center backdrop-blur-xl bg-white/30 border border-white/40 shadow-2xl">
          <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-t-teal-400 border-r-cyan-400 border-b-indigo-400 border-l-transparent mx-auto"></div>
          <p className="mt-6 text-white font-medium">Loading...</p>
        </div>
      </section>
    );
  }

  if (authLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gradient-to-br from-teal-400 via-cyan-500 to-indigo-600">
        <div className="relative z-10 glass-card rounded-2xl w-full max-w-md p-6 md:p-8 text-center backdrop-blur-xl bg-white/30 border border-white/40 shadow-2xl">
          <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-t-teal-400 border-r-cyan-400 border-b-indigo-400 border-l-transparent mx-auto"></div>
          <p className="mt-6 text-white font-medium">Initializing...</p>
        </div>
      </section>
    );
  }

  if (isAuthenticated() && user) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gradient-to-br from-teal-400 via-cyan-500 to-indigo-600">
        <div className="relative z-10 glass-card rounded-2xl w-full max-w-md p-6 md:p-8 text-center backdrop-blur-xl bg-white/30 border border-white/40 shadow-2xl">
          <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-t-teal-400 border-r-cyan-400 border-b-indigo-400 border-l-transparent mx-auto"></div>
          <p className="mt-6 text-white font-medium">Redirecting to dashboard...</p>
        </div>
      </section>
    );
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please provide email and password");
      return;
    }

    try {
      await login(form.email, form.password, form.role);
    } catch (err: any) {
      console.error("Login error:", err);
    }
  };

  const getRoleIcon = () => {
    switch(form.role) {
      case 'admin': return <Shield className="w-5 h-5" />;
      case 'manager': return <Briefcase className="w-5 h-5" />;
      default: return <Users className="w-5 h-5" />;
    }
  };

  const getRoleDescription = () => {
    switch(form.role) {
      case 'admin': return "Full system access and management";
      case 'manager': return "Manage projects and team performance";
      default: return "Track your projects and performance";
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden bg-gradient-to-br from-teal-400 via-cyan-500 to-indigo-600">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-teal-300/40 rounded-full filter blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-300/40 rounded-full filter blur-3xl animate-float-slower"></div>
        <div className="absolute top-40 right-40 w-48 h-48 bg-indigo-300/40 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-40 left-20 w-56 h-56 bg-emerald-300/40 rounded-full filter blur-3xl animate-float"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-500 rounded-2xl blur-xl opacity-60 animate-pulse-slow"></div>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-500 rounded-2xl opacity-70 animate-gradient"></div>
          
          <div className="relative bg-white/30 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/50">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-teal-400 to-indigo-500 p-[2px]">
                <div className="w-full h-full rounded-full bg-white/90 flex items-center justify-center">
                  <Briefcase className="w-10 h-10 text-teal-600" />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent">
                  Employee Management
                </span>
              </h1>
              <p className="text-white/80 mt-2">Login to access your workspace</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50 transition-all duration-300"
                    placeholder="email@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50 transition-all duration-300"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Select Your Role
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                    {getRoleIcon()}
                  </div>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white appearance-none cursor-pointer focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/50 transition-all duration-300"
                  >
                    <option value="employee" className="bg-gray-800 text-white">👥 Employee</option>
                    <option value="manager" className="bg-gray-800 text-white">📊 Manager</option>
                    <option value="admin" className="bg-gray-800 text-white">⚙️ Admin</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <p className="mt-2 text-xs text-white/70">{getRoleDescription()}</p>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 bg-white/20 border border-white/30 rounded focus:ring-teal-400"
                  />
                  <span className="ml-2 text-sm text-white/80">Remember me</span>
                </label>
                <button type="button" className="text-sm text-teal-300 hover:text-teal-200">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-teal-400 to-indigo-500 text-white rounded-lg font-bold hover:from-teal-500 hover:to-indigo-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-white/80 mt-6">
              Don't have an account?{" "}
              <button
                onClick={() => router.push("/Signup")}
                className="text-teal-300 font-bold hover:text-teal-200 transition-colors"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default dynamic(() => Promise.resolve(LoginPage), { ssr: false });