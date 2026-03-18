"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Save, MapPin, Phone, Mail, Globe, MessageSquare, Facebook, Twitter, Instagram, Linkedin, Loader2 } from "lucide-react";

const API_BASE = "http://localhost:5000/api";

export default function ContactSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        company_name: "",
        address: "",
        primary_phone: "",
        secondary_phone: "",
        whatsapp_number: "",
        email: "",
        map_embed_url: "",
        facebook_url: "",
        twitter_url: "",
        instagram_url: "",
        linkedin_url: ""
    });

    useEffect(() => {
        fetchContactInfo();
    }, []);

    const fetchContactInfo = async () => {
        try {
            const res = await axios.get(`${API_BASE}/settings/contact-info`);
            if (res.data) {
                setFormData(prev => ({ ...prev, ...res.data }));
            }
        } catch (err) {
            console.error("Failed to fetch contact info", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.post(`${API_BASE}/settings/contact-info`, formData);
            alert("Contact Information updated successfully!");
        } catch (err) {
            console.error("Update failed", err);
            alert("Failed to update contact info.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-black">Contact Information</h1>
                    <p className="text-black font-medium">Manage your office location, phone numbers, and social links</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-6">
                    <h2 className="text-xl font-bold text-black flex items-center gap-2 border-b pb-4">
                        <MapPin className="text-blue-600" size={20} /> Office & Location
                    </h2>
                    
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-black uppercase tracking-widest text-black ml-1">Company Name</label>
                            <input 
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleChange}
                                placeholder="e.g. N-Skill Training"
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-400 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-black transition-all outline-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-black uppercase tracking-widest text-black ml-1">Full Address</label>
                            <textarea 
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter office address"
                                rows={3}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-400 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-black transition-all outline-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-black uppercase tracking-widest text-black ml-1">Google Maps Embed URL</label>
                            <input 
                                name="map_embed_url"
                                value={formData.map_embed_url}
                                onChange={handleChange}
                                placeholder="https://www.google.com/maps/embed..."
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-400 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-black transition-all outline-none"
                            />
                            <p className="text-[10px] text-slate-400 mt-1 italic font-bold">Go to Google Maps → Share → Embed a map → Copy the 'src' attribute</p>
                        </div>
                    </div>
                </div>

                {/* Contact Channels */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-6">
                    <h2 className="text-xl font-bold text-black flex items-center gap-2 border-b pb-4">
                        <Phone className="text-green-600" size={20} /> Contact Channels
                    </h2>
                    
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase tracking-widest text-black ml-1">Primary Phone</label>
                                <input 
                                    name="primary_phone"
                                    value={formData.primary_phone}
                                    onChange={handleChange}
                                    placeholder="+91 - 988..."
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-400 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-black transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-black uppercase tracking-widest text-black ml-1">Secondary Phone</label>
                                <input 
                                    name="secondary_phone"
                                    value={formData.secondary_phone}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-400 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-black transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-black uppercase tracking-widest text-green-600 ml-1">WhatsApp Number</label>
                            <input 
                                name="whatsapp_number"
                                value={formData.whatsapp_number}
                                onChange={handleChange}
                                placeholder="10 digit number"
                                className="w-full px-6 py-4 bg-green-50/50 border border-slate-400 rounded-2xl focus:ring-2 focus:ring-green-500 font-bold text-black transition-all outline-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-black uppercase tracking-widest text-black ml-1">Public Email</label>
                            <input 
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-400 rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-black transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-6 md:col-span-2">
                    <h2 className="text-xl font-bold text-black flex items-center gap-2 border-b pb-4">
                        <Globe className="text-purple-600" size={20} /> Social Media Links
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-black uppercase tracking-widest text-black ml-1 flex items-center gap-2"><Facebook size={12}/> Facebook</label>
                            <input name="facebook_url" value={formData.facebook_url} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-400 rounded-xl focus:ring-2 focus:ring-blue-600 font-bold text-black outline-none transition-all"/>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-black uppercase tracking-widest text-black ml-1 flex items-center gap-2"><Twitter size={12}/> Twitter (X)</label>
                            <input name="twitter_url" value={formData.twitter_url} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-400 rounded-xl focus:ring-2 focus:ring-slate-900 font-bold text-black outline-none transition-all"/>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-black uppercase tracking-widest text-black ml-1 flex items-center gap-2"><Instagram size={12}/> Instagram</label>
                            <input name="instagram_url" value={formData.instagram_url} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-400 rounded-xl focus:ring-2 focus:ring-pink-500 font-bold text-black outline-none transition-all"/>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-black uppercase tracking-widest text-black ml-1 flex items-center gap-2"><Linkedin size={12}/> LinkedIn</label>
                            <input name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-400 rounded-xl focus:ring-2 focus:ring-blue-700 font-bold text-black outline-none transition-all"/>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 flex justify-end">
                    <button 
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-3 px-12 py-5 bg-[#0b1f3a] text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all shadow-xl hover:shadow-blue-200/50 active:scale-95 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
