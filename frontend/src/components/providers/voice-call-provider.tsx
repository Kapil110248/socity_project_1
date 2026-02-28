'use client'

import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { getSocket, connectUser } from '@/lib/socket'
import { useAuthStore } from '@/lib/stores/auth-store'
import toast from 'react-hot-toast'

type CallState = 'IDLE' | 'RINGING' | 'CONNECTED' | 'DIALING' | 'ENDED'

interface VoiceCallContextType {
  callState: CallState
  incomingCall: any
  startCall: (toUserId: number | string, visitorName: string, visitorPhone: string) => Promise<void>
  acceptCall: () => Promise<void>
  rejectCall: () => void
  endCall: () => void
  localStream: MediaStream | null
  remoteStream: MediaStream | null
}

const VoiceCallContext = createContext<VoiceCallContextType | undefined>(undefined)

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
}

export const VoiceCallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthStore()
  const [callState, setCallState] = useState<CallState>('IDLE')
  const [incomingCall, setIncomingCall] = useState<any>(null)
  
  const peerConnection = useRef<RTCPeerConnection | null>(null)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  
  const audioRing = useRef<HTMLAudioElement | null>(null)

  // Initialize Socket
  const socket = getSocket()

  useEffect(() => {
    // 1. Always ensure socket is connected (even for anonymous visitors)
    if (!socket.connected) {
      socket.connect()
    }

    // 2. If logged in, join the user's specific room to receive incoming calls
    if (user) {
      connectUser(user.id)
    }

    // 3. Unconditionally listen for call events (vital for both visitor and resident)
    socket.on('incoming-call', (payload) => {
      console.log('[WebRTC] Incoming call:', payload)
      setIncomingCall(payload)
      setCallState('RINGING')
      playRingtone()
    })

    socket.on('call-answered', async ({ answer }) => {
      console.log('[WebRTC] Call answered')
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer))
        setCallState('CONNECTED')
        stopRingtone()
      }
    })

    socket.on('ice-candidate', async ({ candidate }) => {
      if (peerConnection.current && candidate) {
        try {
          await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate))
        } catch (e) {
          console.error('[WebRTC] Error adding ice candidate', e)
        }
      }
    })

    socket.on('call-rejected', () => {
      toast.error('Call rejected')
      cleanup()
    })

    socket.on('call-ended', () => {
      toast('Call ended')
      cleanup()
    })

    return () => {
      socket.off('incoming-call')
      socket.off('call-answered')
      socket.off('ice-candidate')
      socket.off('call-rejected')
      socket.off('call-ended')
    }
  }, [user, socket])

  const playRingtone = () => {
    // Note: We'll need a public asset or base64 sound later
  }

  const stopRingtone = () => {
    // Stop ringing logic
  }

  const cleanup = () => {
    if (peerConnection.current) {
      peerConnection.current.close()
      peerConnection.current = null
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
    }
    setLocalStream(null)
    setRemoteStream(null)
    setCallState('IDLE')
    setIncomingCall(null)
    stopRingtone()
  }

  const setupPeerConnection = (targetUserId?: string | number, targetSocketId?: string) => {
    const pc = new RTCPeerConnection(configuration)
    
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        // Send to either the user's room (if caller to resident) or specific socket (if resident to caller)
        socket.emit('ice-candidate', { toUserId: targetUserId, toSocketId: targetSocketId, candidate: event.candidate })
      }
    }

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0])
    }

    peerConnection.current = pc
    return pc
  }

  const startCall = async (toUserId: number | string, visitorName: string, visitorPhone: string) => {
    try {
      setCallState('DIALING')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setLocalStream(stream)

      // The caller (visitor) sends ICE candidates to the resident's user room
      const pc = setupPeerConnection(toUserId, undefined)
      stream.getTracks().forEach(track => pc.addTrack(track, stream))

      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)

      socket.emit('call-start', { toUserId, visitorName, visitorPhone, offer })
    } catch (err) {
      console.error('[WebRTC] Start call error:', err)
      toast.error('Could not start call. Check microphone permissions.')
      cleanup()
    }
  }

  const acceptCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setLocalStream(stream)

      // The receiver (resident) sends ICE candidates back to the caller's socket ID
      const pc = setupPeerConnection(undefined, incomingCall.fromSocketId)
      stream.getTracks().forEach(track => pc.addTrack(track, stream))

      await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.offer))
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)

      socket.emit('call-answer', { toSocketId: incomingCall.fromSocketId, answer })
      setCallState('CONNECTED')
      stopRingtone()
    } catch (err) {
      console.error('[WebRTC] Accept call error:', err)
      cleanup()
    }
  }

  const rejectCall = () => {
    if (incomingCall) {
      socket.emit('call-rejected', { toSocketId: incomingCall.fromSocketId })
    }
    cleanup()
  }

  const endCall = () => {
    // Notify peer
    const toSocketId = incomingCall?.fromSocketId
    socket.emit('call-end', { toSocketId })
    cleanup()
  }

  return (
    <VoiceCallContext.Provider value={{
      callState,
      incomingCall,
      startCall,
      acceptCall,
      rejectCall,
      endCall,
      localStream,
      remoteStream
    }}>
      {children}
    </VoiceCallContext.Provider>
  )
}

export const useVoiceCall = () => {
  const context = useContext(VoiceCallContext)
  if (!context) throw new Error('useVoiceCall must be used within a VoiceCallProvider')
  return context
}
