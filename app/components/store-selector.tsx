"use client"

import { ChevronDown, Store as StoreIcon } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useStoreStore, useStoreCount } from "@/app/stores/store-store"

interface StoreSelectorProps {
  className?: string
}

export function StoreSelector({ className }: StoreSelectorProps) {
  const [open, setOpen] = useState(false)
  const { activeStoreId, stores, setActiveStore, getStoreIds } = useStoreStore()
  const storeCount = useStoreCount()

  const currentStore = activeStoreId ? stores[activeStoreId] : null
  const storeIds = getStoreIds()

  if (storeCount === 0) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <StoreIcon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">No stores</span>
      </div>
    )
  }

  if (storeCount === 1) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <StoreIcon className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">{currentStore?.name || "Store"}</span>
      </div>
    )
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`flex items-center gap-2 ${className}`}
        >
          <StoreIcon className="h-4 w-4" />
          <span className="text-sm font-medium">
            {currentStore?.name || "Select Store"}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {storeIds.map((storeId) => {
          const store = stores[storeId]
          const isActive = storeId === activeStoreId
          
          return (
            <DropdownMenuItem
              key={storeId}
              onClick={() => {
                setActiveStore(storeId)
                setOpen(false)
              }}
              className={`flex items-center gap-2 ${
                isActive ? "bg-accent" : ""
              }`}
            >
              <StoreIcon className="h-4 w-4" />
              <div className="flex flex-col">
                <span className="font-medium">{store?.name || "Unnamed Store"}</span>
                {store?.description && (
                  <span className="text-xs text-muted-foreground truncate">
                    {store.description}
                  </span>
                )}
              </div>
              {isActive && (
                <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
