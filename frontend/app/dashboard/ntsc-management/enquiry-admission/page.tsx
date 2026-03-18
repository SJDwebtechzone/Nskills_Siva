"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, Filter, Eye, Trash2, Edit, 
    FileText, User, Calendar, BookOpen, 
    CheckCircle2, AlertCircle, RefreshCw, ShieldCheck,
    GraduationCap, ClipboardList, X, Briefcase, CreditCard
} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

const API_BASE = "http://localhost:5000/api";

export default function NTSCEnquiryAdmissionPage() {
    const router = useRouter();
    const { can } = useAuth();
    const [view, setView] = useState<"enquiry" | "admission">("enquiry");
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        return { Authorization: `Bearer ${token}` };
    };

    useEffect(() => {
        fetchData();
    }, [view]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const endpoint = view === "enquiry" ? "/enquiries" : "/admissions";
            const res = await axios.get(`${API_BASE}${endpoint}`, {
                headers: getAuthHeaders()
            });
            setData(res.data);
        } catch (err) {
            console.error(`Failed to fetch ${view}s`, err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (item: any) => {
        const type = view === "enquiry" ? "Enquiry" : "Admission";
        const identifier = view === "enquiry" ? item.enquiry_id : (item.admission_number || item.enquiry_id); // Use admission_number for admissions if available
        const name = view === "enquiry" ? item.student_name : item.full_name;

        if (!confirm(`Are you sure you want to delete ${type} for "${name}" (${identifier})?\nThis action is permanent.`)) return;

        try {
            const endpoint = view === "enquiry" ? `/enquiries/${item.id}` : `/admissions/${item.id}`;
            await axios.delete(`${API_BASE}${endpoint}`, {
                headers: getAuthHeaders()
            });
            setData(prev => prev.filter(i => i.id !== item.id));
        } catch (err: any) {
            alert(err.response?.data?.error || `Failed to delete ${type}.`);
        }
    };

    const filteredData = data.filter(item => {
        const q = search.toLowerCase();
        const name = (view === "enquiry" ? item.student_name : item.full_name) || "";
        const id = (view === "enquiry" ? item.enquiry_id : item.admission_number) || "";
        return name.toLowerCase().includes(q) || id.toLowerCase().includes(q);
    });

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Management Hub</h2>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Full control over Enquiries and Admissions</p>
                </div>
                
                <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl shadow-inner">
                    <button 
                        onClick={() => setView("enquiry")}
                        className={`px-6 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${view === "enquiry" ? 'bg-[#0b1f3a] text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        Enquiries
                    </button>
                    <button 
                        onClick={() => setView("admission")}
                        className={`px-6 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${view === "admission" ? 'bg-[#0b1f3a] text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        Admissions
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder={`Search by name or ${view === "enquiry" ? "Enquiry ID" : "Admission ID"}...`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-500 font-bold text-slate-700 shadow-sm"
                    />
                </div>
                <button 
                    onClick={fetchData}
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                >
                    <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} /> Refresh Records
                </button>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="py-24 flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="font-bold text-slate-400 animate-pulse uppercase text-[10px] tracking-widest">Accessing records...</p>
                        </div>
                    ) : filteredData.length === 0 ? (
                        <div className="py-32 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertCircle size={40} className="text-slate-300" />
                            </div>
                            <h4 className="text-xl font-black text-slate-800">No Records Found</h4>
                            <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto font-medium">No {view}s match your current search criteria.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="py-6 px-8 font-black uppercase text-[10px] tracking-[0.2em] text-slate-400">Student Details</th>
                                    <th className="py-6 px-8 font-black uppercase text-[10px] tracking-[0.2em] text-slate-400">ID / Date</th>
                                    <th className="py-6 px-8 font-black uppercase text-[10px] tracking-[0.2em] text-slate-400">Course / Interest</th>
                                    <th className="py-6 px-8 font-black uppercase text-[10px] tracking-[0.2em] text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item) => (
                                    <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-all group">
                                        <td className="py-6 px-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-[#0b1f3a] rounded-2xl flex items-center justify-center text-white font-black text-sm group-hover:scale-110 transition-transform">
                                                    {((view === "enquiry" ? item.student_name : item.full_name) || "?")[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-800 text-lg">{(view === "enquiry" ? item.student_name : item.full_name) || "Untitled Record"}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.mobile_number || "No contact"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td 
                                            className="py-6 px-8 cursor-pointer hover:bg-slate-50 transition-all rounded-r-3xl"
                                            onClick={() => setSelectedItem(item)}
                                            title="View Details"
                                        >
                                            <p className="font-mono font-black text-blue-600">#{(view === "enquiry" ? item.enquiry_id : (item.admission_number || item.enquiry_id)) || "N/A"}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                {new Date(item.created_at).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </p>
                                        </td>
                                        <td className="py-6 px-8">
                                            <p className="font-bold text-slate-700">{item.course_interested || item.course_name || "N/A"}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`w-1.5 h-1.5 rounded-full ${view === "enquiry" ? 'bg-amber-400' : 'bg-green-500'}`}></span>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{view === "enquiry" ? item.interest_level : 'Admitted'}</p>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8">
                                            <div className="flex items-center justify-end gap-3">
                                                <button 
                                                    onClick={() => setSelectedItem(item)}
                                                    className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                    title="Quick View"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                {can("NTSC Admin", "delete") && ( // Check for NTSC Admin or similar high-level delete permission
                                                    <button 
                                                        onClick={() => handleDelete(item)}
                                                        className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                        title="Delete Record"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Quick View Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl relative"
                        >
                            <button 
                                onClick={() => setSelectedItem(null)}
                                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
                            >
                                <X size={24} />
                            </button>

                            <div className="p-10 max-h-[85vh] overflow-y-auto custom-scrollbar">
                                <div className="flex items-center gap-6 mb-10 pb-6 border-b border-slate-100">
                                    <div className="w-20 h-20 bg-[#0b1f3a] rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-900/20">
                                        {((view === "enquiry" ? selectedItem.student_name : selectedItem.full_name) || "?")[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black text-slate-800 tracking-tight">
                                            {(view === "enquiry" ? selectedItem.student_name : selectedItem.full_name) || "Untitled Record"}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.15em]">
                                                {view === "enquiry" ? "Enquiry Record" : "Admission Record"}
                                            </span>
                                            <span className="text-slate-300">|</span>
                                            <span className="text-slate-400 font-bold text-xs tracking-widest uppercase">ID: #{(view === "enquiry" ? selectedItem.enquiry_id : (selectedItem.admission_number || selectedItem.enquiry_id)) || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-12">
                                    {/* Personal & Identification */}
                                    <section>
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6 group">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> Personal Information
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            <DetailBox label="Full Name" value={view === "enquiry" ? selectedItem.student_name : selectedItem.full_name} icon={User} />
                                            <DetailBox label="Gender" value={selectedItem.gender} icon={User} />
                                            <DetailBox label="Date of Birth" value={selectedItem.dob ? new Date(selectedItem.dob).toLocaleDateString() : "N/A"} icon={Calendar} />
                                            <DetailBox label="Age" value={selectedItem.age} icon={Calendar} />
                                            {view === "admission" && (
                                                <>
                                                    <DetailBox label="Aadhaar Number" value={selectedItem.aadhaar_number} icon={FileText} />
                                                    <DetailBox label="Passport No." value={selectedItem.passport_number || "None"} icon={BookOpen} />
                                                </>
                                            )}
                                        </div>
                                    </section>

                                    {/* Contact & Location */}
                                    <section>
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6 group">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> Contact Details
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            <DetailBox label="Mobile Number" value={selectedItem.mobile_number} icon={User} />
                                            <DetailBox label="WhatsApp No." value={selectedItem.whatsapp_number} icon={User} />
                                            <DetailBox label="Email Address" value={selectedItem.email_id} icon={AlertCircle} />
                                            <div className="md:col-span-2 lg:col-span-3">
                                                 <DetailBox label="Residential Address" value={`${selectedItem.residential_address || selectedItem.perm_address || ""}, ${selectedItem.city || selectedItem.perm_city || ""}, ${selectedItem.state || selectedItem.perm_state || ""} - ${selectedItem.pin_code || selectedItem.perm_pin || ""}`} icon={FileText} />
                                            </div>
                                        </div>
                                    </section>

                                    {/* Guardian & Background */}
                                    <section>
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6 group">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> Guardian & Background
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            <DetailBox label="Guardian Name" value={selectedItem.parent_name || selectedItem.father_name} icon={User} />
                                            <DetailBox label="Guardian Mobile" value={selectedItem.parent_mobile || selectedItem.parent_contact} icon={User} />
                                            <DetailBox label="Occupation" value={selectedItem.occupation || selectedItem.parent_occupation} icon={Briefcase} />
                                            <DetailBox label="Highest Qual." value={selectedItem.highest_qualification} icon={GraduationCap} />
                                            <DetailBox label="Institution" value={selectedItem.institution_name} icon={GraduationCap} />
                                            <DetailBox label="Year of Passing" value={selectedItem.year_of_passing} icon={Calendar} />
                                        </div>
                                    </section>

                                    {/* Training & Fees */}
                                    <section className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6 group">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> Course & Financials
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            <DetailBox label="Selected Course" value={selectedItem.course_interested || selectedItem.course_name} icon={BookOpen} />
                                            <DetailBox label="Training Mode" value={selectedItem.mode_of_training || selectedItem.training_mode} icon={RefreshCw} />
                                            <DetailBox label="Counsellor" value={selectedItem.counsellor_name} icon={CheckCircle2} />
                                            
                                            {view === "admission" && (
                                                <>
                                                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                                                        <DetailBox label="Total Course Fee" value={`₹ ${parseFloat(selectedItem.total_fees || 0).toLocaleString()}`} icon={RefreshCw} />
                                                    </div>
                                                    <div className="p-4 bg-green-50 rounded-2xl shadow-sm border border-green-100">
                                                        <DetailBox label="Fees Paid" value={`₹ ${parseFloat(selectedItem.paid_fees || 0).toLocaleString()}`} icon={CheckCircle2} />
                                                    </div>
                                                    <div className="p-4 bg-red-50 rounded-2xl shadow-sm border border-red-100">
                                                        <DetailBox label="Balance Amount" value={`₹ ${parseFloat(selectedItem.balance_amount || 0).toLocaleString()}`} icon={AlertCircle} />
                                                    </div>
                                                    <div className="md:col-span-3 grid grid-cols-2 gap-4">
                                                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                                            <DetailBox label="Instalment 1" value={`₹ ${parseFloat(selectedItem.instalment_1 || 0).toLocaleString()}`} icon={CreditCard || RefreshCw} />
                                                        </div>
                                                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                                            <DetailBox label="Instalment 2" value={`₹ ${parseFloat(selectedItem.instalment_2 || 0).toLocaleString()}`} icon={CreditCard || RefreshCw} />
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                            {view === "enquiry" && (
                                                <DetailBox label="Interest Level" value={selectedItem.interest_level} icon={AlertCircle} />
                                            )}
                                        </div>
                                    </section>

                                    {/* Office Internal Section — ONLY for Admissions */}
                                    {view === "admission" && (
                                        <section className="p-8 bg-blue-50/50 rounded-[2rem] border border-blue-100/50">
                                            <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-700 mb-6 group">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-700"></span> Office Internal Details
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                <DetailBox label="Admission Number" value={selectedItem.admission_number} icon={ShieldCheck} />
                                                <DetailBox label="Batch Allotted" value={selectedItem.batch_allotted} icon={Calendar} />
                                                <DetailBox label="Verified By" value={selectedItem.verified_by} icon={User} />
                                                <div className="md:col-span-2 lg:col-span-3">
                                                    <DetailBox label="Authorized Signatory" value={selectedItem.authorized_signature_by} icon={FileText} />
                                                </div>
                                            </div>
                                        </section>
                                    )}

                                    {selectedItem.remarks && (
                                        <section>
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-3 ml-1">Internal Remarks</h4>
                                            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 text-sm font-medium text-amber-900 italic">
                                                "{selectedItem.remarks}"
                                            </div>
                                        </section>
                                    )}
                                </div>

                                <div className="flex gap-4 mt-12 pt-8 border-t border-slate-100">
                                    <button 
                                        onClick={() => setSelectedItem(null)}
                                        className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all"
                                    >
                                        Close Details
                                    </button>
                                    <button 
                                        onClick={() => {
                                            const path = view === "enquiry" 
                                                ? "/dashboard/associate-management/enquiry" 
                                                : "/dashboard/associate-management/admission";
                                            router.push(path);
                                            setSelectedItem(null);
                                        }}
                                        className="flex-1 py-4 bg-[#0b1f3a] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all shadow-lg"
                                    >
                                        Go to Management
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

const DetailBox = ({ label, value, icon: Icon }: any) => (
    <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-slate-400">
            <Icon size={14} />
            <p className="text-[10px] font-black uppercase tracking-widest">{label}</p>
        </div>
        <p className="text-sm font-bold text-slate-700">{value || "Information not provided"}</p>
    </div>
);
