"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
    Receipt,
    Wallet,
    History,
    CreditCard,
    Download,
    FileText,
    AlertCircle,
    ChevronRight,
    Search,
    Filter
} from "lucide-react"
import { format } from "date-fns"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { societyReceiptService } from "@/services/society-receipt.service"
import { BillingService } from "@/services/billing.service"
import { residentService } from "@/services/resident.service"
import { RoleGuard } from "@/components/auth/role-guard"

export default function SocietyDuesPage() {
    const [activeTab, setActiveTab] = useState("overview")
    const queryClient = useQueryClient()

    // Fetch Dashboard Data (for summary)
    const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
        queryKey: ["residentDashboard"],
        queryFn: () => residentService.getDashboardData()
    })

    // Fetch Unit Data (to get unitId)
    const { data: unitData, isLoading: unitLoading } = useQuery({
        queryKey: ["unitData"],
        queryFn: () => residentService.getUnitData()
    })

    // Fetch Invoices
    const { data: invoices, isLoading: invoicesLoading } = useQuery({
        queryKey: ["invoices"],
        queryFn: () => BillingService.getInvoices(),
        enabled: !!unitData
    })

    // Fetch Receipts
    const { data: receipts, isLoading: receiptsLoading } = useQuery({
        queryKey: ["societyReceipts"],
        queryFn: () => societyReceiptService.listReceipts(),
        enabled: !!unitData
    })

    // Fetch Wallet
    const { data: wallet, isLoading: walletLoading } = useQuery({
        queryKey: ["walletBalance", unitData?.id],
        queryFn: () => societyReceiptService.getWalletBalance(unitData.id),
        enabled: !!unitData
    })

    // Fetch Wallet Transactions
    const { data: walletTransactions, isLoading: walletTxLoading } = useQuery({
        queryKey: ["walletTransactions", unitData?.id],
        queryFn: () => societyReceiptService.listWalletTransactions(unitData.id),
        enabled: !!unitData
    })

    const handleDownloadReceipt = (receiptId: number) => {
        toast.info("Downloading receipt...")
        // Simulate download for now
        window.open(`${process.env.NEXT_PUBLIC_API_URL}/society-dues/receipts/${receiptId}/pdf`, '_blank')
    }

    if (dashboardLoading || unitLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <RoleGuard allowedRoles={['resident']}>
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Society Dues</h1>
                    <p className="text-muted-foreground">Manage your maintenance payments and financial records.</p>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Outstanding Dues</CardTitle>
                            <CreditCard className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹{dashboardData?.dues?.amount || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                {dashboardData?.dues?.penalty > 0 ? `Includes ₹${dashboardData.dues.penalty} penalty` : 'No penalty accrued'}
                            </p>
                            <Button className="w-full mt-4" size="sm">Pay Now</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Advance Balance</CardTitle>
                            <Wallet className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹{wallet?.advanceBalance || 0}</div>
                            <p className="text-xs text-muted-foreground">Available for adjustment</p>
                            <Button variant="outline" className="w-full mt-4" size="sm">Add Advance</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Security Deposit</CardTitle>
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹{wallet?.securityDepositBalance || 0}</div>
                            <p className="text-xs text-muted-foreground">Refundable deposit</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Last Receipt</CardTitle>
                            <Receipt className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-semibold truncate">
                                {receipts && receipts.length > 0 ? receipts[0].receiptNo : 'No receipts'}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {receipts && receipts.length > 0 ? format(new Date(receipts[0].date), 'dd MMM yyyy') : '-'}
                            </p>
                            {receipts && receipts.length > 0 && (
                                <Button variant="ghost" className="w-full mt-2" size="sm" onClick={() => handleDownloadReceipt(receipts[0].id)}>
                                    <Download className="h-3 w-3 mr-2" /> Download
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Invoices</TabsTrigger>
                        <TabsTrigger value="receipts">Receipts</TabsTrigger>
                        <TabsTrigger value="wallet">Wallet History</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Invoices</CardTitle>
                                <CardDescription>List of all maintenance and utility invoices.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Invoice No</TableHead>
                                            <TableHead>Issue Date</TableHead>
                                            <TableHead>Due Date</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {invoicesLoading ? (
                                            <TableRow><TableCell colSpan={6} className="text-center py-10">Loading...</TableCell></TableRow>
                                        ) : invoices?.length === 0 ? (
                                            <TableRow><TableCell colSpan={6} className="text-center py-10">No invoices found.</TableCell></TableRow>
                                        ) : (
                                            invoices?.map((invoice: any) => (
                                                <TableRow key={invoice.id}>
                                                    <TableCell className="font-medium">{invoice.invoiceNo}</TableCell>
                                                    <TableCell>{format(new Date(invoice.createdAt), 'dd MMM yyyy')}</TableCell>
                                                    <TableCell>{format(new Date(invoice.dueDate), 'dd MMM yyyy')}</TableCell>
                                                    <TableCell className="font-semibold">₹{invoice.amount}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={invoice.status === 'paid' ? 'outline' : invoice.status === 'overdue' ? 'destructive' : 'secondary'} className={invoice.status === 'paid' ? 'text-green-600 border-green-200' : ''}>
                                                            {invoice.status.toUpperCase()}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {invoice.status !== 'paid' ? (
                                                            <Button size="sm">Pay</Button>
                                                        ) : (
                                                            <Button variant="outline" size="sm">View</Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="receipts" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Receipts</CardTitle>
                                <CardDescription>View and download your payment confirmations.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {receiptsLoading ? (
                                        <p>Loading receipts...</p>
                                    ) : receipts?.map((receipt: any) => (
                                        <Card key={receipt.id} className="overflow-hidden">
                                            <div className="bg-primary/5 p-4 flex items-center justify-between">
                                                <Badge variant="outline">{receipt.receiptNo}</Badge>
                                                <span className="text-xs text-muted-foreground">{format(new Date(receipt.date), 'dd MMM yyyy')}</span>
                                            </div>
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <p className="text-sm text-muted-foreground">Amount Paid</p>
                                                        <p className="text-2xl font-bold">₹{receipt.amount}</p>
                                                    </div>
                                                    <div className="text-right text-xs">
                                                        <p className="text-muted-foreground">Mode</p>
                                                        <p className="font-medium underline decoration-primary decoration-2">{receipt.paymentMethod}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
                                                    {receipt.breakups?.map((b: any, idx: number) => (
                                                        <Badge key={idx} variant="secondary" className="text-[10px]">
                                                            {b.invoice?.invoiceNo || b.description}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </CardContent>
                                            <CardFooter className="p-4 bg-muted/50">
                                                <Button className="w-full" variant="outline" size="sm" onClick={() => handleDownloadReceipt(receipt.id)}>
                                                    <Download className="h-4 w-4 mr-2" /> Download Receipt
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                    {receipts?.length === 0 && (
                                        <div className="col-span-full py-10 text-center text-muted-foreground">
                                            No receipts found.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="wallet" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Wallet Transactions</CardTitle>
                                <CardDescription>History of your advance and security deposit transactions.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Purpose</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {walletTxLoading ? (
                                            <TableRow><TableCell colSpan={5} className="text-center py-10">Loading...</TableCell></TableRow>
                                        ) : walletTransactions?.length === 0 ? (
                                            <TableRow><TableCell colSpan={5} className="text-center py-10">No transactions found.</TableCell></TableRow>
                                        ) : (
                                            walletTransactions?.map((tx: any) => (
                                                <TableRow key={tx.id}>
                                                    <TableCell>{format(new Date(tx.date), 'dd MMM yyyy HH:mm')}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={tx.type === 'CREDIT' ? 'outline' : 'destructive'} className={tx.type === 'CREDIT' ? 'text-green-600 border-green-200' : ''}>
                                                            {tx.type}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{tx.purpose.replace('_', ' ')}</Badge>
                                                    </TableCell>
                                                    <TableCell className="max-w-xs truncate">{tx.description}</TableCell>
                                                    <TableCell className={`text-right font-bold ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                                                        {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </RoleGuard>
    )
}
