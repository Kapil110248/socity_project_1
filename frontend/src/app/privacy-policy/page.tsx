'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    Shield,
    Lock,
    Eye,
    UserCheck,
    Database,
    Bell,
    Trash2,
    Mail,
    Phone,
    MapPin,
    ArrowUp,
    ChevronLeft,
    Users,
    Camera,
    FileText,
    Clock,
    AlertTriangle,
    CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function PrivacyPolicyPage() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djItSDJ2LTJoMzR6bTAtMzBWNkgyVjRoMzR6TTIgMTR2LTJIMHY0SDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-emerald-100 hover:text-white transition-colors mb-8 text-sm"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back to Home
                    </Link>

                    <div className="text-center max-w-3xl mx-auto">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-6"
                        >
                            <Shield className="h-10 w-10 text-emerald-200" />
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-5xl font-bold mb-4"
                        >
                            Privacy Policy
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg md:text-xl text-emerald-100 leading-relaxed"
                        >
                            Platform – <strong>igate</strong> (the Mobile Application / App / Us / We)
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mt-4 text-sm text-emerald-200"
                        >
                            Last Updated: February 21, 2026
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="space-y-12">

                    {/* Section 1: Introduction */}
                    <motion.section
                        variants={sectionVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                                <Eye className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">1. Introduction</h2>
                        </div>
                        <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                            <p>
                                Welcome to <strong className="text-gray-900 dark:text-white">igate</strong>, a society and community management platform operated by{' '}
                                <strong className="text-gray-900 dark:text-white">One Stop Property Solutions Pvt. Ltd.</strong> ("Company", "We", "Us", or "Our").
                            </p>
                            <p>
                                This Privacy Policy explains how we collect, use, disclose, and safeguard your information
                                when you use the igate mobile application or web platform. We are committed to protecting
                                the personal data of all residents, administrators, guards, vendors, and other users of the
                                igate platform.
                            </p>
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 mt-4">
                                <p className="text-sm text-emerald-800 dark:text-emerald-300">
                                    <strong>By using igate</strong>, you acknowledge that you have read and understood this
                                    Privacy Policy and agree to the collection and use of your information in accordance with
                                    this policy.
                                </p>
                            </div>
                        </div>
                    </motion.section>

                    {/* Section 2: Information We Collect */}
                    <motion.section
                        variants={sectionVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                                <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">2. Information We Collect</h2>
                        </div>
                        <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                            <p>We may collect the following types of information when you use the igate platform:</p>
                            <div className="grid gap-3">
                                {[
                                    { label: 'Personal Identification', detail: 'Name, email address, phone number, unit/flat number, and profile photo.' },
                                    { label: 'Society Information', detail: 'Society name, address, block, floor, and membership details.' },
                                    { label: 'Financial Data', detail: 'Billing information, payment records, invoice history, and wallet transactions.' },
                                    { label: 'Security Data', detail: 'Visitor logs, vehicle registration numbers, entry/exit timestamps, and QR access codes.' },
                                    { label: 'Communication Data', detail: 'Complaints, notices, community posts, and chat messages.' },
                                    { label: 'Device Information', detail: 'Device type, operating system, browser type, IP address, and app version.' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <span className="font-semibold text-gray-900 dark:text-white">{item.label}:</span>{' '}
                                            <span>{item.detail}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.section>

                    {/* Section 3: How We Use Your Information */}
                    <motion.section
                        variants={sectionVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                                <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">3. How We Use Your Information</h2>
                        </div>
                        <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                            <p>We use the information we collect from the igate platform to:</p>
                            <ul className="space-y-2 ml-4">
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-1">•</span>
                                    Provide, operate, and maintain the igate platform and its features.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-1">•</span>
                                    Process billing, generate invoices, and manage financial transactions.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-1">•</span>
                                    Facilitate visitor management and community security operations.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-1">•</span>
                                    Enable communication between residents, administrators, and vendors.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-1">•</span>
                                    Send notifications about society events, maintenance, and emergencies.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-1">•</span>
                                    Improve our services, troubleshoot issues, and enhance user experience.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-1">•</span>
                                    Comply with legal obligations and enforce our terms of service.
                                </li>
                            </ul>
                        </div>
                    </motion.section>

                    {/* Section 4: Visitor Management */}
                    <motion.section
                        variants={sectionVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30">
                                <UserCheck className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">4. Visitor Management</h2>
                        </div>
                        <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                            <p>
                                The igate platform includes visitor management features designed to enhance community
                                security. When visitors are registered through the igate app:
                            </p>
                            <ul className="space-y-2 ml-4">
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-500 mt-1">•</span>
                                    Visitor name, phone number, purpose of visit, and vehicle details may be recorded.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-500 mt-1">•</span>
                                    Entry and exit timestamps are logged for security purposes.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-500 mt-1">•</span>
                                    QR codes may be generated for pre-approved visitor access.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-orange-500 mt-1">•</span>
                                    This data is stored securely and is accessible only to authorized society administrators and security personnel.
                                </li>
                            </ul>
                        </div>
                    </motion.section>

                    {/* Section 5: Security Assistance */}
                    <motion.section
                        variants={sectionVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30">
                                <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">5. Security Assistance</h2>
                        </div>
                        <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                            <p>
                                The igate platform provides security assistance features to protect residents and property:
                            </p>
                            <ul className="space-y-2 ml-4">
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 mt-1">•</span>
                                    Emergency alerts and SOS features may collect location data temporarily for safety response.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 mt-1">•</span>
                                    Incident reports and patrol logs are maintained for community security records.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 mt-1">•</span>
                                    Vehicle registration data is processed only for authorized entry/exit management.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 mt-1">•</span>
                                    All security data is handled with strict access controls and is not shared with third parties except as required by law.
                                </li>
                            </ul>
                        </div>
                    </motion.section>

                    {/* Section 6: Community Connectivity */}
                    <motion.section
                        variants={sectionVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-900/30">
                                <Users className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">6. Community Connectivity</h2>
                        </div>
                        <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                            <p>
                                The igate platform fosters community engagement through various connectivity features:
                            </p>
                            <ul className="space-y-2 ml-4">
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-500 mt-1">•</span>
                                    Community buzz posts, event announcements, and marketplace listings are visible to society members.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-500 mt-1">•</span>
                                    Chat messages and group communications are encrypted and accessible only to participants.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-500 mt-1">•</span>
                                    Notice board and guideline content is managed by authorized administrators.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-500 mt-1">•</span>
                                    User-generated content remains the responsibility of the posting user, subject to community guidelines.
                                </li>
                            </ul>
                        </div>
                    </motion.section>

                    {/* Section 7: Account & Data Handling */}
                    <motion.section
                        variants={sectionVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                                <Lock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">7. Account & Data Handling</h2>
                        </div>
                        <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                            <p>We implement industry-standard security measures to protect your data on the igate platform:</p>
                            <div className="grid gap-3 md:grid-cols-2">
                                {[
                                    { icon: Lock, label: 'Encryption', detail: 'All data in transit and at rest is encrypted using AES-256 encryption.' },
                                    { icon: UserCheck, label: 'Access Control', detail: 'Role-based permissions ensure only authorized users access specific data.' },
                                    { icon: FileText, label: 'Audit Trails', detail: 'All critical actions are logged for accountability and transparency.' },
                                    { icon: Database, label: 'Secure Storage', detail: 'Data is stored on secure, geo-redundant servers with regular backups.' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
                                        <item.icon className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.label}</p>
                                            <p className="text-sm mt-1">{item.detail}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mt-4">
                                <div className="flex items-start gap-2">
                                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-amber-800 dark:text-amber-300">
                                        While we implement best-in-class security, no internet-based service is completely
                                        breach-proof. In the event of a data incident, we will notify affected users within
                                        72 hours as required by applicable law.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Section 8: Data Retention */}
                    <motion.section
                        variants={sectionVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/30">
                                <Clock className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">8. Data Retention</h2>
                        </div>
                        <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                            <p>
                                We retain your personal data on the igate systems only for as long as necessary to
                                fulfil the purposes described in this Privacy Policy, unless a longer retention period
                                is required or permitted by law.
                            </p>
                            <ul className="space-y-2 ml-4">
                                <li className="flex items-start gap-2">
                                    <span className="text-teal-500 mt-1">•</span>
                                    <strong>Active accounts:</strong> Data is retained as long as your account on the igate app is active.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-teal-500 mt-1">•</span>
                                    <strong>Financial records:</strong> Billing and payment data is retained for a minimum of 7 years to comply with tax and accounting regulations.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-teal-500 mt-1">•</span>
                                    <strong>Security logs:</strong> Visitor and access logs are retained for 12 months from the date of creation.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-teal-500 mt-1">•</span>
                                    <strong>Deleted accounts:</strong> Upon account deletion, personal data is purged from igate systems within 90 days, except where legal obligations require longer retention.
                                </li>
                            </ul>
                        </div>
                    </motion.section>

                    {/* Section 9: Children's Privacy */}
                    <motion.section
                        variants={sectionVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/30">
                                <AlertTriangle className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">9. Children&apos;s Privacy</h2>
                        </div>
                        <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                            <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-xl p-4">
                                <p>
                                    <strong className="text-gray-900 dark:text-white">igate is a property and community management tool</strong> — it is not intended for use by individuals under the age of 18.
                                </p>
                                <p className="mt-2">
                                    We do not knowingly collect personally identifiable information from anyone under 18 years
                                    of age. If we discover that a minor has registered on the igate platform, we will
                                    immediately delete their data. Please contact us if you believe a minor has created
                                    an account.
                                </p>
                            </div>
                        </div>
                    </motion.section>

                    {/* Section 10: Your Rights */}
                    <motion.section
                        variants={sectionVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">10. Your Rights</h2>
                        </div>
                        <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                            <p>You own your data. As a user of the igate platform, you have the right to:</p>
                            <div className="grid gap-3">
                                {[
                                    { label: 'Access & Export', detail: 'Download your personal data, billing history, or complaint records at any time.' },
                                    { label: 'Update & Correct', detail: 'Edit your profile details, unit information, or contact information directly through the igate app.' },
                                    { label: 'Delete & Anonymize', detail: 'Request permanent deletion of your account and all associated data from the igate platform.' },
                                    { label: 'Opt-Out', detail: 'Withdraw consent for non-essential communications or data processing (except where required by law).' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800">
                                        <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <span className="font-semibold text-gray-900 dark:text-white">{item.label}:</span>{' '}
                                            <span>{item.detail}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-4">
                                To exercise any of these rights, please contact us at{' '}
                                <a href="mailto:support@igatesecurity.com" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
                                    support@igatesecurity.com
                                </a>{' '}
                                — we respond within 48 hours.
                            </p>
                        </div>
                    </motion.section>

                    {/* Section 11: Contact & Account Deactivation */}
                    <motion.section
                        variants={sectionVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30">
                                <Mail className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">11. Contact & Account Deactivation</h2>
                        </div>
                        <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                            <p>
                                If you wish to deactivate your account on the igate platform, you may do so through your
                                profile settings or by contacting our support team. Upon deactivation:
                            </p>
                            <ul className="space-y-2 ml-4">
                                <li className="flex items-start gap-2">
                                    <span className="text-violet-500 mt-1">•</span>
                                    Your profile will be removed from active listings and community features.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-violet-500 mt-1">•</span>
                                    Financial records will be retained as required by law.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-violet-500 mt-1">•</span>
                                    You may request complete data deletion by emailing us.
                                </li>
                            </ul>

                            <div className="mt-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Contact Us</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-violet-500 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">Email Support</p>
                                            <a href="mailto:support@igatesecurity.com" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
                                                support@igatesecurity.com
                                            </a>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Response within 24-48 hours</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-5 w-5 text-violet-500 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">Phone Support</p>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">+91 98765 43210</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Mon-Fri, 9 AM - 6 PM IST</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-violet-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">Registered Office</p>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                One Stop Property Solutions Pvt. Ltd.<br />
                                                Bangalore, Karnataka, India
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Section 12: Changes to This Policy */}
                    <motion.section
                        variants={sectionVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700">
                                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">12. Changes to This Policy</h2>
                        </div>
                        <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                            <p>
                                We may update this Privacy Policy from time to time. When we make changes, we will
                                update the "Last Updated" date at the top of this page and notify users through the
                                igate platform. We encourage you to review this Privacy Policy periodically to stay
                                informed about how we are protecting your information.
                            </p>
                        </div>
                    </motion.section>

                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-sm">
                        © 2026 igate. All rights reserved.
                    </p>
                    <p className="text-xs mt-2 text-gray-500">
                        A product of One Stop Property Solutions Pvt. Ltd.
                    </p>
                    <div className="mt-4">
                        <Link href="/" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </footer>

            {/* Scroll to Top Button */}
            <button
                onClick={scrollToTop}
                className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transition-all hover:scale-110"
                aria-label="Scroll to top"
            >
                <ArrowUp className="h-5 w-5" />
            </button>
        </div>
    )
}
