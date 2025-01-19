'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import WalletCreation from './WalletCreation'
import WalletImport from './WalletImport'
import Balance from './Balance'
import TransactionList from './TransactionList'
import SendForm from './SendForm'
import ReceiveForm from './ReceiveForm'
import { createNewWallet, importWallet, getWalletBalance, sendTransaction, encryptPrivateKey, decryptPrivateKey, switchNetwork, getCurrentNetwork, getTransactionHistory } from '../lib/ftrBlockchain'
import { Wallet } from 'lucide-react'

export default function FTRWallet() {
  interface Wallet {
    address: string;
    privateKey: string;
    publicKey: string;
    mnemonicPhrase?: string | undefined;
  }
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [encryptedPrivateKey, setEncryptedPrivateKey] = useState<string | null>(null)
  const [balance, setBalance] = useState("0.0")
  const [transactions, setTransactions] = useState<string | {} | [] | null>(null);
  const [network, setNetwork] = useState(getCurrentNetwork())

  useEffect(() => {
    if (wallet) {
      fetchBalance()
      fetchTransactions()
    }
  }, [wallet, network])

  const fetchBalance = async () => {
    if (wallet) {
      const newBalance = await getWalletBalance(wallet.address)
      if (newBalance !== null) {
        setBalance(newBalance)
      }
    }
  }

  const fetchTransactions = async () => {
    if (wallet) {
      const history = await getTransactionHistory(wallet.address)
      setTransactions(history)
    }
  }

  const handleCreateWallet = async (password : string) => {
    const newWallet = createNewWallet()
    setWallet(newWallet)
    if (password) {
      const encrypted = encryptPrivateKey(newWallet.privateKey, password)
      setEncryptedPrivateKey(encrypted)
    }
  }

  const handleImportWallet = async (privateKey : string, password : string) => {
    const importedWallet = importWallet(privateKey)
    if (importedWallet) {
      setWallet(importedWallet)
      const encrypted = encryptPrivateKey(privateKey, password)
      setEncryptedPrivateKey(encrypted)
    }
  }

  const handleSendTransaction = async (recipient: string, amount: string, password: string) => {
    if (wallet && encryptedPrivateKey) {
      const decryptedPrivateKey = decryptPrivateKey(encryptedPrivateKey, password)
      if (decryptedPrivateKey) {
        try {
          const transaction = await sendTransaction(decryptedPrivateKey, recipient, amount)
          console.log('Transaction sent:', transaction)
          fetchBalance()
          fetchTransactions()
        } catch (error) {
          console.error("Error sending transaction:", error)
          throw error
        }
      } else {
        throw new Error("Failed to decrypt private key. Incorrect password.")
      }
    }
  }

  const handleNetworkChange = (newNetwork: string) => {
    switchNetwork(newNetwork)
    setNetwork(newNetwork)
  }

  if (!wallet) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>FTR Blockchain Wallet</CardTitle>
            <CardDescription>Create or import your wallet</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="create">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="create">Create Wallet</TabsTrigger>
                <TabsTrigger value="import">Import Wallet</TabsTrigger>
              </TabsList>
              <TabsContent value="create">
                <WalletCreation onCreateWallet={handleCreateWallet} />
              </TabsContent>
              <TabsContent value="import">
                <WalletImport onImportWallet={handleImportWallet} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>FTR Blockchain Wallet</CardTitle>
          <CardDescription>Manage your Future (FTR) cryptocurrency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Wallet Address</p>
                <p className="font-mono">{wallet.address}</p>
              </div>
              <Select value={network} onValueChange={handleNetworkChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mainnet">Mainnet</SelectItem>
                  <SelectItem value="testnet">Testnet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Balance balance={balance} onRefresh={fetchBalance} />
            <Tabs defaultValue="transactions">
              <TabsList>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="send">Send</TabsTrigger>
                <TabsTrigger value="receive">Receive</TabsTrigger>
              </TabsList>
              <TabsContent value="transactions">
                <TransactionList transactions={transactions} onRefresh={fetchTransactions} wallet={wallet}/>
              </TabsContent>
              <TabsContent value="send">
                <SendForm onSendTransaction={handleSendTransaction} walletAddress={wallet.address} />
              </TabsContent>
              <TabsContent value="receive">
                <ReceiveForm address={wallet.address} />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

