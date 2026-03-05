"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle2 } from "lucide-react";

const reasons = [
    "India's first technical school offering career course with state-of-art training facility",
    "Center and State Government approved certification",
    "Govt approved employment registered certificate",
    "100% practical & industrial oriented training",
    "100% placement guidance & Assurance",
    "Multinational experienced faculties",
    "Effective communication in English & Hindi",
    "Career guidance and motivation classes",
    "Online interactions with industrial experts",
    "Individual student practical training",
    "International valid certification",
];

const WhyUsSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="py-24 bg-white relative overflow-hidden" ref={ref}>
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none">
                <div className="absolute top-1/2 -right-24 w-96 h-96 bg-blue-50 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Content Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -60 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-1 bg-blue-600 rounded-full" />
                            <span className="text-blue-600 font-bold tracking-[0.3em] uppercase text-xs">The NTSC Advantage</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-[#0b1f3a] mb-6 tracking-tight uppercase">Why NTSC?</h2>
                        <div className="w-24 h-1.5 bg-blue-600 rounded-full mb-10" />

                        <div className="grid gap-4">
                            {reasons.map((reason, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ delay: i * 0.05, duration: 0.5 }}
                                    className="flex items-start gap-4 p-4 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all rounded-2xl border border-transparent hover:border-slate-100 group"
                                >
                                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-slate-600 font-semibold text-sm leading-relaxed group-hover:text-[#0b1f3a] transition-colors">{reason}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 60 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 bg-blue-600/5 rounded-[40px] blur-2xl" />
                        <div className="relative rounded-[32px] overflow-hidden border-8 border-white shadow-2xl">
                            <img
                                src="/images/why-us.jpg"
                                alt="Why NTSC"
                                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-1000"
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#0b1f3a]/20 to-transparent" />
                        </div>

                        {/* Feature Badge */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-6 -left-2 md:-bottom-8 md:-left-8 bg-white p-4 md:p-6 rounded-[24px] md:rounded-[32px] shadow-2xl border border-slate-100 flex items-center gap-3 md:gap-4"
                        >
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                                <span className="text-lg font-black italic">100%</span>
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Placement</p>
                                <p className="text-sm font-bold text-[#0b1f3a]">Assurance & Guidance</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default WhyUsSection;
