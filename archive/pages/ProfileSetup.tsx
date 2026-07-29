import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Globe, Users, Target, CheckCircle } from 'lucide-react';

export default function ProfileSetup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        companyName: '',
        industry: '',
        stage: 'seed',
        website: '',
        employeeCount: '',
        description: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Save profile data logic here
        navigate('/app');
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-display font-bold text-slate-900 mb-4">Complete Your Profile</h1>
                    <p className="text-slate-500">Let's firm up the details to generate your assets.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl shadow-slate-200/50 space-y-8">
                    {/* Company Basics */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-indigo-600" />
                            Company Basics
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Company Name</label>
                                <input
                                    type="text"
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all"
                                    placeholder="Acme Inc."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Industry</label>
                                <input
                                    type="text"
                                    value={formData.industry}
                                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all"
                                    placeholder="Fintech, Health, etc."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Mission Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all resize-none"
                                placeholder="We are building..."
                            />
                        </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Details */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                            <Target className="w-5 h-5 text-pink-600" />
                            Specifics
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Stage</label>
                                <select
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all appearance-none"
                                    value={formData.stage}
                                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                                >
                                    <option value="pre-seed">Pre-Seed</option>
                                    <option value="seed">Seed</option>
                                    <option value="series-a">Series A</option>
                                    <option value="series-b">Series B+</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Website</label>
                                <input
                                    type="text"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all"
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Team Size</label>
                                <input
                                    type="number"
                                    value={formData.employeeCount}
                                    onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all"
                                    placeholder="1-100"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-bold text-lg shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                        >
                            <CheckCircle className="w-5 h-5" />
                            Finalize Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
