'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'
import api from '@/lib/api'

export function AuthInitializer() {
  const { updateUser, token, isAuthenticated } = useAuthStore()

  useEffect(() => {
    const fetchUser = async () => {
      // Only fetch if we have a token and think we are authenticated
      if (token && isAuthenticated) {
        try {
          const res = await api.get('/auth/me')
          if (res.data) {

            updateUser(res.data)
          }
        } catch (error) {
          console.error('Failed to refresh user data:', error)
          // Optional: Force logout if token is invalid?
          // useAuthStore.getState().logout()
        }
      }
    }

    fetchUser()
  }, [token, isAuthenticated, updateUser])

  return null // This component doesn't render anything
}
