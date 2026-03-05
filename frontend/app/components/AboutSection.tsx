"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, Briefcase, BarChart3, ShieldCheck } from "lucide-react";

const AboutSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    };

    return (
        <section id="about" className="py-24 bg-white overflow-hidden" ref={ref}>
            <div className="container mx-auto px-6 max-w-7xl">

                {/* Main Header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-3xl md:text-4xl font-black text-[#0b1f3a] mb-6 tracking-tight uppercase">About Us</h2>
                    <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full" />
                </motion.div>

                {/* NIILE & NTSC Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                            <ShieldCheck className="w-3.5 h-3.5" /> Established 2012
                        </div>
                        <p className="text-lg text-slate-700 leading-relaxed font-medium">
                            NIILE Solutions is established in 2012 in Kundrathur, Chennai to offer{" "}
                            <span className="text-blue-600 font-bold decoration-blue-600/30 underline decoration-2 underline-offset-4 tracking-tight">TECHNICAL SKILL TRAINING, PLACEMENT, and INDUSTRIAL CONSULTING</span>{" "}
                            services. NIILE serves world-renowned organizations from Hydrocarbon, Power, Steel, Cement and Heavy Infrastructure industries involved in Construction, Commissioning, Operation and Maintenance activities.
                        </p>
                        <p className="text-slate-600 leading-relaxed text-sm">
                            As a strategic expansion and aligning with the Skill India Mission, NIILE Solutions started <strong className="text-[#0b1f3a]">NIILE TECHNICAL SKILL AND CONSULTING PVT. LTD (NTSC)</strong> near Kundrathur, Chennai during the year 2018. The objective is to train unemployed youth, school and college finishers and dropouts in various skill-based trades, which help them to get employment within the domestic as well as overseas industries.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="bg-[#0b1f3a] p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-blue-500/20 transition-all duration-700" />
                        <div className="relative z-10 space-y-6">
                            <p className="text-blue-100/90 leading-relaxed text-sm">
                                NTSC training focuses on various Skills like MEP, HVAC, A/C, Welding, Fabrication, Machine Operation, Electrical Wiring, Installation, Marine Mechanic, and Civil construction skills such as Carpentry, Masonry, Plumbing, Bar-Bending, and a host of other trades for different industrial sectors. Also, NTSC offers customized courses for corporates on Behavioural, Leadership and Technical skills.
                            </p>
                            <div className="h-px bg-white/10" />
                            <p className="text-blue-100/90 leading-relaxed text-sm italic">
                                NTSC's facility complies with NSDC requirements. NTSC is accredited by various State and Central Government accreditation bodies like <span className="text-white font-bold">NSDC, KVIC, BSS, MSME, NIESBUD, OGSC, TNDS</span> etc. The certification issued by these institutions help students in availing opportunities for job and entrepreneurship.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Feature Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {/* Skill Training */}
                    <motion.div id="skill-training" variants={itemVariants} className="group flex flex-col bg-slate-50 rounded-[32px] border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 overflow-hidden">
                        <div className="h-56 overflow-hidden relative bg-white flex items-center justify-center p-2">
                            <img
                                src="/images/about/skill-training.jpg"
                                alt="Skill Training"
                                className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute top-4 left-4 w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                                <GraduationCap className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="p-8 space-y-4">
                            <h3 className="text-xl font-black text-[#0b1f3a] uppercase tracking-tight">Skill Training</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Skill development has been considered one of the critical aspects for job creation in India. India has unique demographic advantage with more than 60% of the population is in young age group. But to get dividend from such large work force, employability must be improved. As per current statistics only 10% of the fresh graduates are employable and rest of the 90% lack skills required for eligible to be hired by corporate. Here at NTSC, we provide the required skill training for you to achieve the required professional skillset for any domain.
                            </p>
                        </div>
                    </motion.div>

                    {/* Corporate Training */}
                    <motion.div id="corporate-training" variants={itemVariants} className="group flex flex-col bg-slate-50 rounded-[32px] border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 overflow-hidden">
                        <div className="h-56 overflow-hidden relative bg-white flex items-center justify-center p-2">
                            <img
                                src="/images/about/corporate-training.jpg"
                                alt="Corporate Training"
                                className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute top-4 left-4 w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                                <Briefcase className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="p-8 space-y-4">
                            <h3 className="text-xl font-black text-[#0b1f3a] uppercase tracking-tight">Corporate Training</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Continuous employee training is essential. It enables your employees to advance their knowledge. Spending on your employees is very important to your company. You can improve on the basic skills gained in corporate training. This improves your business performance. When employees improve on what they learned, they can improve in their output. Your employees reflect on your business. How skilled they are is shown in your business output. Employees can bring more to the table if they know more. Invest in your employees' knowledge. In turn, they will do the same for their work. Moreover, you and your company will be the ones reaping the fruits.
                            </p>
                        </div>
                    </motion.div>

                    {/* Consulting Services */}
                    <motion.div id="consulting" variants={itemVariants} className="group flex flex-col bg-slate-50 rounded-[32px] border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 overflow-hidden">
                        <div className="h-56 overflow-hidden relative bg-white flex items-center justify-center p-2">
                            <img
                                src="/images/about/consulting-services.jpg"
                                alt="Consulting Services"
                                className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute top-4 left-4 w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                                <BarChart3 className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="p-8 space-y-4">
                            <h3 className="text-xl font-black text-[#0b1f3a] uppercase tracking-tight">Consulting Services</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Consultants provide a significant amount of value for an organization. They can help to develop strategies for growth or manage projects. Since consultants are not committed to a single firm, they bring experience from a variety of companies and industries, which allows them to offer creative solutions and enables "out of the box" thinking. They can provide an objective viewpoint, which allows for more diverse ideas than could be provided solely by employees within the organization. A consultant may have a higher level of business expertise than the average employee and can provide unique solutions for businesses. Companies may want to consider the advantages of the level of expertise that can be brought by a consultant, as well as how they could benefit from having an established strategic plan.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>

            </div>
        </section>
    );
};

export default AboutSection;
