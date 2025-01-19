'use client'

import React, { useState } from 'react'
import { QrReader } from 'react-qr-reader'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function QRCodeScanner(props: any) {
  const [isOpen, setIsOpen] = useState(false)

  const handleScan = (result: any) => {
    if (result) {
      props.onScan(result.text)
      setIsOpen(false)
    }
  }

  const handleError = (error: any) => {
    console.error(error)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Scan QR Code</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scan QR Code</DialogTitle>
        </DialogHeader>
        <QrReader
          onResult={handleScan}
          constraints={{ facingMode: 'environment' }}
          containerStyle={{ width: '100%' }}
        />
      </DialogContent>
    </Dialog>
  )
}

