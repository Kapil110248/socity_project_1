'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Building2, Mail, Lock, Eye, EyeOff, Sparkles, Shield, Users, Calendar, Home, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { useAuthStore } from '@/lib/stores/auth-store'
import api from '@/lib/api'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const demoAccounts = [
    { role: 'Super Admin', email: 'superadmin@society.com', password: 'super123', icon: '👑', color: 'from-purple-500 to-pink-500' },
    { role: 'Admin', email: 'admin@society.com', password: 'admin123', icon: '👨‍💼', color: 'from-teal-500 to-cyan-500' },
    { role: 'Resident', email: 'resident1@society.com', password: 'resident123', icon: '🏠', color: 'from-blue-500 to-indigo-500' },
    { role: 'Guard', email: 'guard@society.com', password: 'guard123', icon: '🛡️', color: 'from-orange-500 to-amber-500' },
    { role: 'Vendor', email: 'test4@gmail.com', password: '11111111', icon: '🛠️', color: 'from-blue-600 to-indigo-600' },
    { role: 'Individual', email: 'individual@example.com', password: 'user123', icon: '👤', color: 'from-pink-500 to-rose-500' },
  ]

  const handleDemoLogin = (email: string, password: string) => {
    setValue('email', email)
    setValue('password', password)
    toast.success('Demo credentials filled! Click Sign In to proceed.')
  }

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)

    try {
      const response = await api.post('/auth/login', data)
      const { user, token } = response.data

      login(user, token)

      toast.success(`Welcome back, ${user.name}!`)
      router.push('/dashboard')
    } catch (error: any) {
      console.error('Login error:', error)
      const errorMessage = error.response?.data?.error || 'Invalid credentials. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1e3a5f] via-[#2d4a6f] to-[#1e3a5f] p-12 text-white flex-col justify-between relative overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
          <div className="absolute bottom-20 left-40 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl shadow-lg">
              <Building2 className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-wide">IGATESECURITY</h2>
              <p className="text-teal-300 text-sm">Smart Community Management</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Welcome to the
                <br />
                <span className="text-teal-300">Future of Living</span>
              </h1>
              <p className="text-white/70 text-lg max-w-md">
                Experience seamless society management with India's most trusted community platform
              </p>
            </div>

            <div className="space-y-4 mt-12">
              {[
                { icon: Shield, text: 'Real-time visitor management & gate security' },
                { icon: Calendar, text: 'Automated billing & payment tracking' },
                { icon: Users, text: 'Amenity booking & community events' },
                { icon: Home, text: 'Complete household management' },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center backdrop-blur">
                    <feature.icon className="h-5 w-5 text-teal-300" />
                  </div>
                  <span className="text-white/80">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-teal-400" />
            <span className="text-teal-300 font-medium">Trusted by 500+ communities</span>
          </div>
          <p className="text-white/60 text-sm">
            Serving residential societies across India
          </p>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-8 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="p-6 md:p-8 shadow-xl border-0">
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl mb-4 shadow-lg shadow-teal-500/30">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a5f] mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-500">
                Sign in to access your community dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@society.com"
                    className="pl-10 h-12 border-gray-200 focus:border-teal-500 focus:ring-teal-500/20"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-12 border-gray-200 focus:border-teal-500 focus:ring-teal-500/20"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me for 30 days
                  </label>
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Demo Credentials Section */}
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-[#1e3a5f] flex items-center">
                    <Sparkles className="h-4 w-4 mr-2 text-teal-500" />
                    Quick Demo Login
                  </p>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {demoAccounts.map((account) => (
                    <button
                      key={account.role}
                      type="button"
                      onClick={() => handleDemoLogin(account.email, account.password)}
                      className="flex flex-col items-center justify-center p-3 bg-white border-2 border-teal-100 rounded-xl hover:border-teal-400 hover:bg-teal-50 transition-all group shadow-sm"
                    >
                      <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                        {account.icon}
                      </span>
                      <span className="text-xs font-semibold text-gray-700">
                        {account.role}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-teal-700 mt-2 text-center">
                  Click any role to auto-fill credentials
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-teal-500/30"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>




          </Card>


        </motion.div>
      </div>
    </div>
  )
}
