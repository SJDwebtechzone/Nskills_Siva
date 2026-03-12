"use client";

import { courses } from "@/data/courses";
import { motion } from "framer-motion";
import { 
    Clock, 
    GraduationCap, 
    ChevronRight, 
    ArrowRight,
    Award,
    Zap,
    Users
} from "lucide-react";
import Link from "next/link";

export default function CoursesPage() {
    // Group courses by category
    const categories = Array.from(new Set(courses.map((c: any) => c.category)));

    return (
        <div className="min-h-screen bg-[#f8fafc] pt-32 pb-24">
            <div className="container mx-auto px-6">
                
                {/* Header */}
                <div className="max-w-3xl mb-16">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 mb-6"
                    >
                        <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
                        <span className="text-blue-600 font-black text-xs uppercase tracking-[0.3em]">Skill Training Programs</span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl font-black text-slate-900 leading-tight mb-8 tracking-tight"
                    >
                        Master New Skills <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Shape Your Future</span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-lg font-medium leading-relaxed"
                    >
                        Industry-recognized certifications with 100% hands-on practical training in state-of-the-art labs.
                    </motion.p>
                </div>

                {/* Categories & Courses */}
                <div className="space-y-24">
                    {categories.map((category: any, catIndex: number) => (
                        <div key={category} className="space-y-10">
                            <div className="flex items-center justify-between">
                                <h2 className="text-3xl font-black text-slate-800 tracking-tight">{category} Courses</h2>
                                <div className="h-px flex-1 bg-slate-200 mx-8 hidden md:block"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {courses.filter((c: any) => c.category === category).map((course: any, index: number) => (
                                    <motion.div
                                        key={course.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group bg-white rounded-[32px] border border-slate-100 p-8 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] transition-all duration-500 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors"></div>
                                        
                                        <div className="relative z-10 h-full flex flex-col">
                                            <div className="flex justify-between items-start mb-8">
                                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                                                    <Zap className="w-6 h-6" />
                                                </div>
                                                <div className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                    {course.duration}
                                                </div>
                                            </div>

                                            <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                                                {course.title}
                                            </h3>

                                            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 line-clamp-3">
                                                {course.content[0].substring(0, 150).replace(/[#-]/g, '').trim()}...
                                            </p>

                                            <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Award className="w-4 h-4 text-amber-500" />
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Certifed Program</span>
                                                </div>
                                                <Link 
                                                    href={`/courses/${course.id}`}
                                                    className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:translate-x-1"
                                                >
                                                    <ArrowRight className="w-5 h-5" />
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mt-32 bg-white border border-slate-100 p-12 md:p-20 rounded-[48px] shadow-2xl shadow-blue-900/5 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">Ready to Start Your Training?</h2>
                            <p className="text-slate-500 text-lg font-medium leading-relaxed">
                                Join over 5,000+ students who have transformed their careers with NSkill India's technical training programs.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-6 lg:justify-end">
                            <Link href="/contact" className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 text-center transition-all active:scale-95">
                                ENROLL NOW
                            </Link>
                            <Link href="/login" className="px-10 py-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-2xl text-center transition-all active:scale-95">
                                STUDENT LOGIN
                            </Link>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
