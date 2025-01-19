'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy } from 'lucide-react'

export default function ReceiveForm(props: any) {
  interface QRData{
    address?: string;
    amount?: string;
  };

  const [amount, setAmount] = useState('')

  const copyAddress = () => {
    navigator.clipboard.writeText(props.address)
      .then(() => alert('Address copied to clipboard!'))
      .catch(err => console.error('Failed to copy address: ', err))
  }

  const getQRCodeData = () => {
    const data: QRData = {};
    data.address = props.address;
    if (amount) {
      data.amount = amount
    }
    return JSON.stringify(data);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <QRCodeSVG value={getQRCodeData()} size={200} />
      </div>
      <div>
        <Label htmlFor="receive-address">Your Address</Label>
        <div className="flex mt-1">
          <Input id="receive-address" value={props.address} readOnly className="flex-grow" />
          <Button variant="outline" className="ml-2" onClick={copyAddress}>
            <Copy className="h-4 w-4 mr-2" /> Copy
          </Button>
        </div>
      </div>
      <div>
        <Label htmlFor="receive-amount">Amount (Optional)</Label>
        <Input 
          id="receive-amount" 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          min="0"
          step="0.000001"
        />
      </div>
    </div>
  )
}

