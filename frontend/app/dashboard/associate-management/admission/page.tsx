"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Calendar, MapPin, GraduationCap, Target, Briefcase,
    Users, Send, ChevronRight, ChevronLeft, CheckCircle2,
    Database, Phone, Mail, Globe, Award, Sparkles, BookOpen,
    Clock, Smartphone, MessageCircle, FileText, CreditCard, ShieldCheck,
    Search, AlertCircle, List, PlusCircle, Upload, AlertTriangle, Eye, X, Edit, Trash2
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const steps = [
    { id: "SEARCH", title: "Find Enquiry", icon: Search },
    { id: "A", title: "Basic Info", icon: User },
    { id: "BC", title: "Contact & Parent", icon: Users },
    { id: "DE", title: "Education & Exp", icon: GraduationCap },
    { id: "FG", title: "Course & Goals", icon: BookOpen },
    { id: "IJ", title: "Fees & Referral", icon: CreditCard },
    { id: "KLM", title: "Checklist & Decl.", icon: ShieldCheck },
    { id: "N", title: "Office Use", icon: FileText },
];

export default function StudentAdmissionForm() {
    const [viewMode, setViewMode] = useState<"form" | "list">("form");
    const [admissions, setAdmissions] = useState<any[]>([]);
    const [isLoadingList, setIsLoadingList] = useState(false);
    const [selectedAdmission, setSelectedAdmission] = useState<any>(null);
    
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [searchId, setSearchId] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { can, user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    const [formData, setFormData] = useState<any>({
        enquiry_id: "",
        full_name: "",
        gender: "Male",
        dob: "",
        age: "",
        aadhaar_number: "",
        passport_number: "",
        passport_validity: "",
        photo_file: null,

        mobile_number: "",
        alt_mobile_number: "",
        whatsapp_number: "",
        email_id: "",
        residential_address: "",
        city: "",
        state: "",
        pin_code: "",

        parent_name: "",
        relationship: "",
        parent_mobile: "",
        occupation: "",
        annual_income: "",

        highest_qualification: "",
        year_of_passing: "",
        institution_name: "",
        board_university: "",
        medium_of_study: "",

        technical_background: "",
        total_experience: "",
        industry_experience: "",
        skills_known: "",

        course_interested: "",
        course_level: "Basic",
        mode_of_training: "Classroom",
        batch_preference: "",
        training_location: "",

        career_goal: "Job in India",
        preferred_country: "",
        expected_salary: "",
        willing_to_relocate: "Yes",

        counsellor_name: "",
        counsellor_code: "",
        referral_source: "Career Counsellor",
        counselling_date: "",

        course_name: "",
        course_fees: "0",
        total_fees: "0",
        paid_fees: "0",
        payment_mode: "Cash",
        payment_ref_no: "",
        payment_date: "",
        instalment_1: "0",
        instalment_2: "0",
        balance_amount: "0",

        // Files
        has_aadhaar_file: null,
        has_edu_certs_file: null,
        has_passport_file: null,
        has_resume_file: null,
        has_address_proof_file: null,
        has_photos_file: null,

        // Declarations
        student_declaration: false,
        parent_declaration: false,
        placement_ack: false,
        overseas_disclaimer: false,
        discipline_ack: false,
        photo_consent: false,
        refund_policy_ack: false,
        data_privacy_ack: false,
        final_undertaking: false,

        emergency_contact_name: "",
        emergency_contact_number: "",
        emergency_authorized: false,

        admission_number: "",
        batch_allotted: "",
        verified_by: "",
        authorized_signature_by: ""
    });

    // Helper for Auth Headers
    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        return { Authorization: `Bearer ${token}` };
    };

    useEffect(() => {
        if (viewMode === "list") {
            fetchAdmissions();
        }
    }, [viewMode]);

    // Auto-calculate balance
    useEffect(() => {
        if (user?.role === "Super Admin") return; // Allow Super Admin to edit manually
        const total = parseFloat(formData.total_fees) || 0;
        const paid = parseFloat(formData.paid_fees) || 0;
        const inst1 = parseFloat(formData.instalment_1) || 0;
        const inst2 = parseFloat(formData.instalment_2) || 0;
        const balance = total - (paid + inst1 + inst2);
        setFormData((prev: any) => ({ ...prev, balance_amount: balance.toString() }));
    }, [formData.total_fees, formData.paid_fees, formData.instalment_1, formData.instalment_2, user]);

    const fetchAdmissions = async () => {
        setIsLoadingList(true);
        try {
            const res = await axios.get(`${API_BASE}/admissions`, {
                headers: getAuthHeaders()
            });
            setAdmissions(res.data);
        } catch (err) {
            console.error("Failed to fetch admissions", err);
        } finally {
            setIsLoadingList(false);
        }
    };

    const handleSearch = async () => {
        if (!searchId) return;
        setIsSearching(true);
        try {
            const res = await axios.get(`${API_BASE}/enquiries/${searchId}`, {
                headers: getAuthHeaders()
            });
            const data = res.data;
            setFormData((prev: any) => ({
                ...prev,
                enquiry_id: data.enquiry_id,
                full_name: data.student_name || "",
                gender: data.gender || "Male",
                dob: data.dob ? data.dob.split('T')[0] : "",
                age: data.age?.toString() || "",
                mobile_number: data.mobile_number || "",
                whatsapp_number: data.whatsapp_number || "",
                email_id: data.email_id || "",
                residential_address: data.perm_address || "",
                city: data.perm_city || "",
                state: data.perm_state || "",
                pin_code: data.perm_pin || "",
                parent_name: data.father_name || "",
                parent_mobile: data.parent_contact || "",
                highest_qualification: data.highest_qualification || "",
                year_of_passing: data.year_of_passing || "",
                institution_name: data.institution_name || "",
                course_interested: data.course_interested || "",
                course_level: data.level_of_course || "Basic",
                mode_of_training: data.training_mode || "Classroom",
                counsellor_name: data.counsellor_name || "",
                counsellor_code: data.counsellor_code || "",
                referral_source: data.referred_by || "Career Counsellor",
                counselling_date: data.counselling_date ? data.counselling_date.split('T')[0] : ""
            }));
            setCurrentStep(1); // Move to Step A
            setErrors({});
        } catch (err) {
            alert("Enquiry ID not found or access denied.");
        } finally {
            setIsSearching(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev: any) => ({ ...prev, [name]: checked }));
        } else if (type === "file") {
            const file = (e.target as HTMLInputElement).files?.[0];
            setFormData((prev: any) => ({ ...prev, [name]: file }));
        } else {
            setFormData((prev: any) => ({ ...prev, [name]: value }));
        }
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleEdit = (adm: any) => {
        setFormData({
            ...adm,
            dob: adm.dob ? adm.dob.split('T')[0] : "",
            passport_validity: adm.passport_validity ? adm.passport_validity.split('T')[0] : "",
            counselling_date: adm.counselling_date ? adm.counselling_date.split('T')[0] : "",
            payment_date: adm.payment_date ? adm.payment_date.split('T')[0] : ""
        });
        setEditId(adm.id);
        setIsEditing(true);
        setViewMode("form");
        setCurrentStep(1); // Jump to Basic Info
    };

    const handleDelete = async (adm: any) => {
        if (!confirm(`Delete admission for "${adm.full_name}" (${adm.enquiry_id})? This will also remove referral points. Cannot be undone.`)) return;
        try {
            await axios.delete(`${API_BASE}/admissions/${adm.id}`, { headers: getAuthHeaders() });
            setAdmissions(prev => prev.filter(a => a.id !== adm.id));
        } catch (err: any) {
            alert(err.response?.data?.error || "Failed to delete admission.");
        }
    };

    const validateStep = (idx: number) => {
        const stepId = steps[idx].id;
        const newErrors: Record<string, string> = {};
        const phoneRegex = /^\d{10}$/;

        if (stepId === "SEARCH") {
            if (!formData.enquiry_id) newErrors.enquiry_id = "Required";
        }
        if (stepId === "A") {
            if (!formData.full_name) newErrors.full_name = "Full Name is compulsory";
            if (!formData.gender) newErrors.gender = "Required";
            if (!formData.dob) newErrors.dob = "Required";
            if (!formData.age) newErrors.age = "Required";
            if (!formData.aadhaar_number) newErrors.aadhaar_number = "Aadhaar is compulsory";
            if (!formData.photo_file && !formData.photo_url) newErrors.photo_file = "Recent photo is compulsory";
        }
        if (stepId === "BC") {
            if (!formData.mobile_number) newErrors.mobile_number = "Required";
            else if (!phoneRegex.test(formData.mobile_number)) newErrors.mobile_number = "Must be 10 digits";
            
            if (!formData.whatsapp_number) newErrors.whatsapp_number = "Required";
            else if (!phoneRegex.test(formData.whatsapp_number)) newErrors.whatsapp_number = "Must be 10 digits";

            if (!formData.email_id) newErrors.email_id = "Required";
            if (!formData.residential_address) newErrors.residential_address = "Required";
            if (!formData.city) newErrors.city = "Required";
            if (!formData.state) newErrors.state = "Required";
            if (!formData.pin_code) newErrors.pin_code = "Required";

            if (!formData.parent_name) newErrors.parent_name = "Required";
            if (!formData.relationship) newErrors.relationship = "Required";
            if (!formData.parent_mobile) newErrors.parent_mobile = "Required";
            else if (!phoneRegex.test(formData.parent_mobile)) newErrors.parent_mobile = "Must be 10 digits";
            if (!formData.occupation) newErrors.occupation = "Required";
        }
        if (stepId === "DE") {
            if (!formData.highest_qualification) newErrors.highest_qualification = "Required";
            if (!formData.year_of_passing) newErrors.year_of_passing = "Required";
            if (!formData.institution_name) newErrors.institution_name = "Required";
            if (!formData.board_university) newErrors.board_university = "Required";
            if (!formData.medium_of_study) newErrors.medium_of_study = "Required";
        }
        if (stepId === "FG") {
            if (!formData.course_interested) newErrors.course_interested = "Required";
            if (!formData.career_goal) newErrors.career_goal = "Required";
        }
        if (stepId === "IJ") {
            if (!formData.counsellor_name) newErrors.counsellor_name = "Required";
            if (!formData.counsellor_code) newErrors.counsellor_code = "Required";
            if (!formData.counselling_date) newErrors.counselling_date = "Required";
            if (!formData.course_name) newErrors.course_name = "Required";
            if (!formData.payment_date) newErrors.payment_date = "Required";
        }
        if (stepId === "KLM") {
            if (!formData.student_declaration) newErrors.student_declaration = "Compulsory";
            if (!formData.parent_declaration) newErrors.parent_declaration = "Compulsory";
            if (!formData.placement_ack) newErrors.placement_ack = "Compulsory";
            if (!formData.discipline_ack) newErrors.discipline_ack = "Compulsory";
            if (!formData.photo_consent) newErrors.photo_consent = "Compulsory";
            if (!formData.refund_policy_ack) newErrors.refund_policy_ack = "Compulsory";
            if (!formData.data_privacy_ack) newErrors.data_privacy_ack = "Compulsory";
            if (!formData.final_undertaking) newErrors.final_undertaking = "Compulsory";
            
            if (!formData.emergency_contact_name) newErrors.emergency_contact_name = "Required";
            if (!formData.emergency_contact_number) newErrors.emergency_contact_number = "Required";
            else if (!phoneRegex.test(formData.emergency_contact_number)) newErrors.emergency_contact_number = "Must be 10 digits";
            if (!formData.emergency_authorized) newErrors.emergency_authorized = "Authorization required";
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
        
        // Prepare FormData for file uploads
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null) {
                data.append(key, formData[key]);
            }
        });

        try {
            if (isEditing && editId) {
                 await axios.patch(`${API_BASE}/admissions/${editId}`, data, {
                    headers: { 
                        ...getAuthHeaders(),
                        'Content-Type': 'multipart/form-data' 
                    }
                });
            } else {
                await axios.post(`${API_BASE}/admissions`, data, {
                    headers: { 
                        ...getAuthHeaders(),
                        'Content-Type': 'multipart/form-data' 
                    }
                });
            }
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                window.location.reload();
            }, 3000);
        } catch (error: any) {
            console.error("Submission failed", error);
            alert(error.response?.data?.error || "Error submitting admission.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (steps[currentStep].id) {
            case "SEARCH":
                return (
                    <div className="space-y-6 flex flex-col items-center py-8">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-2">
                            <Search size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Start with Enquiry ID</h3>
                        <p className="text-slate-500 text-center max-w-sm">Enter the student's Enquiry ID to pull existing details and start the admission process.</p>
                        <div className="w-full max-w-md flex flex-col gap-4 mt-4 text-center">
                            <input
                                type="text"
                                placeholder="Enter Enquiry ID"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                className="w-full px-6 py-4 bg-white border border-slate-300 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 font-black text-xl text-center tracking-widest text-[#0b1f3a]"
                            />
                            {errors.enquiry_id && <span className="text-red-500 text-sm font-bold">{errors.enquiry_id}</span>}
                            <button
                                type="button"
                                onClick={handleSearch}
                                disabled={isSearching || !searchId}
                                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                            >
                                {isSearching ? "Searching..." : "Fetch Details"}
                            </button>
                        </div>
                    </div>
                );
            case "A":
                return (
                    <div className="space-y-6">
                        <InputField label="1. Full Name (As per Certificates)" name="full_name" value={formData.full_name} onChange={handleChange} error={errors.full_name} compulsory />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SelectField label="2. Gender" name="gender" value={formData.gender} options={["Male", "Female", "Other"]} onChange={handleChange} compulsory />
                            <InputField label="3. Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} compulsory />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="4. Age" name="age" type="number" value={formData.age} onChange={handleChange} compulsory />
                            <InputField label="5. Aadhaar Number" name="aadhaar_number" value={formData.aadhaar_number} onChange={handleChange} compulsory />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="6. Passport Number (If Available)" name="passport_number" value={formData.passport_number} onChange={handleChange} />
                            <InputField label="7. Passport Validity" name="passport_validity" type="date" value={formData.passport_validity} onChange={handleChange} />
                        </div>
                        <FileField label="8. Recent Passport Size Photo" name="photo_file" value={formData.photo_file || formData.photo_url} onChange={handleChange} error={errors.photo_file} compulsory />
                    </div>
                );
            case "BC":
                return (
                    <div className="space-y-6">
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm">
                             <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wider text-sm"><Smartphone className="text-blue-600" size={18} /> Contact Details</h4>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <InputField label="9. Mobile Number" name="mobile_number" value={formData.mobile_number} onChange={handleChange} error={errors.mobile_number} compulsory />
                                <InputField label="10. Alternate Mobile" name="alt_mobile_number" value={formData.alt_mobile_number} onChange={handleChange} />
                                <InputField label="11. WhatsApp Number" name="whatsapp_number" value={formData.whatsapp_number} onChange={handleChange} error={errors.whatsapp_number} compulsory />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
                                <InputField label="12. Email ID" name="email_id" type="email" value={formData.email_id} onChange={handleChange} error={errors.email_id} compulsory />
                            </div>
                            <div className="mt-4">
                                <TextAreaField label="13. Full Residential Address" name="residential_address" value={formData.residential_address} onChange={handleChange} error={errors.residential_address} compulsory />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                <InputField label="14. City / District" name="city" value={formData.city} onChange={handleChange} error={errors.city} compulsory />
                                <InputField label="15. State" name="state" value={formData.state} onChange={handleChange} error={errors.state} compulsory />
                                <InputField label="16. PIN Code" name="pin_code" value={formData.pin_code} onChange={handleChange} error={errors.pin_code} compulsory />
                             </div>
                        </div>
                        
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm">
                             <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wider text-sm"><Users className="text-blue-600" size={18} /> Parent / Guardian Details</h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="17. Parent / Guardian Name" name="parent_name" value={formData.parent_name} onChange={handleChange} error={errors.parent_name} compulsory />
                                <InputField label="18. Relationship" name="relationship" value={formData.relationship} onChange={handleChange} error={errors.relationship} compulsory />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <InputField label="19. Parent Mobile" name="parent_mobile" value={formData.parent_mobile} onChange={handleChange} error={errors.parent_mobile} compulsory />
                                <InputField label="20. Occupation" name="occupation" value={formData.occupation} onChange={handleChange} error={errors.occupation} compulsory />
                            </div>
                            <div className="mt-4">
                                <InputField label="21. Annual Family Income (Optional)" name="annual_income" value={formData.annual_income} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                );
            case "DE":
                return (
                    <div className="space-y-6">
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                             <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wider text-sm"><GraduationCap className="text-blue-600" size={18} /> Education Details</h4>
                             <SelectField label="22. Highest Qualification" name="highest_qualification" value={formData.highest_qualification} 
                                options={["", "School Dropout", "10th / 12th", "ITI / Diploma", "Degree / Engineering"]} onChange={handleChange} compulsory error={errors.highest_qualification} />
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <InputField label="23. Year of Passing" name="year_of_passing" value={formData.year_of_passing} onChange={handleChange} compulsory error={errors.year_of_passing} />
                                <InputField label="24. Institution Name" name="institution_name" value={formData.institution_name} onChange={handleChange} compulsory error={errors.institution_name} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <InputField label="25. Board / University" name="board_university" value={formData.board_university} onChange={handleChange} compulsory error={errors.board_university} />
                                <InputField label="26. Medium of Study" name="medium_of_study" value={formData.medium_of_study} onChange={handleChange} compulsory error={errors.medium_of_study} />
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                             <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wider text-sm"><Briefcase className="text-blue-600" size={18} /> Skill & Experience</h4>
                             <TextAreaField label="27. Technical Background (if any)" name="technical_background" value={formData.technical_background} onChange={handleChange} />
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <InputField label="28. Work Experience (e.g. 2 Years)" name="total_experience" value={formData.total_experience} onChange={handleChange} />
                                <InputField label="29. Industry Experience" name="industry_experience" value={formData.industry_experience} onChange={handleChange} />
                            </div>
                            <div className="mt-4">
                                <TextAreaField label="30. Skills Already Known" name="skills_known" value={formData.skills_known} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                );
            case "FG":
                return (
                    <div className="space-y-6">
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                             <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wider text-sm"><BookOpen className="text-blue-600" size={18} /> Course Selection</h4>
                             <InputField label="31. Course Interested In" name="course_interested" value={formData.course_interested} onChange={handleChange} compulsory error={errors.course_interested} />
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <SelectField label="32. Course Level" name="course_level" value={formData.course_level} options={["Basic", "Diploma", "Advanced", "International"]} onChange={handleChange} compulsory />
                                <SelectField label="33. Mode of Training" name="mode_of_training" value={formData.mode_of_training} options={["Classroom", "Practical", "Hybrid"]} onChange={handleChange} compulsory />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <InputField label="34. Batch Preference" name="batch_preference" value={formData.batch_preference} onChange={handleChange} />
                                <InputField label="35. Training Location" name="training_location" value={formData.training_location} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                             <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wider text-sm"><Target className="text-blue-600" size={18} /> Career Goal</h4>
                             <SelectField label="36. Career Goal" name="career_goal" value={formData.career_goal} options={["Job in India", "Overseas Job", "Self-Employment / Entrepreneurship"]} onChange={handleChange} compulsory />
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <InputField label="37. Preferred Country (if overseas)" name="preferred_country" value={formData.preferred_country} onChange={handleChange} />
                                <InputField label="38. Expected Salary Range" name="expected_salary" value={formData.expected_salary} onChange={handleChange} />
                            </div>
                            <div className="mt-4">
                                <SelectField label="39. Willing to Relocate?" name="willing_to_relocate" value={formData.willing_to_relocate} options={["Yes", "No"]} onChange={handleChange} compulsory />
                            </div>
                        </div>
                    </div>
                );
            case "IJ":
                return (
                    <div className="space-y-6">
                         <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                             <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wider text-sm"><Sparkles className="text-blue-600" size={18} /> Counsellor & Referral</h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="43. Career Counsellor Name" name="counsellor_name" value={formData.counsellor_name} onChange={handleChange} compulsory error={errors.counsellor_name} />
                                <InputField label="44. Counsellor Code / ID" name="counsellor_code" value={formData.counsellor_code} onChange={handleChange} compulsory error={errors.counsellor_code} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <SelectField label="45. Referral Source" name="referral_source" value={formData.referral_source} options={["Career Counsellor", "Walk-in", "Social Media", "Website"]} onChange={handleChange} compulsory />
                                <InputField label="46. Date of Counselling" name="counselling_date" type="date" value={formData.counselling_date} onChange={handleChange} compulsory error={errors.counselling_date} />
                            </div>
                        </div>

                        <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200">
                             <h4 className="font-black text-blue-900 mb-4 flex items-center gap-2 uppercase tracking-wider text-sm"><CreditCard className="text-blue-600" size={18} /> Course Fee & Payment</h4>
                             <InputField label="47. Course Name" name="course_name" value={formData.course_name} onChange={handleChange} compulsory error={errors.course_name} />
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                <InputField label="48. Course Fees" name="course_fees" type="number" value={formData.course_fees} onChange={handleChange} />
                                <InputField label="49. Total Fees" name="total_fees" type="number" value={formData.total_fees} onChange={handleChange} />
                                <InputField label="50. Paid Fees" name="paid_fees" type="number" value={formData.paid_fees} onChange={handleChange} />
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <SelectField label="51. Payment Mode" name="payment_mode" value={formData.payment_mode} options={["Cash", "UPI", "Bank Transfer"]} onChange={handleChange} compulsory />
                                <InputField label="52. Payment Reference No." name="payment_ref_no" value={formData.payment_ref_no} onChange={handleChange} />
                             </div>
                             <div className="mt-4">
                                <InputField label="53. Payment Date" name="payment_date" type="date" value={formData.payment_date} onChange={handleChange} compulsory error={errors.payment_date} />
                             </div>
                             
                             <div className="mt-6 pt-6 border-t border-blue-200">
                                <h5 className="font-bold text-blue-800 mb-3 text-xs uppercase tracking-widest">Instalments</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField label="54. Instalment-1" name="instalment_1" type="number" value={formData.instalment_1} onChange={handleChange} />
                                    <InputField label="55. Instalment-2" name="instalment_2" type="number" value={formData.instalment_2} onChange={handleChange} />
                                </div>
                                 <div className="mt-4 p-4 bg-[#0b1f3a] rounded-xl flex justify-between items-center shadow-lg shadow-blue-200/50">
                                    <span className="text-blue-200 font-bold uppercase text-xs tracking-widest">56. Balance Payable Amount</span>
                                    {can("Associate Management", "edit") ? (
                                        <input 
                                            name="balance_amount" 
                                            value={formData.balance_amount} 
                                            onChange={handleChange} 
                                            className="bg-white/10 text-white text-2xl font-black w-32 outline-none text-right border-b border-white/20"
                                        />
                                    ) : (
                                        <span className="text-white text-2xl font-black">₹ {formData.balance_amount}</span>
                                    )}
                                </div>
                                <p className="text-[10px] text-blue-600 font-bold mt-2 flex items-center gap-1"><AlertTriangle size={12} /> Auto-points (10%) will be added once balance is 0.</p>
                             </div>
                        </div>
                    </div>
                );
            case "KLM":
                return (
                    <div className="space-y-6">
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                             <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wider text-sm"><FileText className="text-blue-600" size={18} /> K. Documents Checklist (Attach Copies)</h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FileField label="Aadhaar Card" name="has_aadhaar_file" value={formData.has_aadhaar_file} onChange={handleChange} />
                                <FileField label="Educational Certificates" name="has_edu_certs_file" value={formData.has_edu_certs_file} onChange={handleChange} />
                                <FileField label="Passport (If Available)" name="has_passport_file" value={formData.has_passport_file} onChange={handleChange} />
                                <FileField label="Resume / Bio-data" name="has_resume_file" value={formData.has_resume_file} onChange={handleChange} />
                                <FileField label="Address Proof" name="has_address_proof_file" value={formData.has_address_proof_file} onChange={handleChange} />
                                <FileField label="Passport Size Photos" name="has_photos_file" value={formData.has_photos_file} onChange={handleChange} />
                             </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs flex items-center gap-2"><ShieldCheck className="text-blue-600" size={16} /> Declarations & Acknowledgements</h4>
                            
                            <div className="space-y-3">
                                <CheckboxField label="L. Student Declaration (Rules & Discipline)" name="student_declaration" checked={formData.student_declaration} onChange={handleChange} compulsory error={errors.student_declaration} />
                                <CheckboxField label="M. Parent / Guardian Declaration (Consent)" name="parent_declaration" checked={formData.parent_declaration} onChange={handleChange} compulsory error={errors.parent_declaration} />
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex flex-col gap-2">
                                    <p className="text-[11px] font-bold text-blue-800 leading-tight">Placement Assistance: Performance dependent. Overseas subject to Visa/Medical.</p>
                                    <CheckboxField label="Placement Assistance Acknowledgement" name="placement_ack" checked={formData.placement_ack} onChange={handleChange} compulsory error={errors.placement_ack} />
                                </div>
                                {formData.career_goal === "Overseas Job" && (
                                    <CheckboxField label="Overseas Placement Disclaimer" name="overseas_disclaimer" checked={formData.overseas_disclaimer} onChange={handleChange} />
                                )}
                                <CheckboxField label="Discipline & Code of Conduct" name="discipline_ack" checked={formData.discipline_ack} onChange={handleChange} compulsory error={errors.discipline_ack} />
                                <CheckboxField label="Photography / Video Consent" name="photo_consent" checked={formData.photo_consent} onChange={handleChange} compulsory error={errors.photo_consent} />
                                <CheckboxField label="Fee Refund & Cancellation Policy" name="refund_policy_ack" checked={formData.refund_policy_ack} onChange={handleChange} compulsory error={errors.refund_policy_ack} />
                                <CheckboxField label="Data Privacy & Confidentiality" name="data_privacy_ack" checked={formData.data_privacy_ack} onChange={handleChange} compulsory error={errors.data_privacy_ack} />
                            </div>

                            <div className="p-6 bg-red-50 rounded-2xl border border-red-100 space-y-4">
                                <h5 className="font-black text-red-900 text-[10px] uppercase tracking-widest">9. Emergency Contact</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField label="Contact Name" name="emergency_contact_name" value={formData.emergency_contact_name} onChange={handleChange} compulsory error={errors.emergency_contact_name} />
                                    <InputField label="Contact Number" name="emergency_contact_number" value={formData.emergency_contact_number} onChange={handleChange} compulsory error={errors.emergency_contact_number} />
                                </div>
                                <CheckboxField label="Authorize NTSC for Emergency Contact" name="emergency_authorized" checked={formData.emergency_authorized} onChange={handleChange} compulsory error={errors.emergency_authorized} />
                            </div>

                            <div className="p-6 bg-[#0b1f3a] rounded-2xl border border-white/10 shadow-2xl">
                                <h5 className="font-black text-blue-200 text-[10px] uppercase tracking-widest mb-4">10. Student Undertaking (Final Acceptance)</h5>
                                <CheckboxField label="I confirm that I have read all terms & conditions and voluntarily join NTSC Skill Centre." name="final_undertaking" checked={formData.final_undertaking} onChange={handleChange} compulsory error={errors.final_undertaking} dark />
                            </div>
                        </div>
                    </div>
                );
            case "N":
                return (
                    <div className="space-y-6">
                        <div className="p-10 border-4 border-dashed border-slate-200 rounded-[3rem] bg-slate-50 flex flex-col items-center text-center">
                            <h4 className="font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-widest text-lg"><PlusCircle className="text-blue-600" size={24} /> Office Use Only</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
                                <InputField label="Admission Number" name="admission_number" value={formData.admission_number} onChange={handleChange} placeholder="________" />
                                <InputField label="Batch Allotted" name="batch_allotted" value={formData.batch_allotted} onChange={handleChange} placeholder="________" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl mt-8">
                                <InputField label="Verified By" name="verified_by" value={formData.verified_by} onChange={handleChange} placeholder="Counsellor Name" />
                                <InputField label="Authorized Signature" name="authorized_signature_by" value={formData.authorized_signature_by} onChange={handleChange} placeholder="Signatory" />
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const renderListContent = () => (
        <div className="p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><List size={24} /> Recent Admissions</h3>
            {isLoadingList ? (
                <div className="flex flex-col items-center py-12 gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="font-bold text-slate-400">Loading admissions...</p>
                </div>
            ) : admissions.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-slate-400">
                    <Database size={48} className="mb-4 opacity-20" />
                    <p className="font-bold uppercase tracking-widest text-sm text-center">No admissions found in your record.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-slate-200">
                                <th className="py-4 px-4 font-black text-slate-900 uppercase text-xs tracking-wider">Admission ID</th>
                                <th className="py-4 px-4 font-black text-slate-900 uppercase text-xs tracking-wider">Student Name</th>
                                <th className="py-4 px-4 font-black text-slate-900 uppercase text-xs tracking-wider">Course</th>
                                <th className="py-4 px-4 font-black text-slate-900 uppercase text-xs tracking-wider text-right">Balance</th>
                                <th className="py-4 px-4 font-black text-slate-900 uppercase text-xs tracking-wider text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admissions.map((adm) => (
                                <tr key={adm.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="py-5 px-4 font-mono text-blue-700 font-black">{adm.admission_number || adm.enquiry_id}</td>
                                    <td className="py-5 px-4 font-black text-slate-900">{adm.full_name || adm.student_name}</td>
                                    <td className="py-5 px-4 text-slate-700 font-bold">{adm.course_name || adm.course_interested}</td>
                                    <td className="py-5 px-4 text-right">
                                        <span className={`font-black ${parseFloat(adm.balance_amount) === 0 ? 'text-green-600' : 'text-red-500'}`}>
                                            ₹ {adm.balance_amount || '0'}
                                        </span>
                                    </td>
                                     <td className="py-5 px-4 text-center">
                                        <div className="flex gap-2 justify-center">
                                            <button 
                                                onClick={() => setSelectedAdmission(adm)}
                                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            {can("Associate Management", "edit") && user?.role !== "Associate" && (
                                                <button 
                                                    onClick={() => handleEdit(adm)}
                                                    className="p-2 bg-amber-100 text-amber-600 rounded-lg hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                                                    title="Edit Admission"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                            )}
                                            {can("Associate Management", "delete") && user?.role !== "Associate" && (
                                                <button 
                                                    onClick={() => handleDelete(adm)}
                                                    className="p-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                    title="Delete Admission"
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
                </div>
            )}
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto pb-12">
            {/* Header / Toggle */}
            <div className="flex justify-between items-center mb-8 px-4">
                <div className="flex bg-slate-100 p-1 rounded-2xl">
                    <button 
                        onClick={() => { setViewMode("form"); setFormData({ ...formData, enquiry_id: "" }); setCurrentStep(0); setIsEditing(false); setEditId(null); }}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${viewMode === "form" ? 'bg-[#0b1f3a] text-white shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        <PlusCircle size={18} /> New Admission
                    </button>
                    <button 
                        onClick={() => setViewMode("list")}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${viewMode === "list" ? 'bg-[#0b1f3a] text-white shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        <List size={18} /> View List
                    </button>
                </div>
            </div>

            {viewMode === "form" ? (
                <>
                    {/* Steps Progress */}
                    <div className="mb-10 px-4 overflow-x-auto">
                        <div className="flex justify-between items-center min-w-[700px] relative">
                            <div className="absolute top-5 left-0 w-full h-[2px] bg-slate-200 z-0" />
                            {steps.map((step, idx) => {
                                const Icon = step.icon;
                                const isActive = idx === currentStep;
                                const isCompleted = idx < currentStep;
                                return (
                                    <div key={step.id} className="relative z-10 flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isActive ? 'bg-blue-600 border-blue-600 text-white shadow-xl scale-110' :
                                                isCompleted ? 'bg-green-500 border-green-500 text-white' :
                                                    'bg-white border-slate-300 text-slate-300'
                                            }`}>
                                            {isCompleted ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                                        </div>
                                        <span className={`text-[9px] font-black uppercase mt-2 tracking-widest ${isActive ? 'text-blue-600' : 'text-slate-400 opacity-50'}`}>Step {idx + 1}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                        <div className="bg-[#0b1f3a] px-8 py-10 text-white flex justify-between items-center relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                                    <Award className="text-blue-400" /> {isEditing ? "Edit Admission" : "Student Admission"}
                                </h2>
                                <p className="text-blue-300 font-bold mt-1 uppercase text-xs tracking-[0.2em]">{isEditing ? "Update details for " + formData.full_name : steps[currentStep].title}</p>
                            </div>
                            {formData.enquiry_id && (
                                <div className="bg-white/10 px-6 py-3 rounded-3xl border border-white/20 backdrop-blur-md relative z-10">
                                    <span className="text-[10px] font-black text-blue-200 block uppercase tracking-widest mb-1">Reference ID</span>
                                    <span className="font-mono font-black text-lg">{formData.enquiry_id}</span>
                                </div>
                            )}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl z-0" />
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 md:p-12">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {renderStepContent()}
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation */}
                            <div className="mt-12 flex justify-between items-center pt-8 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    disabled={currentStep === 0}
                                    className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[11px] text-slate-500 hover:bg-slate-50 disabled:opacity-0 transition-all border border-slate-200"
                                >
                                    <ChevronLeft size={16} /> Back
                                </button>

                                <div className="flex gap-4">
                                    {currentStep < steps.length - 1 ? (
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="flex items-center gap-2 px-10 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[11px] bg-[#0b1f3a] text-white hover:bg-blue-900 shadow-xl shadow-blue-900/10 transition-all"
                                        >
                                            Continue <ChevronRight size={16} />
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex items-center gap-2 px-12 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[11px] bg-green-600 text-white hover:bg-green-700 shadow-xl shadow-green-100 transition-all"
                                        >
                                            {isSubmitting ? "Finalizing..." : <>Confirm Admission <Send size={16} /></>}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </>
            ) : (
                <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                    {renderListContent()}
                </div>
            )}

            {/* Admission Details Modal */}
            <AnimatePresence>
                {selectedAdmission && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-6"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-5xl max-h-[90vh] overflow-y-auto relative custom-scrollbar shadow-2xl"
                        >
                            <button 
                                onClick={() => setSelectedAdmission(null)}
                                className="absolute top-8 right-8 p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all z-20"
                            >
                                <X size={28} />
                            </button>
                            
                            <div className="p-12">
                                {/* Hero Header */}
                                <div className="flex flex-col md:flex-row items-center gap-8 mb-12 pb-12 border-b border-slate-100">
                                    <div className="w-28 h-28 bg-[#0b1f3a] rounded-[2rem] flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-blue-900/20">
                                        {(selectedAdmission.full_name || selectedAdmission.student_name || "?")[0].toUpperCase()}
                                    </div>
                                    <div className="text-center md:text-left">
                                        <h3 className="text-4xl font-black text-slate-800 tracking-tight">{selectedAdmission.full_name || selectedAdmission.student_name}</h3>
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3">
                                            <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[11px] font-black uppercase tracking-[0.15em] border border-blue-100">
                                                Admission ID: #{selectedAdmission.admission_number || selectedAdmission.enquiry_id}
                                            </span>
                                            <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.15em] border ${parseFloat(selectedAdmission.balance_amount) === 0 ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                                {parseFloat(selectedAdmission.balance_amount) === 0 ? 'Fully Paid' : `Balance: ₹${selectedAdmission.balance_amount}`}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-16">
                                    {/* Section A: Personal Information */}
                                    <section>
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-blue-600 mb-8">
                                            <span className="w-2 h-2 rounded-full bg-blue-600"></span> 1. Personal & Identification
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                                            <DetailRow label="Gender" value={selectedAdmission.gender} />
                                            <DetailRow label="Date of Birth" value={selectedAdmission.dob ? new Date(selectedAdmission.dob).toLocaleDateString() : 'N/A'} />
                                            <DetailRow label="Age" value={selectedAdmission.age} />
                                            <DetailRow label="Aadhaar No." value={selectedAdmission.aadhaar_number} />
                                            <DetailRow label="Passport No." value={selectedAdmission.passport_number || "None"} />
                                            <DetailRow label="Passport Val." value={selectedAdmission.passport_validity ? new Date(selectedAdmission.passport_validity).toLocaleDateString() : "N/A"} />
                                        </div>
                                    </section>

                                    {/* Section B & C: Contact & Guardian */}
                                    <section>
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-blue-600 mb-8">
                                            <span className="w-2 h-2 rounded-full bg-blue-600"></span> 2. Contact & Guardian Details
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                                            <DetailRow label="Mobile" value={selectedAdmission.mobile_number} fontMono />
                                            <DetailRow label="WhatsApp" value={selectedAdmission.whatsapp_number} fontMono />
                                            <DetailRow label="Email" value={selectedAdmission.email_id} />
                                            <DetailRow label="City" value={selectedAdmission.city} />
                                            <div className="md:col-span-2 lg:col-span-2">
                                                <DetailRow label="Full Address" value={`${selectedAdmission.residential_address}, ${selectedAdmission.state} - ${selectedAdmission.pin_code}`} />
                                            </div>
                                            <DetailRow label="Guardian" value={selectedAdmission.parent_name} />
                                            <DetailRow label="Relation" value={selectedAdmission.relationship} />
                                            <DetailRow label="Guardian Mob." value={selectedAdmission.parent_mobile} fontMono />
                                            <DetailRow label="Occupation" value={selectedAdmission.occupation} />
                                        </div>
                                    </section>

                                    {/* Section D & E: Education & Experience */}
                                    <section>
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-blue-600 mb-8">
                                            <span className="w-2 h-2 rounded-full bg-blue-600"></span> 3. Education & Skills
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                            <DetailRow label="Qualification" value={selectedAdmission.highest_qualification} />
                                            <DetailRow label="Passing Year" value={selectedAdmission.year_of_passing} />
                                            <DetailRow label="Institution" value={selectedAdmission.institution_name} />
                                            <DetailRow label="Board/Univ." value={selectedAdmission.board_university} />
                                            <DetailRow label="Medium" value={selectedAdmission.medium_of_study} />
                                            <DetailRow label="Experience" value={selectedAdmission.total_experience || "Fresher"} />
                                        </div>
                                        <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                            <DetailRow label="Technical Background" value={selectedAdmission.technical_background || "Not specified"} />
                                        </div>
                                    </section>

                                    {/* Section F & G: Course & Career */}
                                    <section>
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-blue-600 mb-8">
                                            <span className="w-2 h-2 rounded-full bg-blue-600"></span> 4. Course & Career Goals
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                                                <DetailRow label="Selected Course" value={selectedAdmission.course_interested} bold />
                                            </div>
                                            <DetailRow label="Level" value={selectedAdmission.course_level} />
                                            <DetailRow label="Mode" value={selectedAdmission.mode_of_training} />
                                            <DetailRow label="Career Goal" value={selectedAdmission.career_goal} />
                                            <DetailRow label="Willing to Relocate?" value={selectedAdmission.willing_to_relocate} />
                                            <DetailRow label="Expected Salary" value={selectedAdmission.expected_salary || "N/A"} />
                                        </div>
                                    </section>

                                    {/* Section I & J: Financials */}
                                    <section className="p-10 bg-[#0b1f3a] rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-blue-300 mb-8 relative z-10">
                                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span> 5. Fee & Payment Details
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
                                            <DetailRow label="Total Fees" value={`₹ ${parseFloat(selectedAdmission.total_fees || 0).toLocaleString()}`} light />
                                            <DetailRow label="Paid Amount" value={`₹ ${parseFloat(selectedAdmission.paid_fees || 0).toLocaleString()}`} color="text-green-400" />
                                            <DetailRow label="Balance" value={`₹ ${parseFloat(selectedAdmission.balance_amount || 0).toLocaleString()}`} color="text-red-400" bold />
                                            <DetailRow label="Payment Mode" value={selectedAdmission.payment_mode} light />
                                            <DetailRow label="Reference No." value={selectedAdmission.payment_ref_no || "N/A"} light />
                                            <DetailRow label="Payment Date" value={selectedAdmission.payment_date ? new Date(selectedAdmission.payment_date).toLocaleDateString() : "N/A"} light />
                                        </div>
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
                                    </section>

                                    {/* Emergency */}
                                    <section className="p-8 bg-red-50 rounded-2xl border border-red-100">
                                        <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-red-600 mb-6">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span> Emergency Contact
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-red-900">
                                            <DetailRow label="Contact Name" value={selectedAdmission.emergency_contact_name} color="text-red-800" />
                                            <DetailRow label="Contact Number" value={selectedAdmission.emergency_contact_number} color="text-red-800" fontMono />
                                            <DetailRow label="Authorized" value={selectedAdmission.emergency_authorized ? "Yes" : "No"} color="text-red-800" />
                                        </div>
                                    </section>
                                </div>

                                <div className="mt-16 pt-8 border-t border-slate-100 flex gap-4">
                                    <button 
                                        onClick={() => setSelectedAdmission(null)}
                                        className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-slate-200 transition-all"
                                    >
                                        Close Details
                                    </button>
                                    <button 
                                        onClick={() => {
                                            handleEdit(selectedAdmission);
                                            setSelectedAdmission(null);
                                        }}
                                        className="flex-1 py-5 bg-[#0b1f3a] text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/10"
                                    >
                                        Edit Full Record
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Success Overlay */}
            <AnimatePresence>
                {isSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-[#0b1f3a]/90 backdrop-blur-xl flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-[3.5rem] p-16 max-w-sm w-full text-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]"
                        >
                            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                                <CheckCircle2 size={56} />
                            </div>
                            <h3 className="text-3xl font-black text-slate-800 tracking-tight">Admission Confirmed!</h3>
                            <p className="text-slate-500 font-bold mt-4 uppercase text-[10px] tracking-widest">Points will be added to your account after full payment.</p>
                            <button onClick={() => setIsSuccess(false)} className="mt-10 w-full py-5 bg-[#0b1f3a] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-transform hover:scale-105">Close</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Helper Detail Row
const DetailRow = ({ label, value, color = "text-slate-700", bold = false, fontMono = false, light = false }: any) => (
    <div className={`flex flex-col gap-1.5 ${light ? 'border-none' : 'border-b border-slate-100'} pb-3`}>
        <span className={`text-[10px] font-black uppercase tracking-widest ${light ? 'text-blue-300/80' : 'text-slate-400'}`}>{label}</span>
        <span className={`text-[13px] ${bold ? 'font-black tracking-tighter text-lg' : 'font-bold'} ${fontMono ? 'font-mono' : ''} ${color} ${light && color === "text-slate-700" ? 'text-white' : ''}`}>
            {value || "---"}
        </span>
    </div>
);

// Helper Fields
const InputField = ({ label, name, value, onChange, type = "text", placeholder = "", error = "", compulsory = false }: any) => (
    <div className="flex flex-col gap-1.5 flex-1 w-full">
        <label className="text-[12px] font-black text-slate-700 uppercase tracking-[0.1em] ml-1 flex items-center gap-1">
            {label} {compulsory && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
            className={`w-full px-5 py-4 bg-slate-50 border ${error ? 'border-red-500 focus:ring-red-500/10' : 'border-slate-300 focus:ring-blue-100 focus:border-blue-500'} rounded-2xl outline-none focus:ring-4 transition-all text-slate-900 font-black tracking-wide placeholder:text-slate-300`}
        />
        {error && <span className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-1">{error}</span>}
    </div>
);

const SelectField = ({ label, name, value, options, onChange, error = "", compulsory = false }: any) => (
    <div className="flex flex-col gap-1.5 flex-1 w-full">
        <label className="text-[12px] font-black text-slate-700 uppercase tracking-[0.1em] ml-1 flex items-center gap-1">
            {label} {compulsory && <span className="text-red-500">*</span>}
        </label>
        <select
            name={name} value={value} onChange={onChange}
            className={`w-full px-5 py-4 bg-slate-50 border ${error ? 'border-red-500' : 'border-slate-300'} rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-black text-slate-900 tracking-wide`}
        >
            {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
        </select>
        {error && <span className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-1">{error}</span>}
    </div>
);

const TextAreaField = ({ label, name, value, onChange, error = "", compulsory = false }: any) => (
    <div className="flex flex-col gap-1.5 w-full">
        <label className="text-[12px] font-black text-slate-700 uppercase tracking-[0.1em] ml-1 flex items-center gap-1">
            {label} {compulsory && <span className="text-red-500">*</span>}
        </label>
        <textarea
            name={name} value={value} onChange={onChange} rows={3}
            className={`w-full p-5 bg-slate-50 border ${error ? 'border-red-500' : 'border-slate-300'} rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-black text-slate-900 tracking-wide placeholder:text-slate-300`}
        />
        {error && <span className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-1">{error}</span>}
    </div>
);

const CheckboxField = ({ label, name, checked, onChange, error = "", compulsory = false, dark = false }: any) => (
    <label className={`flex items-start gap-4 p-4 border transition-all cursor-pointer group w-full rounded-2xl shadow-sm ${dark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-blue-300'}`}>
        <input type="checkbox" name={name} checked={checked} onChange={onChange} className="mt-1 w-5 h-5 rounded-lg text-blue-600 focus:ring-blue-500 border-slate-400 transition-all cursor-pointer" />
        <div className="flex flex-col">
            <span className={`text-[11px] uppercase tracking-widest font-black leading-tight ${error ? 'text-red-600' : dark ? 'text-blue-100' : 'text-slate-700'} group-hover:text-blue-600 transition-colors`}>
                {label} {compulsory && <span className="text-red-500">*</span>}
            </span>
            {error && <span className="text-[9px] text-red-500 font-black uppercase mt-1 tracking-widest">{error}</span>}
        </div>
    </label>
);

const FileField = ({ label, name, value, onChange, error = "", compulsory = false }: any) => (
    <div className="flex flex-col gap-1.5 w-full">
        <label className="text-[12px] font-black text-slate-700 uppercase tracking-[0.1em] ml-1 flex items-center gap-1">
            {label} {compulsory && <span className="text-red-500">*</span>}
        </label>
        <div className={`relative flex items-center p-1 px-4 bg-slate-100 border-2 border-dashed ${error ? 'border-red-500 bg-red-50' : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50'} rounded-2xl transition-all h-16`}>
            <input 
                type="file" name={name} onChange={onChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="flex items-center gap-3 text-slate-400 group-hover:text-blue-600">
                <Upload size={20} className={error ? "text-red-400" : "text-blue-400"} />
                <span className={`text-xs font-black uppercase tracking-wider ${error ? "text-red-600" : "text-slate-600"}`}>
                    {value ? (typeof value === 'string' ? value.split('/').pop() : value.name) : "Choose File"}
                </span>
            </div>
        </div>
        {error && <span className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-1">{error}</span>}
    </div>
);
