"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
    Wallet, TrendingUp, Users, ArrowUpRight, 
    CreditCard, Calendar, User, BookOpen, Clock, 
    CheckCircle2, AlertCircle, RefreshCw, DollarSign, Award
} from "lucide-react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export default function ReferralTracking() {
    const [points, setPoints] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalEarned: 0,
        pendingSettlement: 0,
        completedEnrollments: 0
    });

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        return { Authorization: `Bearer ${token}` };
    };

    useEffect(() => {
        fetchPoints();
    }, []);

    const fetchPoints = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/admissions/referral-points/my`, {
                headers: getAuthHeaders()
            });
            const data = res.data;
            setPoints(data);

            const total = data.reduce((acc: number, curr: any) => acc + parseFloat(curr.points_earned), 0);
            const pending = data.filter((p: any) => !p.is_settled).reduce((acc: number, curr: any) => acc + parseFloat(curr.points_earned), 0);
            
            setStats({
                totalEarned: total,
                pendingSettlement: pending,
                completedEnrollments: data.length
            });
        } catch (err) {
            console.error("Failed to fetch referral points", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Referral Fee Points</h2>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Track your earnings and referral success</p>
                </div>
                <button 
                    onClick={fetchPoints}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                >
                    <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} /> Refresh Data
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    label="Total Commission Earned" 
                    value={`₹ ${stats.totalEarned.toLocaleString()}`} 
                    icon={Wallet} 
                    color="bg-blue-600" 
                    trend="+10% of Total Fees"
                />
                <StatCard 
                    label="Pending Settlement" 
                    value={`₹ ${stats.pendingSettlement.toLocaleString()}`} 
                    icon={Clock} 
                    color="bg-amber-500" 
                    sub="Updated on Balance: ₹0"
                />
                <StatCard 
                    label="Successful Referrals" 
                    value={stats.completedEnrollments.toString()} 
                    icon={Users} 
                    color="bg-green-600" 
                    sub="Fully Paid Students"
                />
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                        <TrendingUp className="text-blue-600" /> Points History
                    </h3>
                    <div className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                        10% referral system active
                    </div>
                </div>

                <div className="p-0">
                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="font-bold text-slate-400 animate-pulse">Analyzing your referral data...</p>
                        </div>
                    ) : points.length === 0 ? (
                        <div className="py-24 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertCircle size={40} className="text-slate-300" />
                            </div>
                            <h4 className="text-lg font-black text-slate-400">No Referral Fees Yet</h4>
                            <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">Referral fee points are automatically added once the student clears their total balance to ₹0.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="py-5 px-8 font-black uppercase text-[10px] tracking-[0.2em] text-slate-400">Student Details</th>
                                        <th className="py-5 px-8 font-black uppercase text-[10px] tracking-[0.2em] text-slate-400">Date Earned</th>
                                        <th className="py-5 px-8 font-black uppercase text-[10px] tracking-[0.2em] text-slate-400">Course Fee</th>
                                        <th className="py-5 px-8 font-black uppercase text-[10px] tracking-[0.2em] text-slate-400">My Points (10%)</th>
                                        <th className="py-5 px-8 font-black uppercase text-[10px] tracking-[0.2em] text-slate-400 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {points.map((item) => (
                                        <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-all group">
                                            <td className="py-6 px-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold group-hover:scale-110 transition-transform">
                                                        <User size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-800">{item.student_name}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Adm ID: {item.admission_id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 px-8">
                                                <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                                                    <Calendar size={14} className="text-slate-300" />
                                                    {new Date(item.created_at).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="py-6 px-8">
                                                <p className="font-bold text-slate-600">₹ {parseFloat(item.course_fee).toLocaleString()}</p>
                                            </td>
                                            <td className="py-6 px-8">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                                                    <p className="font-black text-blue-600 text-lg">₹ {parseFloat(item.points_earned).toLocaleString()}</p>
                                                </div>
                                            </td>
                                            <td className="py-6 px-8 text-right">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                    item.is_settled 
                                                    ? 'bg-green-100 text-green-600 border border-green-200' 
                                                    : 'bg-amber-100 text-amber-600 border border-amber-200'
                                                }`}>
                                                    {item.is_settled ? 'Settled' : 'Credited'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-[#0b1f3a] rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10">
                        <h4 className="text-xl font-black mb-4 flex items-center gap-2">
                             <Award className="text-blue-400" /> Referral Policy
                        </h4>
                        <ul className="space-y-4">
                            <PolicyItem text="Earn 10% commission on the total course fee for every successful referral." />
                            <PolicyItem text="Points are automatically calculated and added when student balance hits ₹0." />
                            <PolicyItem text="Track your earnings in real-time through this dedicated dashboard." />
                        </ul>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>
                </div>

                <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center mb-6">
                        <CheckCircle2 size={32} />
                    </div>
                    <h4 className="text-xl font-black text-slate-800">Automated System</h4>
                    <p className="text-slate-500 font-medium mt-2 max-w-xs">Our dynamic system ensures you get your referral points credited instantly once payments are cleared.</p>
                </div>
            </div>
        </div>
    );
}

// Helper Components
const StatCard = ({ label, value, icon: Icon, color, trend, sub }: any) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100 flex items-start gap-4"
    >
        <div className={`p-4 rounded-2xl ${color} text-white shadow-lg`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <h4 className="text-2xl font-black text-slate-800">{value}</h4>
            {trend && <p className="text-[10px] font-bold text-blue-600 mt-1 flex items-center gap-1"><ArrowUpRight size={12} /> {trend}</p>}
            {sub && <p className="text-[10px] font-bold text-slate-400 mt-1">{sub}</p>}
        </div>
    </motion.div>
);

const PolicyItem = ({ text }: { text: string }) => (
    <li className="flex items-start gap-3 text-sm font-medium text-blue-100">
        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></div>
        {text}
    </li>
);
