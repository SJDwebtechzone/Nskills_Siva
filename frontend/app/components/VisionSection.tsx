"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Eye, Target, Heart, ChevronRight } from "lucide-react";

const tabs = [
    {
        id: "vision",
        icon: Eye,
        title: "VISION",
        content: [
            "Align industry demand and workforce productivity with trainees' aspirations for sustainable livelihoods.",
            "Build capacity for skill development in critical un-organised sectors.",
            "Ensure sufficient, high-quality options for long-term skilling, benchmarked to internationally acceptable qualification standards.",
            "Support weaker and disadvantaged sections of society through focused outreach programmes.",
        ],
    },
    {
        id: "mission",
        icon: Target,
        title: "MISSION",
        content: [
            "NTSC will be a leader in social impact by preparing youth and companies to rapidly scale up skill development efforts, creating an end-to-end, outcome-focused implementation framework.",
        ],
    },
    {
        id: "values",
        icon: Heart,
        title: "CORE VALUES",
        content: [
            "A commitment to continuous quality improvement",
            "Evaluations and innovations which are data driven",
            "Customer focus — participants, employers, and grantors",
            "Acknowledge the importance of teamwork and partnerships",
        ],
    },
];

const VisionSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [activeTab, setActiveTab] = useState("vision");

    const active = tabs.find((t) => t.id === activeTab)!;

    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden" ref={ref}>
            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-start">

                    {/* Image Side - STABLE */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-blue-600/5 rounded-[40px] blur-2xl" />
                        <div className="relative rounded-[32px] overflow-hidden border-8 border-white shadow-xl bg-white">
                            <img
                                src="/images/vision.jpg"
                                alt="Vision"
                                className="w-full h-auto object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f3a]/20 to-transparent" />
                        </div>
                        {/* Floating Badge - STABLE */}
                        <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 hidden md:block">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                                    <Target className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Our Focus</p>
                                    <p className="text-sm font-bold text-[#0b1f3a]">Excellence in Training</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Side - STABLE ALIGNMENT */}
                    <div className="flex flex-col">
                        {/* Tab Navigation - FIXED STABLE BUTTONS */}
                        <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-4 mb-8 shrink-0">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center justify-center gap-2 md:gap-3 px-4 md:px-8 py-3 md:py-4 rounded-xl font-black text-[10px] md:text-xs tracking-widest transition-all duration-200 whitespace-nowrap shadow-sm border flex-1 md:flex-initial ${activeTab === tab.id
                                        ? "bg-[#0b1f3a] text-white border-[#0b1f3a] shadow-lg shadow-blue-900/20"
                                        : "bg-white text-slate-400 border-slate-100 hover:bg-slate-50 hover:text-slate-600 uppercase"
                                        }`}
                                >
                                    <tab.icon className="w-3 h-3 md:w-4 md:h-4" />
                                    <span>{tab.title}</span>
                                </button>
                            ))}
                        </div>

                        <div className="min-h-[300px] bg-white/50 p-5 md:p-8 rounded-[24px] md:rounded-[32px] border border-slate-100/50 shadow-sm">
                            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                                <div className="w-10 md:w-12 h-1 bg-blue-600 rounded-full" />
                                <h3 className="text-xl md:text-3xl font-black text-[#0b1f3a] tracking-tight italic uppercase">{active.title}</h3>
                            </div>

                            <ul className="space-y-3 md:space-y-4">
                                {active.content.map((item, i) => (
                                    <li
                                        key={`${activeTab}-${i}`}
                                        className="flex items-start gap-3 md:gap-4 p-4 md:p-5 bg-white rounded-[20px] md:rounded-[24px] border border-slate-100 shadow-sm"
                                    >
                                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                            <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                                        </div>
                                        <span className="text-slate-600 leading-relaxed font-semibold text-xs md:text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default VisionSection;
