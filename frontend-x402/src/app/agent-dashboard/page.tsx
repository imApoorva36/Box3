'use client'

import { useState, useEffect } from 'react'
import { Package, Truck, CheckCircle, AlertCircle, BarChart3, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React from "react";
import dynamic from "next/dynamic";
import { useAppContext } from '@/components/AppContext'
import { useAccount } from 'wagmi'

const WebcamCaptureModal = dynamic(
  () => import("@/components/WebcamCapture"),
  { ssr: false }
);

// Mock data
const mockOrders = [
  { id: 1, customer: '0x1234...5678', metadata: 'Books', status: 'Pending', value: 0.01 },
  { id: 2, customer: '0x2345...6789', metadata: 'Electronics', status: 'Pending', value: 0.05 },
  { id: 3, customer: '0x3456...7890', metadata: 'Clothing', status: 'Pending', value: 0.02 },
]

const mockPackages = [
  { id: 1, cid: 'Qm...1', metadata: 'Books', customer: '0x1234...5678', delivered: false, fundsReleased: false, funds: 0.01 },
]

export default function AgentDashboard() {
  const [orders, setOrders] = useState(mockOrders)
  const [packages, setPackages] = useState(mockPackages)
  const [isLoading, setIsLoading] = useState(true)
  const { account } = useAppContext();
  const { isConnected } = useAccount();

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  if (!isConnected) {
      return <div className="p-8 text-center">Please connect your wallet.</div>
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Agent Dashboard</h1>
      
      <Tabs defaultValue="packages">
        <TabsList>
          <TabsTrigger value="packages">Active Packages</TabsTrigger>
          <TabsTrigger value="orders">New Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="packages">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {packages.map(pkg => (
                    <Card key={pkg.id}>
                        <CardHeader><CardTitle>Package #{pkg.id}</CardTitle></CardHeader>
                        <CardContent>
                            <p>Customer: {pkg.customer}</p>
                            <p>Status: {pkg.delivered ? 'Delivered' : 'In Transit'}</p>
                        </CardContent>
                        <CardFooter>
                            {!pkg.delivered && (
                                <WebcamCaptureModal 
                                    onCapture={(img) => console.log("Captured", img)} 
                                    packageId={pkg.id}
                                />
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </TabsContent>
        <TabsContent value="orders">
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {orders.map(order => (
                    <Card key={order.id}>
                        <CardHeader><CardTitle>Order #{order.id}</CardTitle></CardHeader>
                        <CardContent>
                            <p>Item: {order.metadata}</p>
                            <p>Value: {order.value} ETH</p>
                        </CardContent>
                        <CardFooter>
                            <Button>Accept Order</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
