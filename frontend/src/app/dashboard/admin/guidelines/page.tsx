'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BookOpen, Plus, Pencil, Trash2, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { SocietyService } from '@/services/society.service'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthStore } from '@/lib/stores/auth-store'

export default function SocietyGuidelinesPage() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingGuideline, setEditingGuideline] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'SOCIETY',
    targetAudience: 'ALL'
  })

  // Fetch guidelines (Backend will filter by society for ADMIN role)
  const { data: guidelines = [], isLoading } = useQuery({
    queryKey: ['society-guidelines'],
    queryFn: () => SocietyService.getGuidelines(),
  })

  // Create mutation
  const createMutation = useMutation({
    mutationFn: SocietyService.createGuideline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['society-guidelines'] })
      setIsCreateOpen(false)
      setFormData({ title: '', content: '', category: 'SOCIETY', targetAudience: 'ALL' })
      toast.success('Guideline created successfully')
    },
    onError: () => toast.error('Failed to create guideline')
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => SocietyService.updateGuideline(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['society-guidelines'] })
      setIsEditOpen(false)
      setEditingGuideline(null)
      toast.success('Guideline updated successfully')
    },
    onError: () => toast.error('Failed to update guideline')
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: SocietyService.deleteGuideline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['society-guidelines'] })
      toast.success('Guideline deleted successfully')
    },
    onError: () => toast.error('Failed to delete guideline')
  })

  const handleCreate = () => {
    if (!formData.title || !formData.content) {
      return toast.error('Please fill in all required fields')
    }
    createMutation.mutate({
      title: formData.title,
      content: formData.content,
      category: formData.category,
      targetAudience: formData.targetAudience
    })
  }

  const handleEdit = (guideline: any) => {
    setEditingGuideline(guideline)
    setFormData({
      title: guideline.title,
      content: guideline.content,
      category: guideline.category,
      targetAudience: guideline.targetAudience || 'ALL'
    })
    setIsEditOpen(true)
  }

  const handleUpdate = () => {
    if (!editingGuideline) return
    updateMutation.mutate({
      id: editingGuideline.id,
      data: {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        targetAudience: formData.targetAudience
      }
    })
  }

  // Filter out any global guidelines if Admin wants to only manage society-specific ones
  // Usually, Admins can SEE global but only EDIT/DELETE their own.
  // The backend ensures they can only edit/delete their own.
  const myGuidelines = guidelines.filter((g: any) => g.societyId !== null)
  const globalGuidelines = guidelines.filter((g: any) => g.societyId === null)

  return (
    <div className="space-y-6 container mx-auto p-4 md:p-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-[#1e3a5f] dark:text-white">
            <BookOpen className="h-8 w-8 text-teal-500" />
            Society Guidelines
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage guidelines for your residents and staff members.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white gap-2 shadow-lg hover:shadow-teal-500/20 transition-all">
              <Plus className="h-4 w-4" />
              New Guideline
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create New Policy</DialogTitle>
              <DialogDescription>
                Define a new rule or community guideline for your society.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience *</Label>
                <Select
                  value={formData.targetAudience}
                  onValueChange={(v) => setFormData({ ...formData, targetAudience: v })}
                >
                  <SelectTrigger id="audience">
                    <SelectValue placeholder="Who should see this" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Everyone (All)</SelectItem>
                    <SelectItem value="RESIDENTS">Residents Only</SelectItem>
                    <SelectItem value="GUARDS">Security / Guards Only</SelectItem>
                    <SelectItem value="ADMINS">Society Staff / Admins Only</SelectItem>
                    <SelectItem value="VENDORS">Service Vendors Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Policy Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Waste Management Policy"
                  className="focus-visible:ring-teal-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) => setFormData({ ...formData, category: v })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SOCIETY">Society General</SelectItem>
                      <SelectItem value="SECURITY">Security & Safety</SelectItem>
                      <SelectItem value="AMENITIES">Facility Usage</SelectItem>
                      <SelectItem value="PARKING">Parking Rules</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Details & Instructions *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  placeholder="Detailed explanation of the policy..."
                  className="focus-visible:ring-teal-500"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreate} 
                disabled={createMutation.isPending}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {createMutation.isPending ? 'Publishing...' : 'Publish Guideline'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-none shadow-sm dark:bg-[#111b27]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Active Community Policies</CardTitle>
                  <CardDescription>Policies Created by Society Office</CardDescription>
                </div>
                <Badge variant="secondary" className="bg-teal-500/10 text-teal-600 hover:bg-teal-500/20 border-teal-500/20">
                  {myGuidelines.length} Count
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-xl" />
                  ))}
                </div>
              ) : myGuidelines.length > 0 ? (
                <div className="space-y-4">
                  {myGuidelines.map((guideline: any) => (
                    <Card key={guideline.id} className="border-border hover:border-teal-500/50 transition-colors group relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <CardHeader className="p-4 flex flex-row items-start justify-between space-y-0">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-lg">{guideline.title}</h3>
                            <Badge variant="outline" className="text-[10px] uppercase tracking-wider">{guideline.category}</Badge>
                            <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/10 border-blue-500/20 text-[10px] font-bold">
                              TARGET: {guideline.targetAudience}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Last Updated: {new Date(guideline.updatedAt || guideline.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-teal-500/10 hover:text-teal-600"
                            onClick={() => handleEdit(guideline)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-red-500/10 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Policy?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{guideline.title}"? This cannot be undone and it will be removed for all users.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate(guideline.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete Permanently
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-foreground/80 whitespace-pre-wrap">{guideline.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-12 bg-muted/30 rounded-xl border border-dashed border-border text-center">
                  <Info className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground font-medium">No custom policies found</p>
                  <p className="text-xs text-muted-foreground mt-1">Start by creating a guideline for your society.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-[#1e3a5f] to-[#2d4a6f] text-white border-none">
            <CardHeader>
              <CardTitle className="text-lg">Global Platform Policies</CardTitle>
              <CardDescription className="text-white/70">Guidelines from Platform Administrators</CardDescription>
            </CardHeader>
            <CardContent>
              {globalGuidelines.length > 0 ? (
                <div className="space-y-3">
                  {globalGuidelines.map((guideline: any) => (
                    <div key={guideline.id} className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                      <h4 className="font-semibold text-sm">{guideline.title}</h4>
                      <p className="text-xs text-white/60 mt-1 line-clamp-2">{guideline.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-white/50 italic text-center py-4">No global guidelines currently active.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-teal-500">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-md flex items-center gap-2">
                <Info className="h-4 w-4 text-teal-500" />
                Management Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <ul className="text-xs space-y-2 text-muted-foreground">
                <li className="flex gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-teal-500 mt-1.5 flex-shrink-0" />
                  <span>Guidelines set to **Everyone** are visible to Residents, Guards, and Staff.</span>
                </li>
                <li className="flex gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-teal-500 mt-1.5 flex-shrink-0" />
                  <span>Use **Security Only** for SOPs meant strictly for Guards.</span>
                </li>
                <li className="flex gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-teal-500 mt-1.5 flex-shrink-0" />
                  <span>Residents will see these on their dashboard **Guidelines** section immediately.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Guideline</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Target Audience *</Label>
              <Select
                value={formData.targetAudience}
                onValueChange={(v) => setFormData({ ...formData, targetAudience: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Everyone</SelectItem>
                  <SelectItem value="RESIDENTS">Residents Only</SelectItem>
                  <SelectItem value="GUARDS">Security / Guards Only</SelectItem>
                  <SelectItem value="ADMINS">Society Staff / Admins Only</SelectItem>
                  <SelectItem value="VENDORS">Service Vendors Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => setFormData({ ...formData, category: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOCIETY">Society General</SelectItem>
                  <SelectItem value="SECURITY">Security & Safety</SelectItem>
                  <SelectItem value="AMENITIES">Facility Usage</SelectItem>
                  <SelectItem value="PARKING">Parking Rules</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Content *</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdate} 
              disabled={updateMutation.isPending}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {updateMutation.isPending ? 'Updating...' : 'Update Policy'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
