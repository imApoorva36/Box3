'use client'

import { useState, useEffect } from 'react'
import { Package, Truck, CheckCircle, AlertCircle, Plus, Lock, Unlock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAppContext } from '@/components/AppContext'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'

// Mock data
const mockPackages = [
  { id: 1, cid: 'Qm...1', metadata: 'Books', delivered: false, paid: false, funds: 0.01 },
  { id: 2, cid: 'Qm...2', metadata: 'Electronics', delivered: true, paid: false, funds: 0.05 },
  { id: 3, cid: 'Qm...3', metadata: 'Clothing', delivered: true, paid: true, funds: 0.02 },
]

export default function CustomerDashboard() {
  interface Package {
    id: number;
    cid: string;
    metadata: string;
    delivered: boolean;
    paid: boolean;
    funds: number
  }

  const [packages, setPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { account } = useAppContext();
  const router = useRouter();
  const { isConnected } = useAccount();

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setPackages(mockPackages)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handlePayAndOpen = (pkg: Package) => {
      // Redirect to paywall with package ID
      // In a real app, we'd pass the ID via query param or context
      router.push(`/paywall?packageId=${pkg.id}`);
  };

  const handleOpenBox = (pkg: Package) => {
      console.log("Opening box...", pkg.id);
      // Call box opening API
  };

  if (!isConnected) {
      return <div className="p-8 text-center">Please connect your wallet.</div>
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Packages</h1>
          <p className="text-muted-foreground">Manage your incoming deliveries</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Order
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
              <DialogDescription>Enter the details for your new package delivery.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="item" className="text-right">Item</Label>
                <Input id="item" placeholder="e.g., Laptop" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="value" className="text-right">Value (ETH)</Label>
                <Input id="value" placeholder="0.1" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create Order</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <Card key={pkg.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Package #{pkg.id}</span>
                  <Badge variant={pkg.delivered ? "default" : "secondary"}>
                    {pkg.delivered ? "Delivered" : "In Transit"}
                  </Badge>
                </CardTitle>
                <CardDescription>CID: {pkg.cid}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Package className="mr-2 h-4 w-4 opacity-70" />
                    <span className="font-semibold">Content:</span> {pkg.metadata}
                  </div>
                  <div className="flex items-center">
                    <Truck className="mr-2 h-4 w-4 opacity-70" />
                    <span className="font-semibold">Status:</span> {pkg.delivered ? "Arrived" : "On the way"}
                  </div>
                  <div className="flex items-center">
                    {pkg.paid ? (
                        <Unlock className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                        <Lock className="mr-2 h-4 w-4 text-red-500" />
                    )}
                    <span className="font-semibold">Payment:</span> {pkg.paid ? "Paid" : "Pending"}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {pkg.delivered && !pkg.paid && (
                  <Button className="w-full" onClick={() => handlePayAndOpen(pkg)}>
                    Pay to Open ({pkg.funds} ETH)
                  </Button>
                )}
                {pkg.delivered && pkg.paid && (
                  <Button className="w-full" variant="outline" onClick={() => handleOpenBox(pkg)}>
                    Open Box
                  </Button>
                )}
                {!pkg.delivered && (
                  <Button className="w-full" disabled>
                    Track Package
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
