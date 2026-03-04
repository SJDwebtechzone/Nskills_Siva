"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, Variants } from "framer-motion";
import { MapPin, Phone, Mail, Send, RotateCcw, RefreshCw } from "lucide-react";

const ContactPage: React.FC = () => {
    const [captcha, setCaptcha] = useState<string>("");

    const generateCaptcha = useCallback(() => {
        const characters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
        let result = "";
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setCaptcha(result);
    }, []);

    useEffect(() => {
        generateCaptcha();
    }, [generateCaptcha]);

    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
        }),
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            {/* Page Header Header Banner */}
            <div className="relative h-[250px] md:h-[300px] bg-[#1a1a1a] flex flex-col items-center justify-center text-white overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-black/50"></div>

                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative text-4xl md:text-5xl font-bold mb-4 z-10"
                >
                    Contact Us
                </motion.h1>
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-12 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column: Contact Info Cards */}
                    <div className="space-y-4">
                        <motion.div
                            custom={0}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={cardVariants}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white p-6 rounded-lg shadow-sm flex items-start space-x-4 border-l-4 border-blue-500"
                        >
                            <div className="bg-blue-50 p-3 rounded-full text-blue-500 shrink-0">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[#0b1f3a] mb-1">Office Location</h3>
                                <p className="text-sm text-gray-600">
                                    361/3, Pillayar Kovil Street, Irandamkattalai, Kovur, Chennai - 600 122. India
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            custom={1}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={cardVariants}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white p-6 rounded-lg shadow-sm flex items-start space-x-4 border-l-4 border-blue-500"
                        >
                            <div className="bg-blue-50 p-3 rounded-full text-blue-500 shrink-0">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[#0b1f3a] mb-1">Phone</h3>
                                <p className="text-sm text-gray-600 font-semibold">+91 - 9884209774</p>
                                <p className="text-sm text-gray-600 font-semibold">+91 - 8056063023</p>
                            </div>
                        </motion.div>

                        <motion.div
                            custom={2}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={cardVariants}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white p-6 rounded-lg shadow-sm flex items-start space-x-4 border-l-4 border-blue-500"
                        >
                            <div className="bg-blue-50 p-3 rounded-full text-blue-500 shrink-0">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[#0b1f3a] mb-1">Email</h3>
                                <p className="text-sm text-gray-600 font-semibold">nskilltraining@gmail.com</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={cardVariants}
                        custom={3}
                        className="bg-white p-8 rounded-lg shadow-md border border-gray-200 border-t-4 border-t-blue-500"
                    >
                        <h2 className="text-3xl font-bold text-[#0b1f3a] mb-4">Send a Message</h2>
                        <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#0b1f3a] uppercase tracking-wider ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 text-gray-900 font-medium"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#0b1f3a] uppercase tracking-wider ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 text-gray-900 font-medium"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#0b1f3a] uppercase tracking-wider ml-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        placeholder="Enter phone number"
                                        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 text-gray-900 font-medium"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-[#0b1f3a] uppercase tracking-wider ml-1">Subject</label>
                                    <input
                                        type="text"
                                        placeholder="How can we help?"
                                        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 text-gray-900 font-medium"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-[#0b1f3a] uppercase tracking-wider ml-1">Message</label>
                                <textarea
                                    rows={4}
                                    placeholder="Write your message here..."
                                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 text-gray-900 font-medium"
                                ></textarea>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="bg-gray-100 px-6 py-3 border border-dashed border-gray-400 rounded font-serif italic text-2xl tracking-[0.3em] text-gray-800 select-none shadow-inner min-w-[140px] text-center"
                                    >
                                        {captcha}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={generateCaptcha}
                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                                        title="Refresh Captcha"
                                    >
                                        <RefreshCw size={20} />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Enter Captcha"
                                    className="px-4 py-3 bg-white border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none w-48 text-gray-900"
                                />
                            </div>
                            <button className="w-full bg-[#0b1f3a] text-white font-bold py-4 rounded hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl active:scale-[0.99] transition-transform">
                                Send Message <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>

            {/* Google Maps Section */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
                custom={4}
                className="max-w-6xl mx-auto px-4 md:px-12 pb-16"
            >
                <div className="w-full h-[400px] bg-gray-200 relative rounded-2xl overflow-hidden shadow-md">
                    <iframe
                        title="N-Skill India Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.355152504856!2d80.1293214!3d13.012892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525fdf8e6b19a3%3A0x6b7b2586e3f1e1e!2sPillayar%20Kovil%20St%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1709476000000!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="grayscale hover:grayscale-0 transition-all duration-500"
                    ></iframe>
                </div>
            </motion.div>
        </div>
    );
};

export default ContactPage;
