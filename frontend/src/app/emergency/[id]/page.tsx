// 'use client'

// import { useState, useEffect } from 'react'
// import { useParams } from 'next/navigation'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Shield, Phone, AlertTriangle, CheckCircle2, Building2, User, Smartphone, MessageSquare } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Textarea } from '@/components/ui/textarea'
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
// import { useEmergencyStore } from '@/lib/stores/emergency-store'
// import toast from 'react-hot-toast'

// export default function PublicEmergencyPage() {
//     const params = useParams()
//     const barcodeId = params.id as string
//     const { barcodes, addScanLog } = useEmergencyStore()
//     const [barcode, setBarcode] = useState<any>(null)
//     const [isSubmitted, setIsSubmitted] = useState(false)
//     const [isLoading, setIsLoading] = useState(false)

//     const [formData, setFormData] = useState({
//         name: '',
//         phone: '',
//         reason: '',
//     })

//     useEffect(() => {
//         const found = barcodes.find(b => b.id === barcodeId)
//         if (found && found.status === 'active') {
//             setBarcode(found)
//         }
//     }, [barcodeId, barcodes])

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault()
//         if (!formData.name || !formData.phone) {
//             toast.error('Name and Mobile number are required.')
//             return
//         }

//         setIsLoading(true)

//         // Simulate API delay
//         await new Promise(resolve => setTimeout(resolve, 1500))

//         addScanLog({
//             barcodeId,
//             visitorName: formData.name,
//             visitorPhone: formData.phone,
//             reason: formData.reason,
//             isEmergency: true, // Emergency scans are usually high priority
//             unit: barcode?.unit || 'N/A',
//             residentName: barcode?.residentName || 'N/A',
//         })

//         setIsLoading(false)
//         setIsSubmitted(true)
//         toast.success('Resident notified successfully.')
//     }

//     if (!barcode) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
//                 <Card className="max-w-md w-full border-0 shadow-2xl rounded-[40px] text-center p-8">
//                     <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
//                         <AlertTriangle className="h-10 w-10 text-red-600" />
//                     </div>
//                     <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid or Inactive Barcode</h1>
//                     <p className="text-gray-500 mb-6">The barcode you scanned is either inactive or doesn't exist. Please ask the owner for a fresh scan.</p>
//                     <Button
//                         className="w-full bg-[#1e3a5f] rounded-2xl h-12 font-bold"
//                         onClick={() => window.location.reload()}
//                     >
//                         Try Again
//                     </Button>
//                 </Card>
//             </div>
//         )
//     }

//     return (
//         <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6">
//             {/* Background Glow */}
//             <div className="fixed inset-0 overflow-hidden pointer-events-none">
//                 <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
//                 <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/10 blur-[120px] rounded-full" />
//             </div>

//             <AnimatePresence mode="wait">
//                 {!isSubmitted ? (
//                     <motion.div
//                         key="form"
//                         initial={{ opacity: 0, scale: 0.95 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         exit={{ opacity: 0, scale: 0.95 }}
//                         className="max-w-lg w-full relative z-10"
//                     >
//                         <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-xl rounded-[40px] overflow-hidden">
//                             <div className="bg-gradient-to-r from-red-600 to-orange-600 p-8 text-white">
//                                 <div className="flex items-center gap-3 mb-4">
//                                     <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
//                                         <Shield className="h-6 w-6" />
//                                     </div>
//                                     <div>
//                                         <h2 className="text-xl font-bold">Emergency Contact</h2>
//                                         <p className="text-white/80 text-sm">Secure Communication System</p>
//                                     </div>
//                                 </div>
//                                 <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
//                                     <p className="text-sm font-medium">You are scanning for:</p>
//                                     <p className="text-lg font-bold mt-1">{barcode.label}</p>
//                                     <p className="text-xs text-white/60">Unit: {barcode.unit}</p>
//                                 </div>
//                             </div>

//                             <CardContent className="p-8">
//                                 <form onSubmit={handleSubmit} className="space-y-6">
//                                     <div className="space-y-2">
//                                         <Label htmlFor="name" className="text-sm font-bold text-gray-700 ml-1">Your Name *</Label>
//                                         <div className="relative">
//                                             <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                                             <Input
//                                                 id="name"
//                                                 placeholder="e.g. Rahul Sharma"
//                                                 className="pl-12 h-14 rounded-2xl border-gray-200 focus:ring-red-500/20 focus:border-red-500 transition-all"
//                                                 value={formData.name}
//                                                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                                                 required
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="space-y-2">
//                                         <Label htmlFor="phone" className="text-sm font-bold text-gray-700 ml-1">Mobile Number *</Label>
//                                         <div className="relative">
//                                             <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//                                             <Input
//                                                 id="phone"
//                                                 type="tel"
//                                                 placeholder="10-digit mobile number"
//                                                 className="pl-12 h-14 rounded-2xl border-gray-200 focus:ring-red-500/20 focus:border-red-500 transition-all"
//                                                 value={formData.phone}
//                                                 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                                                 required
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="space-y-2">
//                                         <Label htmlFor="reason" className="text-sm font-bold text-gray-700 ml-1">Reason / Note (Optional)</Label>
//                                         <div className="relative">
//                                             <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
//                                             <Textarea
//                                                 id="reason"
//                                                 placeholder="e.g. Your car is blocking my way..."
//                                                 className="pl-12 min-h-[120px] rounded-2xl border-gray-200 focus:ring-red-500/20 focus:border-red-500 transition-all py-4"
//                                                 value={formData.reason}
//                                                 onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
//                                             />
//                                         </div>
//                                     </div>

//                                     <Button
//                                         type="submit"
//                                         disabled={isLoading}
//                                         className="w-full h-14 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-red-500/20 transition-all active:scale-[0.98]"
//                                     >
//                                         {isLoading ? (
//                                             <div className="flex items-center gap-3">
//                                                 <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
//                                                 Notifying Resident...
//                                             </div>
//                                         ) : (
//                                             'NOTIFY RESIDENT NOW'
//                                         )}
//                                     </Button>

//                                     <p className="text-center text-xs text-gray-400 font-medium">
//                                         Your phone number is shared only with the resident for emergency contact. No other data is exposed.
//                                     </p>
//                                 </form>
//                             </CardContent>
//                         </Card>
//                     </motion.div>
//                 ) : (
//                     <motion.div
//                         key="success"
//                         initial={{ opacity: 0, scale: 0.9 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         className="max-w-md w-full relative z-10"
//                     >
//                         <Card className="border-0 shadow-2xl bg-white rounded-[40px] p-8 text-center">
//                             <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
//                                 <CheckCircle2 className="h-12 w-12 text-green-600" />
//                             </div>
//                             <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Alert Sent!</h2>
//                             <p className="text-gray-600 mb-8 leading-relaxed">
//                                 The resident of <strong>{barcode.unit}</strong> has been notified of your inquiry. Please stay near the location, they might contact you shortly via the app.
//                             </p>
//                             <div className="space-y-4">
//                                 <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
//                                     <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Assisted By</p>
//                                     <div className="flex items-center justify-center gap-2">
//                                         <div className="p-1.5 bg-teal-500 rounded-lg">
//                                             <Building2 className="h-4 w-4 text-white" />
//                                         </div>
//                                         <span className="font-bold text-gray-800">IGATESECURITY</span>
//                                     </div>
//                                 </div>
//                                 <Button
//                                     variant="outline"
//                                     className="w-full h-14 rounded-2xl font-bold border-2"
//                                     onClick={() => window.close()}
//                                 >
//                                     Close Window
//                                 </Button>
//                             </div>
//                         </Card>
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </div>
//     )
// }

import ClientPage from '../ClientPage'

/**
 * REQUIRED for output: "export"
 * Yahan apne real barcode IDs daal sakte ho
 */
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ]
}

export default function Page() {
  return <ClientPage />
}

