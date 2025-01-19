'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { estimateGasCost } from '../lib/ftrBlockchain'
import QRCodeScanner from './QRCodeScanner'

export default function SendForm(props: any) {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [gasEstimate, setGasEstimate] = useState('')

  const handleSend = async (e: any) => {
    e.preventDefault()
    setError('')
    try {
      await props.onSendTransaction(recipient, amount, password)
      setRecipient('')
      setAmount('')
      setPassword('')
      setGasEstimate('')
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleAmountChange = async (e: any) => {
    const newAmount = e.target.value;
    setAmount(newAmount)
    if (newAmount && recipient) {
      try {
        const estimate = await estimateGasCost(props.walletAddress, recipient, newAmount)
        setGasEstimate(estimate)
      } catch (error) {
        console.error("Error estimating gas:", error)
        setGasEstimate('')
      }
    } else {
      setGasEstimate('')
    }
  }

  const handleQRScan = (data: string) => {
    try {
      const scannedData = JSON.parse(data)
      if (scannedData.address) {
        setRecipient(scannedData.address)
      }
      if (scannedData.amount) {
        setAmount(scannedData.amount)
        handleAmountChange({ target: { value: scannedData.amount } })
      }
    } catch (error) {
      // If it's not JSON, assume it's just an address
      setRecipient(data)
    }
  }

  useEffect(() => {
    if (amount && recipient) {
      handleAmountChange({ target: { value: amount } })
    }
  }, [recipient])

  return (
    <form onSubmit={handleSend} className="space-y-4">
      <div>
        <Label htmlFor="recipient">Recipient Address</Label>
        <div className="flex space-x-2">
          <Input 
            id="recipient" 
            value={recipient} 
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="FTR..."
            required
          />
          <QRCodeScanner onScan={handleQRScan} />
        </div>
      </div>
      <div>
        <Label htmlFor="amount">Amount (FTR)</Label>
        <Input 
          id="amount" 
          type="number" 
          value={amount} 
          onChange={handleAmountChange}
          placeholder="0.00"
          required
          min="0"
          step="0.000001"
        />
      </div>
      {gasEstimate && (
        <div className="text-sm text-gray-500">
          Estimated gas cost: {gasEstimate} FTR
        </div>
      )}
      <div>
        <Label htmlFor="password">Wallet Password</Label>
        <Input 
          id="password" 
          type="password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your wallet password"
          required
        />
      </div>
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <Button type="submit" className="w-full">Send FTR</Button>
    </form>
  )
}

