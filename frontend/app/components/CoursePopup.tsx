"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/settings`;

interface Popup {
    id: number;
    image_url: string;
    video_url: string;
    title: string;
    description: string;
    course_id: string;
    is_active: boolean;
    manual_override: boolean;
    placement: string;
}

export default function CoursePopup() {
    const [popup, setPopup] = useState<Popup | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        fetchActivePopup();
    }, []);

    const fetchActivePopup = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/popups`);
            // Prioritize manual override, then active status
            const active = res.data.find((p: Popup) => p.manual_override) || res.data.find((p: Popup) => p.is_active);
            if (active) {
                setPopup(active);
                // Show after 3 seconds
                setTimeout(() => setIsOpen(true), 3000);
            }
        } catch (err) {
            console.error("Failed to fetch popup", err);
        }
    };

    if (!isOpen || !popup) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative bg-white rounded-[2.5rem] overflow-hidden max-w-lg w-full shadow-2xl animate-scaleIn">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-2 text-white transition"
                >
                    <X size={24} />
                </button>

                <div className="relative h-64 bg-slate-900 border-b border-white/10">
                    {popup.video_url ? (
                        <video 
                            src={popup.video_url} 
                            className="w-full h-full object-cover" 
                            autoPlay 
                            loop 
                            muted 
                            playsInline 
                        />
                    ) : (
                        <img src={popup.image_url} alt={popup.title} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-2">{popup.placement || 'Featured'}</span>
                        <h2 className="text-3xl font-black mb-0 tracking-tight">{popup.title}</h2>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <p className="text-gray-600 font-medium leading-relaxed">{popup.description}</p>
                    <button
                        onClick={() => {
                            if (popup.course_id.startsWith('http')) {
                                window.open(popup.course_id, '_blank');
                            } else {
                                window.location.href = `/courses/${popup.course_id}`;
                            }
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95"
                    >
                        ENROLL NOW
                    </button>
                </div>
            </div>
        </div>
    );
}
