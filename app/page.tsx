"use client";

import { Address } from "@coinbase/onchainkit/identity";
import { usePrivy } from "@privy-io/react-auth"





export default function HomePage() {
  const { login, ready, authenticated, user } = usePrivy()

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Loading...</h2>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <h1 className="mb-8 text-4xl font-bold">Welcome to LOSA</h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Sign in to access your seller dashboard
          </p>
          <button
            onClick={login}
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Welcome,{" "}
          {user?.email?.address ? (
            user.email.address
          ) : user?.wallet?.address ? (
            <Address address={user.wallet.address as `0x${string}`} />
          ) : (
            "User"
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Add your dashboard cards/content here */}
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">Products</h2>
          <p className="text-sm text-muted-foreground">
            Manage your product catalog
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">Orders</h2>
          <p className="text-sm text-muted-foreground">
            View and process orders
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Track your performance
          </p>
        </div>
      </div>
    </div>
  )
}