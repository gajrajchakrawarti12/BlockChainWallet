import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function WalletCreation(props : any) {
    const [password, setPassword] = useState('')
  
  return (
    <div className="space-y-4">
      <p>Create a new blockchain wallet by generating a new private/public key pair.</p>
      <div>
      <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          type="password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter a password to encrypt your private key"
          required
        />
      </div>
      <Button onClick={() => {
        props.onCreateWallet(password)
      }} className="w-full">Create New Wallet</Button>

    </div>
  )
}

