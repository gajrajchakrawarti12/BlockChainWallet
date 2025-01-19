import { Button } from "@/components/ui/button"
import { RefreshCw } from 'lucide-react'

export default function Balance(props: any) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <div className="text-sm font-medium text-gray-500">Balance</div>
        <div className="text-2xl font-bold">{props.balance} FTR</div>
      </div>
      <Button variant="outline" size="icon" onClick={props.onRefresh}>
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  )
}

