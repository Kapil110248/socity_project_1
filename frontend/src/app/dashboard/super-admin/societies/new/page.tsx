'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Building2,
  MapPin,
  Users,
  Mail,
  Phone,
  ArrowLeft,
  Save,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RoleGuard } from '@/components/auth/role-guard'
import Link from 'next/link'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { toast } from 'react-hot-toast'
import { INDIAN_STATES, STATE_CITY_MAPPING } from '@/lib/constants'

export default function AddSocietyPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    units: '',
    plan: 'basic',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    adminPhone: '',
  })

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await api.post('/society', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['super-admin-societies'] })
      queryClient.invalidateQueries({ queryKey: ['platform-reports'] })
      toast.success('Society created successfully')
      router.push('/dashboard/super-admin/societies')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create society')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      // Clear city if state changes
      if (field === 'state') {
        newData.city = '';
      }
      return newData;
    })
  }

  return (
    <RoleGuard allowedRoles={['super_admin']}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/super-admin/societies">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Society</h1>
            <p className="text-gray-600">Register a new society on the platform</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Society Details */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Society Details
              </CardTitle>
              <CardDescription>Basic information about the society</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Society Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter society name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="units">Number of Units *</Label>
                  <Input
                    id="units"
                    type="number"
                    placeholder="e.g., 250"
                    value={formData.units}
                    onChange={(e) => handleChange('units', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  placeholder="Enter full address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Select
                    value={formData.city}
                    onValueChange={(v) => handleChange('city', v)}
                    disabled={!formData.state}
                  >
                    <SelectTrigger id="city">
                      <SelectValue placeholder={formData.state ? "Select city" : "Select state first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.state && STATE_CITY_MAPPING[formData.state]?.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Select value={formData.state} onValueChange={(v) => handleChange('state', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    placeholder="Enter pincode"
                    value={formData.pincode}
                    onChange={(e) => handleChange('pincode', e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Plan */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>Select the appropriate plan for the society</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { value: 'basic', label: 'Basic', price: '₹10,000/month', features: 'Up to 100 units' },
                  { value: 'professional', label: 'Professional', price: '₹20,000/month', features: 'Up to 300 units' },
                  { value: 'enterprise', label: 'Enterprise', price: '₹75,000/month', features: 'Unlimited units' },
                ].map((plan) => (
                  <div
                    key={plan.value}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${formData.plan === plan.value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                    onClick={() => handleChange('plan', plan.value)}
                  >
                    <h4 className="font-semibold">{plan.label}</h4>
                    <p className="text-lg font-bold text-purple-600">{plan.price}</p>
                    <p className="text-sm text-gray-500">{plan.features}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Link href="/dashboard/super-admin/societies">
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700"
              disabled={createMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {createMutation.isPending ? 'Creating...' : 'Create Society'}
            </Button>
          </div>
        </form>
      </motion.div>
    </RoleGuard >
  )
}
