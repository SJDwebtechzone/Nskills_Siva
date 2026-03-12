"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Calendar, MapPin, GraduationCap, Target, Briefcase,
    Users, Send, ChevronRight, ChevronLeft, CheckCircle2,
    Database, Phone, Mail, Globe, Award, Sparkles, BookOpen,
    Clock, Smartphone, MessageCircle
} from "lucide-react";
import axios from "axios";

const steps = [
    { id: "A", title: "Basic Details", icon: Database },
    { id: "B", title: "Personal Details", icon: User },
    { id: "C", title: "Location Details", icon: MapPin },
    { id: "D", title: "Educational Info", icon: GraduationCap },
    { id: "E", title: "Career Goals", icon: Target },
    { id: "G", title: "Work Experience", icon: Briefcase },
    { id: "H", title: "Parent Details", icon: Users },
    { id: "I", title: "Referral & Assessment", icon: Sparkles },
    { id: "J", title: "Course Interest", icon: BookOpen },
    { id: "K", title: "Follow-up", icon: Clock },
];

export default function StudentEnquiryForm() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        enquiry_date: new Date().toISOString().split('T')[0],
        mode_of_enquiry: "Walk-in",
        student_name: "",
        gender: "Male",
        age: "",
        dob: "",
        mobile_number: "",
        whatsapp_number: "",
        email_id: "",
        perm_address: "",
        perm_city: "",
        perm_state: "",
        perm_pin: "",
        curr_address: "",
        curr_city: "",
        curr_state: "",
        curr_pin: "",
        highest_qualification: "12th",
        year_of_passing: "",
        institution_name: "",
        career_objective: "Job in India",
        preferred_country: "",
        expected_salary: "",
        willing_to_work_all_india: "Yes",
        work_experience: "",
        company_name: "",
        position: "",
        salary: "",
        location: "",
        skills_trade: "",
        father_name: "",
        mother_name: "",
        parent_contact: "",
        parent_occupation: "",
        referred_by: "Walk-in",
        counsellor_name: "",
        counsellor_code: "",
        will_attend_test: "Yes",
        course_interested: "",
        level_of_course: "Basic",
        training_mode: "Classroom",
        batch_timing: "Morning",
        counselling_date: new Date().toISOString().split('T')[0],
        counselling_done_by: "NTSC",
        interest_level: "Medium",
        follow_up_date: "",
        remarks: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => {
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
        setIsSubmitting(true);
        try {
            await axios.post("http://localhost:5000/api/enquiries", formData);
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                setCurrentStep(0);
                // Reset form potentially here
            }, 3000);
        } catch (error) {
            console.error("Submission failed", error);
            alert("Error submitting enquiry. Please check if backend is running.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (steps[currentStep].id) {
            case "A":
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Enquiry Date" name="enquiry_date" type="date" value={formData.enquiry_date} onChange={handleChange} />
                            <SelectField label="Mode of Enquiry" name="mode_of_enquiry" value={formData.mode_of_enquiry} options={["Walk-in", "Phone", "Social Media", "Referral"]} onChange={handleChange} />
                        </div>
                    </div>
                );
            case "B":
                return (
                    <div className="space-y-4">
                        <InputField label="Student Full Name" name="student_name" value={formData.student_name} onChange={handleChange} placeholder="As per documents" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <SelectField label="Gender" name="gender" value={formData.gender} options={["Male", "Female", "Other"]} onChange={handleChange} />
                            <InputField label="Age" name="age" type="number" value={formData.age} onChange={handleChange} />
                            <InputField label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InputField label="Mobile Number" name="mobile_number" value={formData.mobile_number} onChange={handleChange} prefix={<Smartphone size={16} />} />
                            <InputField label="WhatsApp Number" name="whatsapp_number" value={formData.whatsapp_number} onChange={handleChange} prefix={<MessageCircle size={16} />} />
                            <InputField label="Email ID" name="email_id" type="email" value={formData.email_id} onChange={handleChange} prefix={<Mail size={16} />} />
                        </div>
                    </div>
                );
            case "C":
                return (
                    <div className="space-y-6">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2"><MapPin size={18} /> Permanent Address</h4>
                            <TextAreaField label="Address" name="perm_address" value={formData.perm_address} onChange={handleChange} />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                                <InputField label="City / District" name="perm_city" value={formData.perm_city} onChange={handleChange} />
                                <InputField label="State" name="perm_state" value={formData.perm_state} onChange={handleChange} />
                                <InputField label="PIN Code" name="perm_pin" value={formData.perm_pin} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2"><MapPin size={18} /> Current Address</h4>
                            <TextAreaField label="Address" name="curr_address" value={formData.curr_address} onChange={handleChange} />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                                <InputField label="City / District" name="curr_city" value={formData.curr_city} onChange={handleChange} />
                                <InputField label="State" name="curr_state" value={formData.curr_state} onChange={handleChange} />
                                <InputField label="PIN Code" name="curr_pin" value={formData.curr_pin} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                );
            case "D":
                return (
                    <div className="space-y-4">
                        <SelectField label="Highest Qualification" name="highest_qualification" value={formData.highest_qualification}
                            options={["School Dropout", "8th / 9th / 10th", "12th", "ITI", "Diploma", "Degree", "Engineering"]} onChange={handleChange} />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Year of Passing / Studying" name="year_of_passing" value={formData.year_of_passing} onChange={handleChange} />
                            <InputField label="Institution / School / College" name="institution_name" value={formData.institution_name} onChange={handleChange} />
                        </div>
                    </div>
                );
            case "E":
                return (
                    <div className="space-y-4">
                        <SelectField label="Career Objective" name="career_objective" value={formData.career_objective}
                            options={["Job in India", "Overseas Job", "Self-Employment / Business"]} onChange={handleChange} />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InputField label="Preferred Country (if overseas)" name="preferred_country" value={formData.preferred_country} onChange={handleChange} />
                            <InputField label="Expected Salary Range" name="expected_salary" value={formData.expected_salary} onChange={handleChange} />
                            <SelectField label="Willing to work all-over India" name="willing_to_work_all_india" value={formData.willing_to_work_all_india} options={["Yes", "No"]} onChange={handleChange} />
                        </div>
                    </div>
                );
            case "G":
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Work Experience (Years/Months)" name="work_experience" value={formData.work_experience} onChange={handleChange} />
                            <InputField label="Company Name" name="company_name" value={formData.company_name} onChange={handleChange} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InputField label="Position" name="position" value={formData.position} onChange={handleChange} />
                            <InputField label="Salary" name="salary" value={formData.salary} onChange={handleChange} />
                            <InputField label="Location" name="location" value={formData.location} onChange={handleChange} />
                        </div>
                        <TextAreaField label="Current Skills / Trade Known" name="skills_trade" value={formData.skills_trade} onChange={handleChange} />
                    </div>
                );
            case "H":
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Father Name" name="father_name" value={formData.father_name} onChange={handleChange} />
                            <InputField label="Mother Name" name="mother_name" value={formData.mother_name} onChange={handleChange} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Contact Number" name="parent_contact" value={formData.parent_contact} onChange={handleChange} />
                            <InputField label="Occupation" name="parent_occupation" value={formData.parent_occupation} onChange={handleChange} />
                        </div>
                    </div>
                );
            case "I":
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SelectField label="Referred By" name="referred_by" value={formData.referred_by} options={["Career Counsellor", "Student", "Social Media", "Website", "Walk-in"]} onChange={handleChange} />
                            <InputField label="Career Counsellor Name" name="counsellor_name" value={formData.counsellor_name} onChange={handleChange} />
                        </div>
                        <InputField label="Counsellor Code" name="counsellor_code" value={formData.counsellor_code} onChange={handleChange} />

                        <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col items-center gap-4 text-center">
                            <Target className="text-blue-600" size={40} />
                            <div>
                                <h4 className="text-lg font-bold text-blue-900">Career Goal Assessment Test</h4>
                                <p className="text-blue-700 text-sm mt-1">Recommended for better course alignment.</p>
                            </div>
                            <div className="flex gap-4 items-center">
                                <span className="text-sm font-semibold text-blue-900">Attend Test?</span>
                                <div className="flex bg-white rounded-lg p-1 border border-blue-200">
                                    {["Yes", "No"].map(opt => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, will_attend_test: opt }))}
                                            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${formData.will_attend_test === opt ? 'bg-blue-600 text-white shadow-md' : 'text-blue-600 hover:bg-blue-50'}`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {formData.will_attend_test === "Yes" && (
                                <a
                                    href="https://originbi.in"
                                    target="_blank"
                                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200"
                                >
                                    Launch Assessment Portal <ChevronRight size={18} />
                                </a>
                            )}
                        </div>
                    </div>
                );
            case "J":
                return (
                    <div className="space-y-4">
                        <InputField label="Course Interested In" name="course_interested" value={formData.course_interested} onChange={handleChange} placeholder="e.g. MEP, HVAC, NDT" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <SelectField label="Level of Course" name="level_of_course" value={formData.level_of_course} options={["Basic", "Diploma", "Advanced", "International"]} onChange={handleChange} />
                            <SelectField label="Training Mode" name="training_mode" value={formData.training_mode} options={["Classroom", "Practical", "Hybrid"]} onChange={handleChange} />
                            <SelectField label="Preferred Timing" name="batch_timing" value={formData.batch_timing} options={["Morning", "Afternoon", "Evening"]} onChange={handleChange} />
                        </div>
                    </div>
                );
            case "K":
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Counselling Date" name="counselling_date" type="date" value={formData.counselling_date} onChange={handleChange} />
                            <InputField label="Counselling Done By" name="counselling_done_by" value={formData.counselling_done_by} onChange={handleChange} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SelectField label="Interest Level" name="interest_level" value={formData.interest_level} options={["High", "Medium", "Low"]} onChange={handleChange} />
                            <InputField label="Follow-up Date" name="follow_up_date" type="date" value={formData.follow_up_date} onChange={handleChange} />
                        </div>
                        <TextAreaField label="Remarks" name="remarks" value={formData.remarks} onChange={handleChange} />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-12">
            {/* Steps Progress */}
            <div className="mb-8 hidden md:block">
                <div className="flex justify-between relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        const isActive = idx === currentStep;
                        const isCompleted = idx < currentStep;
                        return (
                            <div key={step.id} className="relative z-10 flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isActive ? 'bg-blue-600 border-blue-600 text-white scale-110 shadow-lg shadow-blue-200' :
                                        isCompleted ? 'bg-green-500 border-green-500 text-white' :
                                            'bg-white border-slate-300 text-slate-400'
                                    }`}>
                                    {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                                </div>
                                <span className={`text-[10px] font-bold mt-2 uppercase tracking-tighter ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                                    {step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Form Container */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                <div className="bg-[#0b1f3a] p-8 md:p-10 text-white">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Student Enquiry</h2>
                            <p className="text-blue-200 mt-2 font-medium">Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}</p>
                        </div>
                        <div className="hidden sm:flex bg-white/10 p-4 rounded-3xl backdrop-blur-md items-center gap-3">
                            <Clock className="text-blue-300" size={20} />
                            <div className="text-right">
                                <p className="text-[10px] uppercase font-bold text-blue-300">Logged At</p>
                                <p className="text-sm font-bold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderStepContent()}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="mt-12 flex justify-between gap-4 border-t border-slate-100 pt-8">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={currentStep === 0}
                            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all border border-slate-200"
                        >
                            <ChevronLeft size={20} /> Back
                        </button>

                        {currentStep < steps.length - 1 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="flex items-center gap-2 px-8 py-3 rounded-2xl font-bold bg-[#0b1f3a] text-white hover:bg-blue-900 shadow-xl shadow-blue-900/10 transition-all"
                            >
                                Next Step <ChevronRight size={20} />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-10 py-3 rounded-2xl font-bold bg-green-600 text-white hover:bg-green-700 shadow-xl shadow-green-200 transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? "Submitting..." : (
                                    <>Submit Enquiry <Send size={20} /></>
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Success Overlay */}
            <AnimatePresence>
                {isSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-[3rem] p-12 max-w-sm w-full text-center shadow-2xl"
                        >
                            <div className="w-20 h-20 bg-green-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-green-600">
                                <CheckCircle2 size={48} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800">Success!</h3>
                            <p className="text-slate-500 mt-4 font-medium leading-relaxed">
                                The student enquiry has been recorded in the database successfully.
                            </p>
                            <button
                                onClick={() => setIsSuccess(false)}
                                className="mt-8 w-full py-4 bg-[#0b1f3a] text-white rounded-2xl font-bold shadow-xl shadow-blue-900/10 transition-transform hover:scale-[1.02]"
                            >
                                Back to Form
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Helper Components
const InputField = ({ label, name, value, onChange, type = "text", placeholder = "", prefix = null }: any) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-bold text-slate-600 ml-1">{label}</label>
        <div className="relative group">
            {prefix && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    {prefix}
                </div>
            )}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full bg-slate-50 border border-slate-200 rounded-2xl transition-all outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-slate-700 font-medium ${prefix ? 'pl-11 pr-4' : 'px-4'} py-3.5 placeholder:text-slate-300`}
            />
        </div>
    </div>
);

const SelectField = ({ label, name, value, options, onChange }: any) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-bold text-slate-600 ml-1">{label}</label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-slate-700 font-bold transition-all appearance-none cursor-pointer"
        >
            {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

const TextAreaField = ({ label, name, value, onChange }: any) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-bold text-slate-600 ml-1">{label}</label>
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows={3}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-slate-700 font-medium transition-all"
        />
    </div>
);
