"use client";

import React from "react";

export default function AdmissionManagementPage() {
    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Admission Form Management</h2>
                <p className="text-slate-500 mb-6">Manage all student admissions here.</p>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="py-3 px-4 text-sm font-semibold text-slate-600">Student Name</th>
                                <th className="py-3 px-4 text-sm font-semibold text-slate-600">Email</th>
                                <th className="py-3 px-4 text-sm font-semibold text-slate-600">Course Applied</th>
                                <th className="py-3 px-4 text-sm font-semibold text-slate-600">Application Date</th>
                                <th className="py-3 px-4 text-sm font-semibold text-slate-600">Status</th>
                                <th className="py-3 px-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="py-4 px-4 text-sm text-slate-500" colSpan={6} style={{ textAlign: "center" }}>
                                    No admissions found.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
