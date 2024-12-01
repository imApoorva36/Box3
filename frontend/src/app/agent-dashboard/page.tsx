'use client'

import { useState, useEffect } from 'react'
import { Package, Truck, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock data to simulate fetching from the blockchain
const mockPackages = [
  { id: 1, cid: 'Qm...1', metadata: 'Books', customer: '0x1234...5678', delivered: false, fundsReleased: false, funds: 50 },
  { id: 2, cid: 'Qm...2', metadata: 'Electronics', customer: '0x2345...6789', delivered: true, fundsReleased: false, funds: 200 },
  { id: 3, cid: 'Qm...3', metadata: 'Clothing', customer: '0x3456...7890', delivered: true, fundsReleased: true, funds: 75 },
  { id: 4, cid: 'Qm...4', metadata: 'Furniture', customer: '0x4567...8901', delivered: false, fundsReleased: false, funds: 300 },
  { id: 5, cid: 'Qm...5', metadata: 'Groceries', customer: '0x5678...9012', delivered: false, fundsReleased: false, funds: 100 },
]

export default function DeliveryAgentDashboard() {
  const [packages, setPackages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, delivered: 0, pending: 0, totalValue: 0 })

  useEffect(() => {
    // Simulating API call to fetch packages from the blockchain
    const fetchPackages = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate network delay
      setPackages(mockPackages)
      setIsLoading(false)
      calculateStats(mockPackages)
    }

    fetchPackages()
  }, [])

  const calculateStats = (pkgs) => {
    const total = pkgs.length
    const delivered = pkgs.filter(pkg => pkg.delivered).length
    const pending = total - delivered
    const totalValue = pkgs.reduce((sum, pkg) => sum + pkg.funds, 0)
    setStats({ total, delivered, pending, totalValue })
  }

  const getStatusIcon = (delivered: boolean, fundsReleased: boolean) => {
    if (fundsReleased) return <CheckCircle className="h-5 w-5 text-green-500" />
    if (delivered) return <Truck className="h-5 w-5 text-blue-500" />
    return <Package className="h-5 w-5 text-yellow-500" />
  }

  const getStatusText = (delivered: boolean, fundsReleased: boolean) => {
    if (fundsReleased) return 'Completed'
    if (delivered) return 'Delivered'
    return 'In Transit'
  }

  const handleMarkAsDelivered = async (packageId: number) => {
    // Here you would call the smart contract function to mark as delivered
    console.log(`Marking package ${packageId} as delivered`)
    // For demo purposes, we'll just update the local state
    const updatedPackages = packages.map(pkg => 
      pkg.id === packageId ? { ...pkg, delivered: true } : pkg
    )
    setPackages(updatedPackages)
    calculateStats(updatedPackages)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Delivery Agent Dashboard</h1>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Packages" value={stats.total} icon={<Package className="h-8 w-8" />} />
        <StatCard title="Delivered" value={stats.delivered} icon={<Truck className="h-8 w-8" />} />
        <StatCard title="Pending" value={stats.pending} icon={<AlertCircle className="h-8 w-8" />} />
        <StatCard title="Total Value" value={`$${stats.totalValue}`} icon={<BarChart3 className="h-8 w-8" />} />
      </div>

      {/* Package Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Packages</CardTitle>
          <CardDescription>Manage and track all packages in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-4">
              <AlertCircle className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
              <p className="text-lg font-semibold">No packages found</p>
              <p className="text-sm text-muted-foreground">New packages will appear here when created</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>CID</TableHead>
                  <TableHead>Contents</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell>{pkg.id}</TableCell>
                    <TableCell>{pkg.cid}</TableCell>
                    <TableCell>{pkg.metadata}</TableCell>
                    <TableCell>{pkg.customer}</TableCell>
                    <TableCell>${pkg.funds}</TableCell>
                    <TableCell>
                      <Badge variant={pkg.fundsReleased ? 'default' : pkg.delivered ? 'secondary' : 'outline'}>
                        {getStatusIcon(pkg.delivered, pkg.fundsReleased)}
                        <span className="ml-2">{getStatusText(pkg.delivered, pkg.fundsReleased)}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {!pkg.delivered && (
                        <Button size="sm" onClick={() => handleMarkAsDelivered(pkg.id)}>
                          Mark Delivered
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Package Form */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Add New Package</CardTitle>
          <CardDescription>Create a new package in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="metadata">Package Contents</Label>
                <Input id="metadata" placeholder="e.g., Electronics, Books" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer">Customer Address</Label>
                <Input id="customer" placeholder="0x..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="funds">Package Value ($)</Label>
                <Input id="funds" type="number" placeholder="100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cid">CID</Label>
                <Input id="cid" placeholder="Qm..." />
              </div>
            </div>
            <Button className="w-full">Create Package</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ title, value, icon }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

