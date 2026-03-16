"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
    Users, ClipboardList, TrendingUp, ArrowUpRight, 
    UserPlus, CheckCircle2, Clock, Calendar, 
    Briefcase, Award, ShieldCheck
} from "lucide-react";
import axios from "axios";
import Link from "next/link";

const API_BASE = "http://localhost:5000/api";

export default function AssociateDashboard() {
    const [stats, setStats] = useState({
        totalEnquiries: 0,
        totalAdmissions: 0,
        pendingFees: 0,
        totalPoints: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        return { Authorization: `Bearer ${token}` };
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setIsLoading(true);
        try {
            // Fetch Enquiries
            const enqRes = await axios.get(`${API_BASE}/enquiries`, { headers: getAuthHeaders() });
            // Fetch Admissions
            const admRes = await axios.get(`${API_BASE}/admissions`, { headers: getAuthHeaders() });
            // Fetch Referral Points
            const pointsRes = await axios.get(`${API_BASE}/admissions/referral-points/my`, { headers: getAuthHeaders() });

            const totalPoints = pointsRes.data.reduce((acc: number, curr: any) => acc + parseFloat(curr.points_earned), 0);
            const pendingFeesCount = admRes.data.filter((a: any) => parseFloat(a.balance_amount) > 0).length;

            setStats({
                totalEnquiries: enqRes.data.length,
                totalAdmissions: admRes.data.length,
                pendingFees: pendingFeesCount,
                totalPoints: totalPoints
            });
        } catch (err) {
            console.error("Failed to fetch dashboard stats", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Welcome Header */}
            <div className="relative p-10 bg-[#0b1f3a] rounded-[3rem] text-white overflow-hidden shadow-2xl">
                <div className="relative z-10">
                    <h2 className="text-4xl font-black tracking-tight mb-2">Associate Dashboard</h2>
                    <p className="text-blue-300 font-bold uppercase text-[10px] tracking-[0.2em]">Manage your enquiries, admissions, and referral earnings</p>
                    
                    <div className="mt-8 flex flex-wrap gap-4">
                        <Link href="/dashboard/associate-management/enquiry" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2">
                           <UserPlus size={16} /> New Enquiry
                        </Link>
                        <Link href="/dashboard/associate-management/admission" className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2">
                           <ClipboardList size={16} /> New Admission
                        </Link>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardStat 
                    label="My Enquiries" 
                    value={stats.totalEnquiries.toString()} 
                    icon={Users} 
                    color="text-blue-600" 
                    bg="bg-blue-50" 
                />
                <DashboardStat 
                    label="Admissions" 
                    value={stats.totalAdmissions.toString()} 
                    icon={CheckCircle2} 
                    color="text-green-600" 
                    bg="bg-green-50" 
                />
                <DashboardStat 
                    label="Pending Payments" 
                    value={stats.pendingFees.toString()} 
                    icon={Clock} 
                    color="text-amber-600" 
                    bg="bg-amber-50" 
                />
                <DashboardStat 
                    label="Referral Earned" 
                    value={`₹ ${stats.totalPoints.toLocaleString()}`} 
                    icon={TrendingUp} 
                    color="text-purple-600" 
                    bg="bg-purple-50" 
                />
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                    <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                        <Award className="text-blue-600" /> Career Counsellor Program
                    </h3>
                    <p className="text-slate-500 font-medium mb-6 leading-relaxed">
                        As an authorized associate, you earn **10% commission** on every student who completes their course fee payment. Enquiries you add today can become successful admissions tomorrow.
                    </p>
                    <div className="space-y-3">
                        <BenefitItem text="Automated Referral Tracking" />
                        <BenefitItem text="Real-time Admission Status" />
                        <BenefitItem text="Dedicated Support Access" />
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
                             <TrendingUp className="text-green-600" /> Performance Overview
                        </h3>
                        <p className="text-slate-500 font-medium text-sm">
                            Your conversion rate and payment clearance status determine your payout cycle. Ensure students complete their documentation for faster processing.
                        </p>
                    </div>
                    <div className="mt-8 pt-8 border-t border-slate-50">
                        <Link href="/dashboard/associate-management/referral-tracking" className="w-full py-4 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-center gap-3 font-bold text-slate-600 transition-all group">
                            View Referral Points <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

const DashboardStat = ({ label, value, icon: Icon, color, bg }: any) => (
    <div className="bg-white p-6 rounded-[2rem] shadow-lg border border-slate-100 hover:shadow-xl transition-all group">
        <div className={`w-12 h-12 ${bg} ${color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
            <Icon size={24} />
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <h4 className="text-3xl font-black text-slate-800">{value}</h4>
    </div>
);

const BenefitItem = ({ text }: { text: string }) => (
    <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
        {text}
    </div>
);
