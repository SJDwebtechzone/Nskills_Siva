"use client";

import { use, useState, useEffect } from "react";
import { courses } from "@/data/courses";
import { motion } from "framer-motion";
import { 
    Clock, 
    GraduationCap, 
    CheckCircle2, 
    ArrowRight, 
    BookOpen, 
    ShieldCheck,
    Video,
    ChevronRight,
    PlayCircle
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const course = courses.find((c: any) => c.id === id);

    if (!course) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 -left-64 w-[800px] h-[800px] bg-blue-600 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-0 -right-64 w-[600px] h-[600px] bg-indigo-600 rounded-full blur-[100px]"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl"
                    >
                        <div className="flex items-center gap-2 mb-6 text-blue-400 font-black text-[10px] uppercase tracking-[0.3em]">
                            <Link href="/" className="hover:text-white transition-colors">Home</Link>
                            <ChevronRight className="w-3 h-3" />
                            <span>{course.category} Courses</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-8 tracking-tight">
                            {course.title}
                        </h1>

                        <div className="flex flex-wrap gap-6 text-white/70">
                            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
                                <Clock className="w-5 h-5 text-blue-400" />
                                <span className="font-bold text-sm tracking-tight">{course.duration}</span>
                            </div>
                            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
                                <GraduationCap className="w-5 h-5 text-emerald-400" />
                                <span className="font-bold text-sm tracking-tight">{course.eligibility}</span>
                            </div>
                            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
                                <ShieldCheck className="w-5 h-5 text-amber-400" />
                                <span className="font-bold text-sm tracking-tight">Govt. Certified</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Course Content & Details */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        
                        {/* Left Content */}
                        <div className="lg:col-span-7 space-y-16">
                            
                            {/* Overview */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-1 bg-blue-600 rounded-full"></div>
                                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Course Curriculum</h2>
                                </div>
                                <div className="bg-slate-50 border border-slate-100 rounded-[32px] p-8 md:p-12">
                                    <div className="grid grid-cols-1 gap-4">
                                        {course.content[0].split('\n').filter((line: string) => line.trim().startsWith('-')).map((item: string, index: number) => (
                                            <div key={index} className="flex items-start gap-4 group">
                                                <div className="mt-1.5 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-colors">
                                                    <CheckCircle2 className="w-3 h-3 text-blue-600 group-hover:text-white" />
                                                </div>
                                                <p className="text-slate-600 font-medium leading-relaxed">
                                                    {item.replace('-', '').trim()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Videos Section (If available) */}
                            {course.videos && course.videos.length > 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="space-y-8"
                                >
                                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Interactive Learning</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {course.videos.map((video: any) => (
                                            <div key={video.id} className="group relative rounded-[2rem] overflow-hidden bg-slate-900 aspect-video shadow-2xl">
                                                <video 
                                                    src={video.url} 
                                                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
                                                    muted 
                                                    loop 
                                                    onMouseOver={(e) => e.currentTarget.play()}
                                                    onMouseOut={(e) => e.currentTarget.pause()}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                                            <PlayCircle className="w-5 h-5 text-white" />
                                                        </div>
                                                        <span className="text-white font-black uppercase text-[10px] tracking-widest">{video.type} session</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Right Sidebar */}
                        <div className="lg:col-span-5">
                            <div className="sticky top-32 space-y-8">
                                
                                {/* Admission Card */}
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-white border border-slate-100 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] rounded-[40px] p-10 overflow-hidden relative"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                                    
                                    <div className="relative z-10 space-y-8">
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Join Tomorrow's Batch</h3>
                                            <p className="text-slate-500 font-medium">Kickstart your technical career with industry-leading hands-on training.</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                                <span className="text-slate-500 text-sm font-bold">Certification</span>
                                                <span className="text-slate-800 text-sm font-black uppercase tracking-wider">NSDC Govt.</span>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                                <span className="text-slate-500 text-sm font-bold">Training Mode</span>
                                                <span className="text-slate-800 text-sm font-black uppercase tracking-wider">On-Site Lab</span>
                                            </div>
                                        </div>

                                        <Link 
                                            href="/contact"
                                            className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-black py-5 rounded-[20px] shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                        >
                                            Enquiry Now
                                            <ArrowRight className="w-5 h-5" />
                                        </Link>

                                        <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                            Limited Seats Available per batch
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Certification Info */}
                                <div className="bg-emerald-50/50 border border-emerald-100 p-8 rounded-[32px] flex gap-6 items-start">
                                    <div className="shrink-0 w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                        <ShieldCheck className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-black text-emerald-900 tracking-tight">Accredited Certification</h4>
                                        <p className="text-emerald-700/70 text-sm font-medium leading-relaxed">
                                            {course.certification}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
