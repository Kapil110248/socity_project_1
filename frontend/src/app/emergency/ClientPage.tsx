'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Building2,
  User,
  Smartphone,
  MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { useEmergencyStore } from '@/lib/stores/emergency-store'
import toast from 'react-hot-toast'

export default function ClientPage() {
  const params = useParams()
  const barcodeId = params.id as string

  const { barcodes, addScanLog } = useEmergencyStore()
  const [barcode, setBarcode] = useState<any>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    reason: '',
  })

  useEffect(() => {
    const found = barcodes.find(b => b.id === barcodeId)
    if (found && found.status === 'active') {
      setBarcode(found)
    }
  }, [barcodeId, barcodes])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.phone) {
      toast.error('Name and Mobile number are required.')
      return
    }

    setIsLoading(true)

    // simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    addScanLog({
      barcodeId,
      visitorName: formData.name,
      visitorPhone: formData.phone,
      reason: formData.reason,
      isEmergency: true,
      unit: barcode?.unit || 'N/A',
      residentName: barcode?.residentName || 'N/A',
    })

    setIsLoading(false)
    setIsSubmitted(true)
    toast.success('Resident notified successfully.')
  }

  if (!barcode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center p-8">
          <AlertTriangle className="mx-auto h-10 w-10 text-red-600 mb-4" />
          <h1 className="text-xl font-bold mb-2">
            Invalid or Inactive Barcode
          </h1>
          <p className="text-gray-500 mb-4">
            The barcode you scanned is invalid or inactive.
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="p-8 max-w-lg bg-white rounded-2xl">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Label>Your Name</Label>
                <Input
                  value={formData.name}
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />

                <Label>Mobile Number</Label>
                <Input
                  value={formData.phone}
                  onChange={e =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />

                <Label>Reason (optional)</Label>
                <Textarea
                  value={formData.reason}
                  onChange={e =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Notifying...' : 'Notify Resident'}
                </Button>
              </form>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="p-8 text-center bg-white rounded-2xl">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Alert Sent!</h2>
              <p className="text-gray-600 mb-6">
                Resident of <b>{barcode.unit}</b> has been notified.
              </p>
              <Button onClick={() => window.close()}>Close</Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
