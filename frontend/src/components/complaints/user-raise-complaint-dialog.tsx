'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, Send, Loader2 } from 'lucide-react'
import { residentService } from '@/services/resident.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

interface UserRaiseComplaintDialogProps {
    preSelectedServiceId?: string
    preSelectedServiceName?: string
    trigger?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function UserRaiseComplaintDialog({ preSelectedServiceId, preSelectedServiceName, trigger, open: externalOpen, onOpenChange: externalOnOpenChange }: UserRaiseComplaintDialogProps) {
    const queryClient = useQueryClient()
    const [internalOpen, setInternalOpen] = useState(false)

    const open = externalOpen !== undefined ? externalOpen : internalOpen
    const setOpen = externalOnOpenChange !== undefined ? externalOnOpenChange : setInternalOpen
    const [category, setCategory] = useState(preSelectedServiceId || '')
    const [subject, setSubject] = useState('')
    const [description, setDescription] = useState('')

    useEffect(() => {
        if (preSelectedServiceId) {
            setCategory(preSelectedServiceId)
        }
    }, [preSelectedServiceId])

    const mutation = useMutation({
        mutationFn: (data: any) => residentService.createTicket(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['complaints'] })
            queryClient.invalidateQueries({ queryKey: ['complaint-stats'] })
            queryClient.invalidateQueries({ queryKey: ['tickets'] })
            toast.success('Complaint submitted successfully!')
            setOpen(false)
            setSubject('')
            setDescription('')
        },
        onError: (error: any) => {
            toast.error('Failed to submit complaint: ' + error.message)
        }
    })

    const handleSubmit = () => {
        if (!subject || !description || !category) {
            toast.error('Please fill all required fields')
            return
        }

        mutation.mutate({
            title: subject,
            description,
            category,
            priority: 'MEDIUM',
            isPrivate: false
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" className="gap-2 text-red-600 border-red-200 hover:bg-red-50">
                        <AlertCircle className="h-4 w-4" />
                        <span>Raise Complaint</span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        Raise Complaint
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Service Category *</Label>
                        <Select value={category} onValueChange={setCategory} disabled={!!preSelectedServiceId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select service" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="security">Security Services</SelectItem>
                                <SelectItem value="cleaning">Cleaning</SelectItem>
                                <SelectItem value="pest">Pest Control</SelectItem>
                                <SelectItem value="plumbing">Plumbing</SelectItem>
                                <SelectItem value="electric">Electrical</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Subject *</Label>
                        <Input
                            placeholder="What is the issue?"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Description *</Label>
                        <Textarea
                            placeholder="Describe the problem in detail..."
                            className="min-h-[100px]"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button
                            className="bg-red-600 hover:bg-red-700 text-white gap-2"
                            onClick={handleSubmit}
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            {mutation.isPending ? 'Submitting...' : 'Submit Complaint'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
