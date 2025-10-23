"use client"

import { forwardRef } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { useIpfsImage } from "@/hooks/use-ipfs-image"
import { cn } from "@/lib/utils"

// Base props shared between both rendering modes
interface BaseIpfsImageProps {
  cid: string
  alt: string
  className?: string
  errorClassName?: string
  onLoad?: () => void
  onError?: () => void
  draggable?: boolean
}

// Props specific to HTML img element
interface HtmlImageProps extends BaseIpfsImageProps {
  useNextImage?: false
  style?: React.CSSProperties
}

// Props specific to Next.js Image component
interface NextImageProps extends BaseIpfsImageProps {
  useNextImage: true
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
  priority?: boolean
  placeholder?: "blur" | "empty"
  blurDataURL?: string
}

// Union type for the component props
type IpfsImageProps = HtmlImageProps | NextImageProps


// Error component
function ErrorDisplay({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center bg-muted", className)}>
      <div className="text-center text-muted-foreground">
        <X className="mx-auto mb-2 h-8 w-8" />
        <p className="text-xs">Failed to load</p>
      </div>
    </div>
  )
}

export const IpfsImage = forwardRef<HTMLImageElement | HTMLDivElement, IpfsImageProps>(
  function IpfsImage(props, ref) {
    const {
      cid,
      alt,
      className,
      errorClassName,
      onLoad: externalOnLoad,
      onError: externalOnError,
      draggable = false,
    } = props

    const { src, isInitializing, isError, onLoad, onError } = useIpfsImage(cid)

    // Combine internal and external handlers
    const handleLoad = () => {
      onLoad()
      externalOnLoad?.()
    }

    const handleError = () => {
      onError()
      externalOnError?.()
    }

    // Show error state if all gateways failed
    if (isError) {
      return (
        <ErrorDisplay
          className={cn(className, errorClassName)}
        />
      )
    }

    // Show minimal placeholder during URL generation (no spinner to avoid flash)
    if (isInitializing || !src) {
      return (
        <div className={cn("bg-muted", className)} />
      )
    }

    // Render Next.js Image
    if (props.useNextImage) {
      const {
        width,
        height,
        fill,
        sizes,
        priority,
        placeholder,
        blurDataURL,
      } = props

      return (
        <Image
          ref={ref as React.Ref<HTMLImageElement>}
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          sizes={sizes}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          className={className}
          draggable={draggable}
          onLoad={handleLoad}
          onError={handleError}
        />
      )
    }

    // Render HTML img element
    const { style } = props
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        ref={ref as React.Ref<HTMLImageElement>}
        src={src}
        alt={alt}
        className={className}
        style={style}
        draggable={draggable}
        onLoad={handleLoad}
        onError={handleError}
      />
    )
  }
)