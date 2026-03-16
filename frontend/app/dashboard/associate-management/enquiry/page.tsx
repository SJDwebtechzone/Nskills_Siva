"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Calendar, MapPin, GraduationCap, Target, Briefcase,
    Users, Send, ChevronRight, ChevronLeft, CheckCircle2,
    Database, Phone, Mail, Globe, Award, Sparkles, BookOpen,
    Smartphone, MessageCircle, FileText, Search, List, PlusCircle, X, Eye
} from "lucide-react";
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
            if (!formData.institution_name) newErrors.institution_name = "Required";
        }
        if (stepId === "C") {
            if (!formData.father_name) newErrors.father_name = "Required";
            if (!formData.parent_contact) newErrors.parent_contact = "Required";
            else if (!phoneRegex.test(formData.parent_contact)) newErrors.parent_contact = "10 digits required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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
        if (!validateStep(currentStep)) return;
        setIsSubmitting(true);
        try {
            const response = await axios.post(`${API_BASE}/enquiries`, formData, { headers: getAuthHeaders() });
            setEnquiryId(response.data.enquiry_id);
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
                            <InputField label="Highest Qualification" name="highest_qualification" value={formData.highest_qualification} onChange={handleChange} error={errors.highest_qualification} compulsory />
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
                        <InputField label="Course Interested" name="course_interested" value={formData.course_interested} onChange={handleChange} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SelectField label="Interest Level" name="interest_level" options={["High", "Medium", "Low"]} value={formData.interest_level} onChange={handleChange} />
                            <InputField label="Follow-up Date" name="follow_up_date" type="date" value={formData.follow_up_date} onChange={handleChange} />
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
                    <button onClick={() => setViewMode("form")} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${viewMode === "form" ? 'bg-[#0b1f3a] text-white' : 'text-slate-500'}`}>
                        <PlusCircle size={18} /> New Enquiry
                    </button>
                    <button onClick={() => setViewMode("list")} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${viewMode === "list" ? 'bg-[#0b1f3a] text-white' : 'text-slate-500'}`}>
                        <List size={18} /> View List
                    </button>
                </div>
            </div>

            {viewMode === "form" ? (
                <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                    <div className="bg-[#0b1f3a] px-8 py-10 text-white flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-black tracking-tight">Student Enquiry</h2>
                            <p className="text-blue-300 font-bold mt-1 uppercase text-xs tracking-widest">{steps[currentStep].title}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                            <span className="text-xl font-black">{currentStep + 1}</span>
                        </div>
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
                                    {isSubmitting ? "Submitting..." : "Finish & Send"} <Send size={16} />
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            ) : (
                <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 min-h-[400px]">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#0b1f3a]"><Database size={24} /> My Enquiries</h3>
                    {isLoadingList ? <p className="text-center py-10 font-bold text-slate-400">Loading...</p> : 
                     enquiries.length === 0 ? <p className="text-center py-10 font-bold text-slate-300">No enquiries yet.</p> : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b-2 border-slate-50">
                                    <tr>
                                        <th className="py-4 font-black uppercase text-[10px] tracking-widest text-slate-400">ID</th>
                                        <th className="py-4 font-black uppercase text-[10px] tracking-widest text-slate-400">Student</th>
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
                                            <td className="py-4 text-sm font-medium text-slate-500">{enq.course_interested}</td>
                                            <td className="py-4 text-sm font-medium text-slate-400">{new Date(enq.created_at).toLocaleDateString()}</td>
                                            <td className="py-4 text-center">
                                                <button onClick={() => setSelectedEnquiry(enq)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                                                    <Eye size={16} />
                                                </button>
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
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-[2rem] w-full max-w-3xl p-10 relative max-h-[90vh] overflow-y-auto">
                            <button onClick={() => setSelectedEnquiry(null)} className="absolute top-6 right-6 text-slate-300 hover:text-red-500"><X size={24} /></button>
                            <h3 className="text-2xl font-black text-slate-800 mb-6">{selectedEnquiry.student_name}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DetailItem label="Enquiry ID" value={selectedEnquiry.enquiry_id} />
                                <DetailItem label="Mobile" value={selectedEnquiry.mobile_number} />
                                <DetailItem label="Email" value={selectedEnquiry.email_id} />
                                <DetailItem label="Course Interested" value={selectedEnquiry.course_interested} />
                                <DetailItem label="Gender" value={selectedEnquiry.gender} />
                                <DetailItem label="Date of Birth" value={new Date(selectedEnquiry.dob).toLocaleDateString()} />
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
                            <h3 className="text-2xl font-black text-slate-800">Enquiry Submitted!</h3>
                            <p className="text-slate-400 font-bold mt-2 uppercase text-[10px]">Your Enquiry ID is</p>
                            <p className="text-3xl font-black text-blue-600 mt-2 font-mono">{enquiryId}</p>
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

const SelectField = ({ label, name, value, options, onChange }: any) => (
    <div className="flex flex-col gap-1.5 w-full">
        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-1">{label}</label>
        <select name={name} value={value} onChange={onChange} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500 font-bold text-slate-900">
            {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
        </select>
    </div>
);

const TextAreaField = ({ label, name, value, onChange, error = "", compulsory = false }: any) => (
    <div className="flex flex-col gap-1.5 w-full">
        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-1">{label} {compulsory && "*"}</label>
        <textarea name={name} value={value} onChange={onChange} rows={3} className={`w-full p-5 bg-slate-50 border ${error ? 'border-red-500' : 'border-slate-200'} rounded-2xl outline-none focus:border-blue-500 font-bold text-slate-900`} />
        {error && <span className="text-red-500 text-[9px] font-black uppercase mt-1">{error}</span>}
    </div>
);
