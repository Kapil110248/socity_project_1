'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { RoleGuard } from '@/components/auth/role-guard'
import {
  Plus,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Home,
  Users,
  UserCheck,
  UserX,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AdminResidentService } from '@/services/admin-resident.service'
import { toast } from 'sonner'

const stats = [
  {
    title: 'Total Units',
    value: '248',
    change: '+12',
    icon: Home,
    color: 'blue',
  },
  {
    title: 'Total Residents',
    value: '892',
    change: '+45',
    icon: Users,
    color: 'green',
  },
  {
    title: 'Active',
    value: '240',
    change: '+8',
    icon: UserCheck,
    color: 'purple',
  },
  {
    title: 'Vacant',
    value: '8',
    change: '-2',
    icon: UserX,
    color: 'orange',
  },
]

const residents = [
  {
    id: 'RES-001',
    unit: 'A-101',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91 98765 43210',
    members: 4,
    vehicles: 2,
    status: 'owner',
    joinDate: '2022-01-15',
    avatar: null,
  },
  {
    id: 'RES-002',
    unit: 'B-205',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91 98765 43211',
    members: 3,
    vehicles: 1,
    status: 'owner',
    joinDate: '2022-03-20',
    avatar: null,
  },
  {
    id: 'RES-003',
    unit: 'C-304',
    name: 'Amit Patel',
    email: 'amit.patel@email.com',
    phone: '+91 98765 43212',
    members: 2,
    vehicles: 1,
    status: 'tenant',
    joinDate: '2023-06-10',
    avatar: null,
  },
  {
    id: 'RES-004',
    unit: 'A-502',
    name: 'Neha Gupta',
    email: 'neha.gupta@email.com',
    phone: '+91 98765 43213',
    members: 5,
    vehicles: 3,
    status: 'owner',
    joinDate: '2021-11-05',
    avatar: null,
  },
  {
    id: 'RES-005',
    unit: 'D-108',
    name: 'Vikram Singh',
    email: 'vikram.singh@email.com',
    phone: '+91 98765 43214',
    members: 3,
    vehicles: 2,
    status: 'owner',
    joinDate: '2022-08-22',
    avatar: null,
  },
]

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [blockFilter, setBlockFilter] = useState('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'owner',
    unitId: '',
    familyMembers: ''
  })

  // Queries
  const { data: apiResidents = [], isLoading: residentsLoading } = useQuery({
    queryKey: ['admin-residents', blockFilter, statusFilter],
    queryFn: () => AdminResidentService.getResidents({
      block: blockFilter === 'all' ? undefined : blockFilter,
      type: 'directory'
    })
  })

  const { data: serverStats } = useQuery({
    queryKey: ['admin-resident-stats'],
    queryFn: () => AdminResidentService.getStats()
  })

  const { data: units = [] } = useQuery({
    queryKey: ['available-units'],
    queryFn: () => AdminResidentService.getUnits()
  })

  // Mutations
  const addResidentMutation = useMutation({
    mutationFn: AdminResidentService.addResident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-residents'] })
      queryClient.invalidateQueries({ queryKey: ['admin-resident-stats'] })
      setIsAddDialogOpen(false)
      toast.success('Resident added successfully')
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'owner',
        unitId: '',
        familyMembers: ''
      })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add resident')
    }
  })

  const filteredResidents = (apiResidents as any[]).filter((resident) => {
    const nameMatch = resident.name.toLowerCase().includes(searchQuery.toLowerCase())
    const emailMatch = resident.email?.toLowerCase().includes(searchQuery.toLowerCase())
    const phoneMatch = resident.phone?.includes(searchQuery)
    const unitMatch = (resident.unit?.block + '-' + resident.unit?.number).toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSearch = nameMatch || emailMatch || phoneMatch || unitMatch
    const matchesStatus = statusFilter === 'all' || resident.role?.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const handleAddResident = () => {
    if (!formData.name || !formData.email || !formData.unitId) {
      toast.error('Please fill in all required fields')
      return
    }
    addResidentMutation.mutate(formData)
  }

  const handleExportCSV = () => {
    if (filteredResidents.length === 0) {
      toast.error('No data to export')
      return
    }

    const headers = ['UID', 'Name', 'Unit', 'Email', 'Phone', 'Type', 'Join Date', 'Family Members', 'Vehicles']
    const csvContent = [
      headers.join(','),
      ...filteredResidents.map(r => [
        r.id,
        `"${r.name}"`,
        `"${r.unit ? `${r.unit.block}-${r.unit.number}` : 'N/A'}"`,
        r.email,
        r.phone || 'N/A',
        r.role,
        new Date(r.createdAt).toLocaleDateString(),
        r.familyMembersCount || 0,
        r.vehiclesCount || 0
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `resident_directory_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Directory exported successfully')
  }

  const residentStats = [
    {
      title: 'Total Units',
      value: serverStats?.units?.total || '0',
      change: '+0',
      icon: Home,
      color: 'blue',
    },
    {
      title: 'Total Residents',
      value: serverStats?.users?.totalResidents || '0',
      change: `+${serverStats?.users?.pending || 0}`,
      icon: Users,
      color: 'green',
    },
    {
      title: 'Owners',
      value: serverStats?.users?.owners || '0',
      change: 'Static',
      icon: UserCheck,
      color: 'purple',
    },
    {
      title: 'Tenants',
      value: serverStats?.users?.tenants || '0',
      change: 'Static',
      icon: UserX,
      color: 'orange',
    },
  ]

  return (
    <RoleGuard allowedRoles={['admin']}>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resident Directory</h1>
            <p className="text-gray-600 mt-1">
              View and manage all resident information
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="space-x-2" onClick={handleExportCSV}>
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Resident</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Resident</DialogTitle>
                  <DialogDescription>
                    Register a new resident to the society
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name *</Label>
                      <Input
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit Number *</Label>
                      <Select value={formData.unitId} onValueChange={(val) => setFormData({ ...formData, unitId: val })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {(units as any[]).map((unit) => (
                            <SelectItem key={unit.id} value={unit.id.toString()}>
                              {unit.block}-{unit.number}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Resident Type *</Label>
                      <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="owner">Owner</SelectItem>
                          <SelectItem value="tenant">Tenant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Family Members</Label>
                      <Input
                        type="number"
                        placeholder="4"
                        value={formData.familyMembers}
                        onChange={(e) => setFormData({ ...formData, familyMembers: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleAddResident}
                      disabled={addResidentMutation.isPending}
                    >
                      {addResidentMutation.isPending ? 'Adding...' : 'Add Resident'}
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {residentStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-2">
                        {stat.value}
                      </h3>
                      <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                    </div>
                    <div
                      className={`p-3 rounded-xl ${stat.color === 'blue'
                        ? 'bg-blue-100'
                        : stat.color === 'green'
                          ? 'bg-green-100'
                          : stat.color === 'purple'
                            ? 'bg-purple-100'
                            : 'bg-orange-100'
                        }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${stat.color === 'blue'
                          ? 'text-blue-600'
                          : stat.color === 'green'
                            ? 'text-green-600'
                            : stat.color === 'purple'
                              ? 'text-purple-600'
                              : 'text-orange-600'
                          }`}
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search by name, unit, email, or phone..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={blockFilter} onValueChange={setBlockFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Block" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Blocks</SelectItem>
                <SelectItem value="a">Block A</SelectItem>
                <SelectItem value="b">Block B</SelectItem>
                <SelectItem value="c">Block C</SelectItem>
                <SelectItem value="d">Block D</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="tenant">Tenant</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="space-x-2">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </Button>
          </div>
        </Card>

        {/* Residents Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resident</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Family Members</TableHead>
                <TableHead>Vehicles</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {residentsLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                    Loading residents...
                  </TableCell>
                </TableRow>
              ) : filteredResidents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                    No residents found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredResidents.map((resident: any) => (
                  <TableRow key={resident.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={resident.profileImg || undefined} />
                          <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white">
                            {resident.name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900">{resident.name}</p>
                          <p className="text-sm text-gray-500">UID: {resident.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-semibold">
                        {resident.unit ? `${resident.unit.block}-${resident.unit.number}` : 'No Unit'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">{resident.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-600">{resident.phone || 'N/A'}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{resident.familyMembersCount || 0}</TableCell>
                    <TableCell className="text-center">{resident.vehiclesCount || 0}</TableCell>
                    <TableCell>
                      <Badge
                        variant={resident.role === 'OWNER' ? 'default' : 'secondary'}
                        className={
                          resident.role === 'OWNER'
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                            : 'bg-purple-100 text-purple-700 hover:bg-purple-100'
                        }
                      >
                        {resident.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(resident.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="View Details"
                          onClick={() => alert(`Resident Details:\n\nID: ${resident.id}\nName: ${resident.name}\nUnit: ${resident.unit ? `${resident.unit.block}-${resident.unit.number}` : 'None'}\nEmail: ${resident.email}\nPhone: ${resident.phone}\nType: ${resident.role}\nJoined: ${new Date(resident.createdAt).toLocaleDateString()}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Send Email"
                          onClick={() => window.location.href = `mailto:${resident.email}?subject=Message from Society Management`}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </RoleGuard>
  )
}
