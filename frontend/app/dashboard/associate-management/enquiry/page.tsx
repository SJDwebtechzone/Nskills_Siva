"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Calendar, MapPin, GraduationCap, Target, Briefcase,
    Users, Send, ChevronRight, ChevronLeft, CheckCircle2,
    Database, Phone, Mail, Globe, Award, Sparkles, BookOpen,
    Smartphone, MessageCircle, FileText, Search, List, PlusCircle, X, Eye, Edit, Trash2
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const steps = [
    { id: "A", title: "Personal Details", icon: User },
    { id: "B", title: "Education & Career", icon: GraduationCap },
    { id: "C", title: "Family & Referral", icon: Users },
    { id: "D", title: "Counselling Details", icon: BookOpen },
];

export default function StudentEnquiryForm() {
    const [viewMode, setViewMode] = useState<"form" | "list">("form");
    const [enquiries, setEnquiries] = useState<any[]>([]);
    const [isLoadingList, setIsLoadingList] = useState(false);
    const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null);

    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [enquiryId, setEnquiryId] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { can, user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    const [formData, setFormData] = useState<any>({
        student_name: "", gender: "Male", age: "", dob: "", mobile_number: "", whatsapp_number: "", email_id: "",
        perm_address: "", perm_city: "", perm_state: "", perm_pin: "",
        curr_address: "", curr_city: "", curr_state: "", curr_pin: "",
        highest_qualification: "", year_of_passing: "", institution_name: "",
        career_objective: "Job", preferred_country: "", expected_salary: "", willing_to_work_all_india: "Yes",
        work_experience: "Fresher", company_name: "", position: "", salary: "", location: "", skills_trade: "",
        father_name: "", mother_name: "", parent_contact: "", parent_occupation: "",
        referred_by: "", counsellor_name: "", counsellor_code: "", will_attend_test: "Yes",
        course_interested: "", level_of_course: "Basic", training_mode: "Classroom", batch_timing: "",
        counselling_date: "", counselling_done_by: "", interest_level: "High", follow_up_date: "", remarks: ""
    });

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        return { Authorization: `Bearer ${token}` };
    };

    useEffect(() => {
        if (viewMode === "list") {
            fetchEnquiries();
        }
    }, [viewMode]);

    const fetchEnquiries = async () => {
        setIsLoadingList(true);
        try {
            const res = await axios.get(`${API_BASE}/enquiries`, { headers: getAuthHeaders() });
            setEnquiries(res.data);
        } catch (err) {
            console.error("Failed to fetch enquiries", err);
        } finally {
            setIsLoadingList(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleEdit = (enq: any) => {
        if (user?.role === "Associate") {
            alert("Editing is restricted for Associate accounts. Please contact an Admin.");
            return;
        }
        setFormData({
            ...enq,
            enquiry_date: enq.enquiry_date ? enq.enquiry_date.split('T')[0] : "",
            dob: enq.dob ? enq.dob.split('T')[0] : "",
            counselling_date: enq.counselling_date ? enq.counselling_date.split('T')[0] : "",
            follow_up_date: enq.follow_up_date ? enq.follow_up_date.split('T')[0] : "",
        });
        setEditId(enq.id);
        setIsEditing(true);
        setViewMode("form");
        setCurrentStep(0);
    };

    const handleDelete = async (enq: any) => {
        if (!confirm(`Delete enquiry for "${enq.student_name}" (${enq.enquiry_id})? This cannot be undone.`)) return;
        try {
            await axios.delete(`${API_BASE}/enquiries/${enq.id}`, { headers: getAuthHeaders() });
            setEnquiries(prev => prev.filter(e => e.id !== enq.id));
        } catch (err: any) {
            alert(err.response?.data?.error || "Failed to delete enquiry.");
        }
    };

    const validateStep = (idx: number) => {
        const stepId = steps[idx].id;
        const newErrors: Record<string, string> = {};
        const phoneRegex = /^\d{10}$/;

        if (stepId === "A") {
            if (!formData.student_name) newErrors.student_name = "Required";
            if (!formData.mobile_number) newErrors.mobile_number = "Required";
            else if (!phoneRegex.test(formData.mobile_number)) newErrors.mobile_number = "10 digits required";
            if (!formData.whatsapp_number) newErrors.whatsapp_number = "Required";
            else if (!phoneRegex.test(formData.whatsapp_number)) newErrors.whatsapp_number = "10 digits required";
            if (!formData.email_id) newErrors.email_id = "Required";
            if (!formData.age) newErrors.age = "Required";
            if (!formData.dob) newErrors.dob = "Required";
            if (!formData.perm_address) newErrors.perm_address = "Required";
            if (!formData.perm_city) newErrors.perm_city = "Required";
        }
        if (stepId === "B") {
            if (!formData.highest_qualification) newErrors.highest_qualification = "Required";
            if (!formData.year_of_passing) newErrors.year_of_passing = "Required";
            if (!formData.institution_name) newErrors.institution_name = "Required";
        }
        if (stepId === "C") {
            if (!formData.father_name) newErrors.father_name = "Required";
            if (!formData.parent_contact) newErrors.parent_contact = "Required";
            else if (!phoneRegex.test(formData.parent_contact)) newErrors.parent_contact = "10 digits required";
        }
        if (stepId === "D") {
            if (!formData.course_interested) newErrors.course_interested = "Required: Selection is mandatory";
            if (!formData.interest_level) newErrors.interest_level = "Required";
            if (!formData.counselling_date && !formData.follow_up_date) newErrors.follow_up_date = "Either Follow-up or Counselling date required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateAllSteps = () => {
        for (let i = 0; i < steps.length; i++) {
            if (!validateStep(i)) {
                setCurrentStep(i);
                return false;
            }
        }
        return true;
    };

    const nextStep = () => {
        if (!validateStep(currentStep)) return;
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Safety: Prevent early submission
        if (currentStep < steps.length - 1) {
            nextStep();
            return;
        }

        if (!validateAllSteps()) return;
        setIsSubmitting(true);
        try {
            if (isEditing && editId) {
                await axios.patch(`${API_BASE}/enquiries/${editId}`, formData, { headers: getAuthHeaders() });
            } else {
                const response = await axios.post(`${API_BASE}/enquiries`, formData, { headers: getAuthHeaders() });
                setEnquiryId(response.data.enquiry_id);
            }
            setIsSuccess(true);
        } catch (error: any) {
            console.error("Enquiry submission error:", error);
            const serverMsg = error.response?.data?.error || error.response?.data?.details || "Unknown server error";
            alert(`Error submitting enquiry: ${serverMsg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (steps[currentStep].id) {
            case "A":
                return (
                    <div className="space-y-4">
                        <InputField label="Student Full Name" name="student_name" value={formData.student_name} onChange={handleChange} error={errors.student_name} compulsory />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SelectField label="Gender" name="gender" options={["Male", "Female", "Other"]} value={formData.gender} onChange={handleChange} />
                            <InputField label="Age" name="age" type="number" value={formData.age} onChange={handleChange} error={errors.age} compulsory />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} error={errors.dob} compulsory />
                            <InputField label="Mobile Number" name="mobile_number" value={formData.mobile_number} onChange={handleChange} error={errors.mobile_number} compulsory />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="WhatsApp Number" name="whatsapp_number" value={formData.whatsapp_number} onChange={handleChange} error={errors.whatsapp_number} compulsory />
                            <InputField label="Email ID" name="email_id" type="email" value={formData.email_id} onChange={handleChange} error={errors.email_id} compulsory />
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Permanent Address</h4>
                            <TextAreaField label="Address" name="perm_address" value={formData.perm_address} onChange={handleChange} error={errors.perm_address} compulsory />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                                <InputField label="City" name="perm_city" value={formData.perm_city} onChange={handleChange} error={errors.perm_city} compulsory />
                                <InputField label="State" name="perm_state" value={formData.perm_state} onChange={handleChange} />
                                <InputField label="PIN" name="perm_pin" value={formData.perm_pin} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                );
            case "B":
                return (
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Education</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="Highest Qualification" name="highest_qualification" value={formData.highest_qualification} onChange={handleChange} error={errors.highest_qualification} compulsory />
                                <InputField label="Year of Passing" name="year_of_passing" type="number" value={formData.year_of_passing} onChange={handleChange} error={errors.year_of_passing} compulsory />
                            </div>
                            <InputField label="Institution Name" name="institution_name" value={formData.institution_name} onChange={handleChange} error={errors.institution_name} compulsory />
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Career Goals</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <SelectField label="Career Objective" name="career_objective" options={["Job", "Business", "Higher Studies"]} value={formData.career_objective} onChange={handleChange} />
                                <InputField label="Preferred Country" name="preferred_country" value={formData.preferred_country} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                );
            case "C":
                return (
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Family Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="Father's Name" name="father_name" value={formData.father_name} onChange={handleChange} error={errors.father_name} compulsory />
                                <InputField label="Mother's Name" name="mother_name" value={formData.mother_name} onChange={handleChange} />
                            </div>
                            <InputField label="Parent Contact" name="parent_contact" value={formData.parent_contact} onChange={handleChange} error={errors.parent_contact} compulsory />
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Referral</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="Referred By" name="referred_by" value={formData.referred_by} onChange={handleChange} />
                                <InputField label="Counsellor Name" name="counsellor_name" value={formData.counsellor_name} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                );
            case "D":
                return (
                    <div className="space-y-4">
                        <InputField label="Course Interested" name="course_interested" value={formData.course_interested} onChange={handleChange} error={errors.course_interested} compulsory />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SelectField label="Interest Level" name="interest_level" options={["High", "Medium", "Low"]} value={formData.interest_level} onChange={handleChange} error={errors.interest_level} compulsory />
                            <InputField label="Follow-up Date" name="follow_up_date" type="date" value={formData.follow_up_date} onChange={handleChange} error={errors.follow_up_date} />
                        </div>
                        <TextAreaField label="Remarks" name="remarks" value={formData.remarks} onChange={handleChange} />
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8 px-4">
                <div className="flex bg-slate-100 p-1 rounded-2xl">
                    <button onClick={() => { 
                        setViewMode("form"); 
                        setIsEditing(false); 
                        setEditId(null);
                        setFormData({
                            student_name: "", gender: "Male", age: "", dob: "", mobile_number: "", whatsapp_number: "", email_id: "",
                            perm_address: "", perm_city: "", perm_state: "", perm_pin: "",
                            curr_address: "", curr_city: "", curr_state: "", curr_pin: "",
                            highest_qualification: "", year_of_passing: "", institution_name: "",
                            career_objective: "Job", preferred_country: "", expected_salary: "", willing_to_work_all_india: "Yes",
                            work_experience: "Fresher", company_name: "", position: "", salary: "", location: "", skills_trade: "",
                            father_name: "", mother_name: "", parent_contact: "", parent_occupation: "",
                            referred_by: "", counsellor_name: "", counsellor_code: "", will_attend_test: "Yes",
                            course_interested: "", level_of_course: "Basic", training_mode: "Classroom", batch_timing: "",
                            counselling_date: "", counselling_done_by: "", interest_level: "High", follow_up_date: "", remarks: ""
                        });
                        setCurrentStep(0);
                    }} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${viewMode === "form" ? 'bg-[#0b1f3a] text-white' : 'text-slate-500'}`}>
                        <PlusCircle size={18} /> New Enquiry
                    </button>
                    <button onClick={() => setViewMode("list")} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${viewMode === "list" ? 'bg-[#0b1f3a] text-white' : 'text-slate-500'}`}>
                        <List size={18} /> View List
                    </button>
                </div>
            </div>

            {viewMode === "form" ? (
                <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                    <div className="bg-[#0b1f3a] px-8 pt-10 pb-6 text-white relative overflow-hidden">
                        <div className="flex justify-between items-center relative z-10 mb-8">
                            <div>
                                <h2 className="text-3xl font-black tracking-tight">{isEditing ? "Edit Enquiry" : "Student Enquiry"}</h2>
                                <p className="text-blue-300 font-bold mt-1 uppercase text-xs tracking-[0.1em]">{isEditing ? "Update details for " + (formData.student_name || "") : steps[currentStep].title}</p>
                            </div>
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                                <span className="text-xl font-black">{currentStep + 1}</span>
                            </div>
                        </div>

                        {/* Cleaner Step Indicator Bar */}
                        <div className="relative z-10 flex gap-1 overflow-x-auto no-scrollbar pb-2">
                            {steps.map((s, idx) => (
                                <button 
                                    key={s.id}
                                    type="button"
                                    onClick={() => {
                                        if (user?.role === "Super Admin" || user?.role === "Admin") {
                                            setCurrentStep(idx);
                                        } else {
                                            if (idx > currentStep) {
                                                if (validateStep(currentStep)) setCurrentStep(idx);
                                            } else if (idx < currentStep) {
                                                setCurrentStep(idx);
                                            }
                                        }
                                    }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap min-w-fit ${currentStep === idx ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-200/40 hover:text-white hover:bg-white/5'}`}
                                >
                                    <span className="text-[11px] font-black uppercase tracking-widest">{idx + 1}. {s.title}</span>
                                </button>
                            ))}
                        </div>
                        
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl z-0" />
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-12">
                        {renderStepContent()}
                        <div className="mt-12 flex justify-between items-center pt-8 border-t border-slate-100">
                            <button type="button" onClick={prevStep} disabled={currentStep === 0} className="flex items-center gap-2 px-6 py-3 font-bold uppercase text-[10px] text-slate-400 disabled:opacity-0 transition-all">
                                <ChevronLeft size={16} /> Back
                            </button>
                            {currentStep < steps.length - 1 ? (
                                <button type="button" onClick={nextStep} className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-[#0b1f3a] text-white hover:bg-blue-900 transition-all">
                                    Next Step <ChevronRight size={16} />
                                </button>
                            ) : (
                                <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-10 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-blue-600 text-white hover:bg-blue-700 transition-all">
                                    {isSubmitting ? "Submitting..." : isEditing ? "Update Record" : "Finish & Send"} <Send size={16} />
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            ) : (
                <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 min-h-[400px]">
                    <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-slate-800"><Database size={24} /> My Enquiries</h3>
                    {isLoadingList ? <p className="text-center py-10 font-bold text-slate-400">Loading...</p> : 
                     enquiries.length === 0 ? <p className="text-center py-10 font-bold text-slate-300">No enquiries yet.</p> : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b-2 border-slate-50">
                                    <tr>
                                        <th className="py-4 font-black uppercase text-[10px] tracking-widest text-slate-400">ID</th>
                                        <th className="py-4 font-black uppercase text-[10px] tracking-widest text-slate-400">Student</th>
                                        <th className="py-4 font-black uppercase text-[10px] tracking-widest text-slate-400">Associate Name</th>
                                        <th className="py-4 font-black uppercase text-[10px] tracking-widest text-slate-400">Course</th>
                                        <th className="py-4 font-black uppercase text-[10px] tracking-widest text-slate-400">Date</th>
                                        <th className="py-4 text-center font-black uppercase text-[10px] tracking-widest text-slate-400">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {enquiries.map(enq => (
                                        <tr key={enq.id} className="border-b border-slate-50 hover:bg-slate-50">
                                            <td className="py-4 font-mono font-black text-blue-600">{enq.enquiry_id}</td>
                                            <td className="py-4 font-bold text-slate-800">{enq.student_name}</td>
                                            <td className="py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{enq.associate_name || "Self / Admin"}</td>
                                            <td className="py-4 text-sm font-medium text-slate-500">{enq.course_interested}</td>
                                            <td className="py-4 text-sm font-medium text-slate-400">{new Date(enq.created_at).toLocaleDateString()}</td>
                                             <td className="py-4 text-center">
                                                <div className="flex gap-2 justify-center">
                                                    <button onClick={() => setSelectedEnquiry(enq)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all" title="View">
                                                        <Eye size={16} />
                                                    </button>
                                                    {can("Associate Management", "edit") && user?.role !== "Associate" && (
                                                        <button onClick={() => handleEdit(enq)} className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-600 hover:text-white transition-all" title="Edit">
                                                            <Edit size={16} />
                                                        </button>
                                                    )}
                                                    {can("Associate Management", "delete") && user?.role !== "Associate" && (
                                                        <button onClick={() => handleDelete(enq)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all" title="Delete">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                             </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            <AnimatePresence>
                {selectedEnquiry && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl relative"
                        >
                            <button 
                                onClick={() => setSelectedEnquiry(null)} 
                                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                                <X size={24} />
                            </button>

                            <div className="p-10 max-h-[85vh] overflow-y-auto custom-scrollbar">
                                <div className="flex items-center gap-6 mb-10 pb-6 border-b border-slate-100">
                                    <div className="w-20 h-20 bg-[#0b1f3a] rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl">
                                        {selectedEnquiry.student_name[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider">Student Enquiry</span>
                                            <span className="text-slate-300">|</span>
                                            <span className="text-blue-600 font-mono font-black text-xs uppercase">#{selectedEnquiry.enquiry_id}</span>
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-800 tracking-tight">{selectedEnquiry.student_name}</h3>
                                    </div>
                                </div>

                                <div className="space-y-12">
                                    {/* Personal Info */}
                                    <section>
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> 1. Personal Information
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            <DetailItem label="Full Name" value={selectedEnquiry.student_name} />
                                            <DetailItem label="Gender" value={selectedEnquiry.gender} />
                                            <DetailItem label="Age" value={selectedEnquiry.age} />
                                            <DetailItem label="Date of Birth" value={selectedEnquiry.dob ? new Date(selectedEnquiry.dob).toLocaleDateString() : "N/A"} />
                                            <DetailItem label="Nationality" value={selectedEnquiry.nationality || "Indian"} />
                                        </div>
                                    </section>

                                    {/* Contact Info */}
                                    <section>
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> 2. Contact Details
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            <DetailItem label="Mobile Number" value={selectedEnquiry.mobile_number} />
                                            <DetailItem label="WhatsApp Number" value={selectedEnquiry.whatsapp_number} />
                                            <DetailItem label="Email ID" value={selectedEnquiry.email_id} />
                                            <div className="md:col-span-2 lg:col-span-3">
                                                 <DetailItem label="Permanent Address" value={`${selectedEnquiry.perm_address}, ${selectedEnquiry.perm_city}, ${selectedEnquiry.perm_state} - ${selectedEnquiry.perm_pin}`} />
                                            </div>
                                        </div>
                                    </section>

                                    {/* Education & Career */}
                                    <section>
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> 3. Education & Career
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            <DetailItem label="Qualification" value={selectedEnquiry.highest_qualification} />
                                            <DetailItem label="Year of Passing" value={selectedEnquiry.year_of_passing} />
                                            <DetailItem label="Institution" value={selectedEnquiry.institution_name} />
                                            <DetailItem label="Career Objective" value={selectedEnquiry.career_objective} />
                                            <DetailItem label="Work Experience" value={selectedEnquiry.work_experience} />
                                            <DetailItem label="Location Preferred" value={selectedEnquiry.location} />
                                        </div>
                                    </section>

                                    {/* Family Details */}
                                    <section>
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> 4. Family & Referral
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            <DetailItem label="Father's Name" value={selectedEnquiry.father_name} />
                                            <DetailItem label="Mother's Name" value={selectedEnquiry.mother_name} />
                                            <DetailItem label="Parent Contact" value={selectedEnquiry.parent_contact} />
                                            <DetailItem label="Referred By" value={selectedEnquiry.referred_by} />
                                            <DetailItem label="Counsellor" value={selectedEnquiry.counsellor_name} />
                                        </div>
                                    </section>

                                    {/* Counselling Details */}
                                    <section className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 italic">
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6 not-italic">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> 5. Counselling Details
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            <DetailItem label="Course Interested" value={selectedEnquiry.course_interested} />
                                            <DetailItem label="Interest Level" value={selectedEnquiry.interest_level} />
                                            <DetailItem label="Training Mode" value={selectedEnquiry.training_mode} />
                                            <DetailItem label="Follow-up Date" value={selectedEnquiry.follow_up_date ? new Date(selectedEnquiry.follow_up_date).toLocaleDateString() : "Not set"} />
                                        </div>
                                        {selectedEnquiry.remarks && (
                                            <div className="mt-8 pt-6 border-t border-slate-200">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 not-italic">Notes / Remarks</p>
                                                <p className="text-sm text-slate-600 font-medium">"{selectedEnquiry.remarks}"</p>
                                            </div>
                                        )}
                                    </section>
                                </div>

                                <div className="mt-12 flex items-center justify-center">
                                    <button 
                                        onClick={() => setSelectedEnquiry(null)}
                                        className="w-full py-4 bg-[#0b1f3a] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all shadow-lg"
                                    >
                                        Close Record
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isSuccess && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 bg-[#0b1f3a]/90 flex items-center justify-center p-6">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-[3rem] p-12 max-w-sm w-full text-center">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={40} /></div>
                            <h3 className="text-2xl font-black text-slate-800">{isEditing ? "Enquiry Updated!" : "Enquiry Submitted!"}</h3>
                            {!isEditing && (
                                <>
                                    <p className="text-slate-400 font-bold mt-2 uppercase text-[10px]">Your Enquiry ID is</p>
                                    <p className="text-3xl font-black text-blue-600 mt-2 font-mono">{enquiryId}</p>
                                </>
                            )}
                            <button onClick={() => { setIsSuccess(false); window.location.reload(); }} className="mt-8 w-full py-4 bg-[#0b1f3a] text-white rounded-2xl font-black uppercase text-[10px]">Back to Dashboard</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const DetailItem = ({ label, value }: any) => (
    <div className="flex flex-col gap-1 border-b border-slate-50 pb-3">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <span className="text-sm font-bold text-slate-700">{value || "---"}</span>
    </div>
);

const InputField = ({ label, name, value, onChange, type = "text", error = "", compulsory = false }: any) => (
    <div className="flex flex-col gap-1.5 w-full">
        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-1">{label} {compulsory && "*"}</label>
        <input type={type} name={name} value={value} onChange={onChange} className={`w-full px-5 py-3.5 bg-slate-50 border ${error ? 'border-red-500' : 'border-slate-200'} rounded-2xl outline-none focus:border-blue-500 font-bold text-slate-900`} />
        {error && <span className="text-red-500 text-[9px] font-black uppercase mt-1">{error}</span>}
    </div>
);

const SelectField = ({ label, name, value, options, onChange, error = "", compulsory = false }: any) => (
    <div className="flex flex-col gap-1.5 w-full">
        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-1">{label} {compulsory && <span className="text-red-500">*</span>}</label>
        <select name={name} value={value} onChange={onChange} className={`w-full px-5 py-3.5 bg-slate-50 border ${error ? 'border-red-500' : 'border-slate-200'} rounded-2xl outline-none focus:border-blue-500 font-bold text-slate-900`}>
            {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
        </select>
        {error && <span className="text-red-500 text-[9px] font-black uppercase mt-1">{error}</span>}
    </div>
);

const TextAreaField = ({ label, name, value, onChange, error = "", compulsory = false }: any) => (
    <div className="flex flex-col gap-1.5 w-full">
        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-1">{label} {compulsory && "*"}</label>
        <textarea name={name} value={value} onChange={onChange} rows={3} className={`w-full p-5 bg-slate-50 border ${error ? 'border-red-500' : 'border-slate-200'} rounded-2xl outline-none focus:border-blue-500 font-bold text-slate-900`} />
        {error && <span className="text-red-500 text-[9px] font-black uppercase mt-1">{error}</span>}
    </div>
);
