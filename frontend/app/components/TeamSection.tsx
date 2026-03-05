"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, Linkedin, Phone } from "lucide-react";

const team = [
    {
        name: "T.R. Sriram",
        role: "Director",
        image: "/images/team/sriram.jpg",
        email: "trsriram@nskillindia.com",
        linkedin: "https://linkedin.com",
        phone: "#",
        desc: "Electronics Engr, 32 years of experience, Consultant & Trainer for Strategic Management, LEAN, TPM, SCM, QMS, EMS, SMS",
    },
    {
        name: "V.P. Sivasankar",
        role: "Director",
        image: "/images/team/sivasankar.jpg",
        email: "sivasankar.vps@gmail.com",
        linkedin: "https://linkedin.com",
        phone: "#",
        desc: "Mechanical Engr, 15 years of experience, Consultant & Trainer for QMS, EMS, Safety, NDT & Energy Management",
    },
    {
        name: "S. Karthikeyan",
        role: "Director",
        image: "/images/team/karthikeyan.jpg",
        email: "karthik@career-tree.in",
        linkedin: "https://linkedin.com",
        phone: "#",
        desc: "Graduate in BusinessAdmn& PG in Social Work (PM&IR), 18 years of experience, HR Specialist & Certified Trainer in Competency Management and Balanced Score Card",
    },
];

const TeamSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden" ref={ref}>
            {/* Background Micro-details */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-[120px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/30 rounded-full blur-[120px] -ml-48 -mb-48" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-3xl md:text-4xl font-black text-[#0b1f3a] mb-6 tracking-tight uppercase">Our Team</h2>
                    <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full mb-8" />
                    <p className="text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        NTSC has a competent team of people from various specialities like Lean, Safety, Electrical, HVAC, HR management, soft skills, and more.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                    {team.map((member, i) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, y: 60 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: i * 0.2 }}
                            className="group text-center flex flex-col items-center"
                        >
                            {/* Profile Image with Ring Effect */}
                            <div className="relative mb-6 pt-4">
                                <div className="absolute inset-0 bg-blue-600/10 rounded-full scale-110 blur-md group-hover:scale-125 transition-transform duration-700" />
                                <div className="relative w-56 h-56 md:w-64 md:h-64 mx-auto rounded-full overflow-hidden border-8 border-white shadow-xl group-hover:shadow-2xl transition-all duration-500 bg-white">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                            </div>

                            {/* Social Connect Icons (NOW MOVED ABOVE THE NAME) */}
                            <div className="flex justify-center gap-4 mb-6">
                                <a
                                    href={`mailto:${member.email}`}
                                    className="w-11 h-11 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-[#0b1f3a] hover:text-white shadow-sm hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300 hover:-translate-y-1"
                                    title="Send Email"
                                >
                                    <Mail className="w-4.5 h-4.5" />
                                </a>
                                <a
                                    href={member.linkedin}
                                    target="_blank"
                                    className="w-11 h-11 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-[#0b1f3a] hover:text-white shadow-sm hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300 hover:-translate-y-1"
                                    title="LinkedIn"
                                >
                                    <Linkedin className="w-4.5 h-4.5" />
                                </a>
                                <a
                                    href={member.phone}
                                    className="w-11 h-11 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-[#0b1f3a] hover:text-white shadow-sm hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300 hover:-translate-y-1"
                                    title="Call"
                                >
                                    <Phone className="w-4.5 h-4.5" />
                                </a>
                            </div>

                            {/* Identity */}
                            <h3 className="text-2xl font-black text-[#0b1f3a] mb-1 tracking-tight">{member.name}</h3>
                            <p className="text-blue-600 font-bold uppercase text-xs tracking-widest mb-4 group-hover:tracking-[0.2em] transition-all duration-500">{member.role}</p>

                            <div className="h-px w-12 bg-slate-200 mb-4" />

                            <p className="text-slate-500 text-sm leading-relaxed px-4 group-hover:text-slate-700 transition-colors">
                                {member.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TeamSection;
