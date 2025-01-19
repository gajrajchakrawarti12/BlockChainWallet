import { Button } from "@/components/ui/button"
import { RefreshCw } from 'lucide-react'

export default function TransactionList(props: any) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <Button variant="outline" size="sm" onClick={props.onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>
      <div className="space-y-2">{!props.transactions ? (<span className="font-medium">Transaction not found</span>
      ) : 
        (props.transactions.map((tx: any) => (
          <div key={tx.hash} className="flex justify-between items-center text-sm border-b pb-2">
            <span>{tx.from === tx.to ? 'Self' : tx.from === props.wallet.address ? 'Sent' : 'Received'}</span>
            <span className="font-medium">{tx.value} FTR</span>
            <span className="text-gray-500">{tx.from === props.wallet.address ? tx.to : tx.from}</span>
            <span className="text-gray-500">{new Date(tx.timestamp).toLocaleString()}</span>
          </div>
        )))}
      </div>
    </div>
  )
}

