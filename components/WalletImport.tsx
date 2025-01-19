import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function WalletImport(props : any) {
  const [privateKey, setPrivateKey] = useState('')
  const [password, setPassword] = useState('')

  const handleImport = (e : any) => {
    e.preventDefault()
    props.onImportWallet(privateKey, password)
  }

  return (
    <form onSubmit={handleImport} className="space-y-4">
      <div>
        <Label htmlFor="privateKey">Private Key</Label>
        <Input 
          id="privateKey" 
          value={privateKey} 
          onChange={(e) => setPrivateKey(e.target.value)}
          placeholder="Enter your private key"
          required
        />
      </div>
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
      <Button type="submit" className="w-full">Import Wallet</Button>
    </form>
  )
}

