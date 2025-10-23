"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Address } from "@coinbase/onchainkit/identity"
import { usePrivy } from "@privy-io/react-auth"
import { LogOut, Menu, Settings, User } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { StoreSelector } from "@/app/components/store-selector"

interface ListItemProps extends React.ComponentPropsWithoutRef<typeof Link> {
  title?: string
  children: React.ReactNode
}

const ListItem = React.forwardRef<React.ElementRef<typeof Link>, ListItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            ref={ref}
            className={cn(
              "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors select-none",
              className
            )}
            {...props}
          >
            {children}
          </Link>
        </NavigationMenuLink>
      </li>
    )
  }
)
ListItem.displayName = "ListItem"

const NavigationMenuItems = () => (
  <>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Dashboard</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
          <li className="row-span-3">
            <NavigationMenuLink
              className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
              href="/"
            >
              <div className="mt-4 mb-2 text-lg font-medium">
                Seller Dashboard
              </div>
              <p className="text-muted-foreground text-sm leading-tight">
                Manage your products, orders, and business operations all in one
                place.
              </p>
            </NavigationMenuLink>
          </li>
          <ListItem href="/products">
            <div className="text-sm leading-none font-medium">Products</div>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
              View and manage your product catalog
            </p>
          </ListItem>
          <ListItem href="/orders">
            <div className="text-sm leading-none font-medium">Orders</div>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
              Track and process customer orders
            </p>
          </ListItem>
          <ListItem href="/analytics">
            <div className="text-sm leading-none font-medium">Analytics</div>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
              View your business performance metrics
            </p>
          </ListItem>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Products</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
          <ListItem href="/products">
            <div className="text-sm leading-none font-medium">All Products</div>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
              View and manage your entire product catalog
            </p>
          </ListItem>
          <ListItem href="/products/create">
            <div className="text-sm leading-none font-medium">Add Product</div>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
              Create a new product listing
            </p>
          </ListItem>
          <ListItem href="/products/categories">
            <div className="text-sm leading-none font-medium">Categories</div>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
              Manage product categories
            </p>
          </ListItem>
          <ListItem href="/products/inventory">
            <div className="text-sm leading-none font-medium">Inventory</div>
            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
              Track and update product inventory
            </p>
          </ListItem>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink
        href="/orders"
        className={navigationMenuTriggerStyle()}
      >
        Orders
      </NavigationMenuLink>
    </NavigationMenuItem>
  </>
)

const MobileNav = () => {
  const { ready, authenticated } = usePrivy()

  if (!ready || !authenticated) {
    return null
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>
            <Link href="/" className="flex shrink-0 items-center">
              <Image
                src="/losa-logo-dark.svg"
                alt="LOSA"
                width={100}
                height={39}
                className="h-7 w-[4.5rem] dark:hidden"
                priority
              />
              <Image
                src="/losa-logo-white.svg"
                alt="LOSA"
                width={100}
                height={39}
                className="hidden h-7 w-[4.5rem] dark:block"
                priority
              />
            </Link>
          </SheetTitle>
        </SheetHeader>
        <nav className="mt-4 flex flex-col space-y-4">
          <Link href="/" className="hover:text-primary text-lg font-medium">
            Dashboard
          </Link>
          <Link
            href="/products"
            className="hover:text-primary text-lg font-medium"
          >
            Products
          </Link>
          <Link
            href="/products/create"
            className="hover:text-primary text-lg font-medium"
          >
            Add Product
          </Link>
          <Link
            href="/products/categories"
            className="hover:text-primary text-lg font-medium"
          >
            Categories
          </Link>
          <Link
            href="/products/inventory"
            className="hover:text-primary text-lg font-medium"
          >
            Inventory
          </Link>
          <Link
            href="/orders"
            className="hover:text-primary text-lg font-medium"
          >
            Orders
          </Link>
          <Link
            href="/analytics"
            className="hover:text-primary text-lg font-medium"
          >
            Analytics
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

const UserNav = () => {
  const { logout, user } = usePrivy()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="border-border hover:bg-accent relative h-8 w-8 rounded-full border">
          <User className="m-auto h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          {user?.email?.address ? (
            user.email.address
          ) : user?.wallet?.address ? (
            <Address address={user.wallet.address as `0x${string}`} />
          ) : (
            "My Account"
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/store">
            <Settings className="mr-2 h-4 w-4" />
            <span>Store settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function MainNav() {
  const { ready, authenticated } = usePrivy()

  return (
    <div className="container mx-auto flex h-16 items-center justify-between px-4">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/losa-logo-dark.svg"
            alt="LOSA"
            width={100}
            height={39}
            className="h-7 w-[4.5rem] dark:hidden"
            priority
          />
          <Image
            src="/losa-logo-white.svg"
            alt="LOSA"
            width={100}
            height={39}
            className="hidden h-7 w-[4.5rem] dark:block"
            priority
          />
        </Link>
        {ready && authenticated && <></>}
      </div>
      {ready && authenticated && (
        <div className="flex items-center gap-4">
          <MobileNav />
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItems />
            </NavigationMenuList>
          </NavigationMenu>
          <StoreSelector />
          <UserNav />
        </div>
      )}
    </div>
  )
}
