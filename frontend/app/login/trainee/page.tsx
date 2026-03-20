"use client";

import React, { useState } from "react";
import { Briefcase, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

const TraineeLogin = () => {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!username || !password) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`, {
                email: username,
                password
            });

            // ✅ Save token + user + permissions
            localStorage.setItem("token",       res.data.token);
            localStorage.setItem("user",        JSON.stringify(res.data.user));
            localStorage.setItem("permissions", JSON.stringify(res.data.permissions));

            router.push("/dashboard");
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#071120] flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

            <div className="bg-white rounded-[40px] shadow-2xl p-12 w-full max-w-lg border border-slate-100 relative z-10">

                <div className="flex justify-center mb-10">
                    <div className="w-20 h-20 bg-[#0b1f3a] rounded-3xl flex items-center justify-center shadow-xl shadow-blue-900/20">
                         <Briefcase className="text-white w-10 h-10" />
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-[#0b1f3a] uppercase tracking-tight mb-2">
                        Trainee Portal
                    </h2>
                    <p className="text-slate-400 font-bold text-sm">Sign in to manage your classes and students</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Username */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                            Username / Email
                        </label>
                        <div className="relative group">
                            <Briefcase
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0b1f3a] transition-colors"
                                size={18}
                            />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl 
                                           focus:outline-none focus:bg-white focus:border-[#0b1f3a] transition-all font-bold text-slate-800 text-sm"
                                placeholder="name@nskill.com"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">
                            Secure Password
                        </label>
                        <div className="relative group">
                            <Lock
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0b1f3a] transition-colors"
                                size={18}
                            />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-transparent rounded-2xl 
                                           focus:outline-none focus:bg-white focus:border-[#0b1f3a] transition-all font-bold text-slate-800 text-sm"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0b1f3a] transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-[11px] font-black text-center bg-red-50 p-4 rounded-2xl border border-red-100 uppercase tracking-widest leading-relaxed">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#0b1f3a] text-white py-5 rounded-[22px] font-black uppercase tracking-[0.2em] text-sm
                                   hover:bg-blue-900 transition-all duration-300 shadow-2xl shadow-blue-900/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70 disabled:grayscale"
                    >
                        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                        {loading ? "Verifying..." : "Enter Trainee Dashboard"}
                    </button>

                </form>

                <div className="mt-12 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Technical Support: <span className="text-[#0b1f3a] cursor-pointer hover:underline">Support Desk</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TraineeLogin;
