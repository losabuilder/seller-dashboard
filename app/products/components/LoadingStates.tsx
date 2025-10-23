import { Loader2, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ComponentType, ReactNode } from "react";

export function ProductLoadingSkeleton() {
  return (
    <div className="container mx-auto space-y-6 py-8">
      <div className="space-y-4">
        <div className="h-8 w-32 animate-pulse rounded bg-gray-200"></div>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-64 animate-pulse rounded bg-gray-200"></div>
          </div>
          <div className="h-10 w-32 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Product Images Skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-48 animate-pulse rounded bg-gray-200"></div>
          </CardHeader>
          <CardContent>
            <div className="aspect-square animate-pulse rounded-lg bg-gray-200"></div>
          </CardContent>
        </Card>

        {/* Product Information Skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 w-40 animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-56 animate-pulse rounded bg-gray-200"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
              <div className="h-6 w-full animate-pulse rounded bg-gray-200"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
              <div className="h-16 w-full animate-pulse rounded bg-gray-200"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 w-12 animate-pulse rounded bg-gray-200"></div>
                <div className="h-6 w-full animate-pulse rounded bg-gray-200"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                <div className="h-6 w-full animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Policies Skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-48 animate-pulse rounded bg-gray-200"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                <div className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Product Identifiers Skeleton */}
        <Card>
          <CardHeader>
            <div className="h-6 w-36 animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-52 animate-pulse rounded bg-gray-200"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                <div className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function SimpleLoadingSpinner({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" aria-hidden="true" />
        <p className="mt-2 text-muted-foreground" role="status" aria-live="polite">{message}</p>
      </div>
    </div>
  );
}

export function UploadingOverlay({ isVisible, message = "Uploading files..." }: { isVisible: boolean; message?: string }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <Card className="w-auto">
        <CardContent className="flex items-center space-x-4 p-6">
          <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
          <div role="status" aria-live="polite">
            <p className="font-medium">{message}</p>
            <p className="text-sm text-muted-foreground">Please wait...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function EmptyState({
  icon: Icon = ShoppingBag,
  title,
  description,
  children
}: {
  icon?: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <Icon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mb-4 text-muted-foreground">{description}</p>
        {children}
      </div>
    </div>
  );
}