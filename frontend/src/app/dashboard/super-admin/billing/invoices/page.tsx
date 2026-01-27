'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  Search,
  Filter,
  Download,
  Building2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Send,
  Calendar,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { RoleGuard } from '@/components/auth/role-guard'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

import { toast } from 'react-hot-toast'

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const queryClient = useQueryClient()

  const { data: invoices = [], isLoading } = useQuery<any[]>({
    queryKey: ['platform-invoices'],
    queryFn: async () => {
      const response = await api.get('/platform-invoices')
      return response.data
    }
  })

  // Fetch Stats from API
  const { data: apiStats } = useQuery({
    queryKey: ['platform-invoices-stats'],
    queryFn: async () => {
      const response = await api.get('/platform-invoices/stats')
      return response.data
    }
  })

  const updateStatusMutation = async (id: number, status: string) => {
    try {
      await api.patch(`/platform-invoices/${id}/status`, { status })
      toast.success(`Invoice marked as ${status}`)
      queryClient.invalidateQueries({ queryKey: ['platform-invoices'] })
      queryClient.invalidateQueries({ queryKey: ['platform-invoices-stats'] })
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const generateInvoices = async () => {
    const t = toast.loading('Generating invoices for all active societies...')
    try {
      const response = await api.post('/platform-invoices/generate')
      toast.dismiss(t)
      toast.success(response.data.message || 'Invoices generated successfully')
      queryClient.invalidateQueries({ queryKey: ['platform-invoices'] })
      queryClient.invalidateQueries({ queryKey: ['platform-invoices-stats'] })
    } catch (error: any) {
      toast.dismiss(t)
      toast.error(error.response?.data?.error || 'Failed to generate invoices')
    }
  }

  const exportInvoices = () => {
    if (invoices.length === 0) return toast.error('No invoices to export')
    
    // Create CSV content with proper escaping
    const headers = ['Invoice No', 'Society', 'Amount', 'Status', 'Issue Date', 'Due Date']
    const rows = invoices.map(inv => [
      inv.invoiceNo,
      `"${(inv.societyName || '').replace(/"/g, '""')}"`,
      inv.amountRaw || 0,
      inv.status,
      new Date(inv.issueDate).toLocaleDateString(),
      new Date(inv.dueDate).toLocaleDateString()
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `platform_invoices_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast.success('CSV Exported Successfully')
  }

  const downloadInvoice = (invoice: any) => {
    const html = `
      <html>
        <head>
          <title>Invoice - ${invoice.invoiceNo}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; }
            .invoice-title { font-size: 24px; font-weight: bold; color: #7c3aed; }
            .details { margin-top: 30px; display: grid; grid-template-cols: 1fr 1fr; gap: 40px; }
            .section-title { font-size: 14px; color: #666; text-transform: uppercase; margin-bottom: 5px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 40px; }
            .table th { text-align: left; background: #f9fafb; padding: 12px; border-bottom: 1px solid #eee; }
            .table td { padding: 12px; border-bottom: 1px solid #eee; }
            .total-row { font-weight: bold; background: #f9fafb; }
            .footer { margin-top: 50px; text-align: center; color: #999; font-size: 12px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="invoice-title">IGATESECURITY</div>
              <p>Platform Management System</p>
            </div>
            <div style="text-align: right">
              <h2 style="margin: 0">INVOICE</h2>
              <p style="font-family: monospace; font-weight: bold;">#${invoice.invoiceNo}</p>
            </div>
          </div>

          <div class="details">
            <div style="display: inline-block; width: 45%;">
              <div class="section-title">Bill To:</div>
              <div style="font-weight: bold; font-size: 18px;">${invoice.societyName}</div>
              <div>${invoice.society?.address || ''}</div>
              <div>${invoice.society?.city || ''}, ${invoice.society?.state || ''} ${invoice.society?.pincode || ''}</div>
            </div>
            <div style="display: inline-block; width: 45%; text-align: right; vertical-align: top;">
              <div class="section-title">Invoice Date:</div>
              <div style="font-weight: bold;">${new Date(invoice.issueDate).toLocaleDateString()}</div>
              <div class="section-title" style="margin-top: 15px;">Due Date:</div>
              <div style="font-weight: bold; color: ${invoice.status === 'OVERDUE' ? 'red' : 'inherit'}">${new Date(invoice.dueDate).toLocaleDateString()}</div>
              <div class="section-title" style="margin-top: 15px;">Status:</div>
              <div style="font-weight: bold;">${invoice.status}</div>
            </div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Platform Subscription Fee - ${invoice.society?.subscriptionPlan || 'STANDARD'}</td>
                <td style="text-align: right">${invoice.amount}</td>
              </tr>
              <tr class="total-row">
                <td>Total Amount Due</td>
                <td style="text-align: right; color: #7c3aed;">${invoice.amount}</td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            <p>This is a computer generated invoice and does not require a physical signature.</p>
            <p>Thank you for choosing IGATESECURITY!</p>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const win = window.open(url, '_blank')
    if (win) {
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } else {
      toast.error('Please allow popups to download/print the invoice')
    }
  }

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.societyName?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter.toUpperCase()
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        )
      case 'PENDING':
        return (
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case 'OVERDUE':
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Overdue
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const stats = {
    total: apiStats?.total ?? 0,
    paid: apiStats?.paid ?? 0,
    pending: apiStats?.pending ?? 0,
    overdue: apiStats?.overdue ?? 0,
  }

  return (
    <RoleGuard allowedRoles={['super_admin']}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
            <p className="text-gray-600">View and manage platform invoices</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportInvoices}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={generateInvoices}>
              <FileText className="h-4 w-4 mr-2" />
              Generate Invoices
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-gray-500">Total Invoices</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.paid}</p>
                  <p className="text-sm text-gray-500">Paid</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-gray-500">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.overdue}</p>
                  <p className="text-sm text-gray-500">Overdue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by invoice ID or society..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                Date Range
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>All Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Society</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </TableCell>
                  </TableRow>
                ) : filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                      No invoices found
                    </TableCell>
                  </TableRow>
                ) : (
                    filteredInvoices.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell className="font-mono font-medium">{inv.invoiceNo}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            {inv.societyName}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{inv.amount}</TableCell>
                        <TableCell>{getStatusBadge(inv.status)}</TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(inv.issueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(inv.dueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => setSelectedInvoice(inv)}
                              title="View Invoice"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => downloadInvoice(inv)}
                              title="Download/Print PDF"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            {inv.status !== 'PAID' && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => {
                                  if (confirm('Mark this invoice as PAID?')) {
                                    updateStatusMutation(inv.id, 'PAID')
                                  }
                                }}
                                title="Mark as Paid"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* View Invoice Modal */}
          <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Invoice Details</DialogTitle>
                <DialogDescription>
                  Detailed view of invoice {selectedInvoice?.invoiceNo}
                </DialogDescription>
              </DialogHeader>
              {selectedInvoice && (
                <div className="space-y-6 py-4">
                  <div className="flex justify-between border-b pb-4">
                    <div>
                      <p className="text-sm text-gray-500">Invoice To</p>
                      <p className="text-lg font-bold">{selectedInvoice.societyName}</p>
                      <p className="text-sm text-gray-500">{selectedInvoice.society?.address || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Invoice No</p>
                      <p className="text-lg font-mono font-bold">{selectedInvoice.invoiceNo}</p>
                      <div className="mt-1">{getStatusBadge(selectedInvoice.status)}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Issue Date</p>
                      <p className="font-medium">{new Date(selectedInvoice.issueDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Due Date</p>
                      <p className="font-medium text-red-600">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Platform Subscription Fee ({selectedInvoice.society?.subscriptionPlan || 'Default'})</TableCell>
                          <TableCell className="text-right font-medium">{selectedInvoice.amount}</TableCell>
                        </TableRow>
                        <TableRow className="bg-gray-50 font-bold">
                          <TableCell>Total Amount</TableCell>
                          <TableCell className="text-right text-purple-600">{selectedInvoice.amount}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {selectedInvoice.status === 'PAID' && (
                    <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Paid on {new Date(selectedInvoice.paidDate).toLocaleString()}
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
      </motion.div>
    </RoleGuard>
  )
}
