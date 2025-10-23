"use client"

import { useState } from "react"
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, X } from "lucide-react"

import { IpfsImage } from "@/components/ui/ipfs-image"
import type { UploadResult } from "@/app/services/storacha-service"

// Sortable Image Item Component
interface SortableImageItemProps {
  image: UploadResult & { uniqueId: string }
  index: number
  onDelete: (uniqueId: string) => void
}

function SortableImageItem({ image, index, onDelete }: SortableImageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.uniqueId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : transition, // Disable transition during drag
    zIndex: isDragging ? 10 : "auto",
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative aspect-square cursor-move overflow-hidden rounded-lg border ${
        isDragging
          ? "pointer-events-none opacity-0" // Make dragging item invisible to prevent flash
          : "transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
      }`}
      {...attributes}
      {...listeners}
    >
      {/* Drag handle - now just visual indicator */}
      <div className="pointer-events-none absolute top-2 left-2 z-20 rounded bg-black/50 p-1 opacity-0 transition-opacity group-hover:opacity-100">
        <GripVertical className="h-4 w-4 text-white" />
      </div>

      {/* Delete button */}
      <button
        type="button"
        onClick={() => onDelete(image.uniqueId)}
        className="absolute top-2 right-2 z-20 rounded-full bg-red-500 p-1 text-white opacity-0 transition-all group-hover:opacity-100 hover:bg-red-600"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Image */}
      <IpfsImage
        cid={image.cid}
        alt={`Image ${index + 1}`}
        className="h-full w-full object-cover"
        draggable={false}
        style={{
          maxWidth: "100%",
          height: "100%",
        }}
      />

      {/* Image number indicator */}
      <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white backdrop-blur-sm">
        {index + 1}
      </div>

      {/* Drag overlay for better visual feedback */}
      {isDragging && (
        <div className="absolute inset-0 rounded-lg bg-blue-500/20" />
      )}
    </div>
  )
}

// Drag Overlay Component for smooth dragging experience
function DragOverlayItem({
  image,
  index,
}: {
  image: UploadResult & { uniqueId: string }
  index: number
}) {
  return (
    <div className="bg-background aspect-square scale-105 overflow-hidden rounded-lg border-2 border-blue-500 opacity-95 shadow-2xl">
      <IpfsImage
        cid={image.cid}
        alt={`Image ${index + 1}`}
        className="h-full w-full object-cover"
        draggable={false}
      />
      <div className="absolute bottom-2 left-2 rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
        {index + 1}
      </div>
    </div>
  )
}

// Main SortableImageGrid Component
export interface SortableImageGridProps {
  images: (UploadResult & { uniqueId: string })[]
  onReorder: (fromIndex: number, toIndex: number) => void
  onDelete: (uniqueId: string) => void
  maxImages?: number
  className?: string
}

export function SortableImageGrid({
  images,
  onReorder,
  onDelete,
  className = "",
}: SortableImageGridProps) {
  const [activeItem, setActiveItem] = useState<
    (UploadResult & { uniqueId: string }) | null
  >(null)
  const [activeIndex, setActiveIndex] = useState<number>(-1)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Require 3px of movement before dragging starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const activeIndex = images.findIndex((img) => img.uniqueId === active.id)
    setActiveItem(images[activeIndex])
    setActiveIndex(activeIndex)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = images.findIndex((img) => img.uniqueId === active.id)
      const newIndex = images.findIndex((img) => img.uniqueId === over?.id)

      onReorder(oldIndex, newIndex)
    }

    setActiveItem(null)
    setActiveIndex(-1)
  }

  if (images.length === 0) {
    return null
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={images.map((img) => img.uniqueId)}
        strategy={rectSortingStrategy}
      >
        <div className={`grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 ${className}`}>
          {images.map((image, index) => (
            <SortableImageItem
              key={image.uniqueId}
              image={image}
              index={index}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeItem && activeIndex >= 0 ? (
          <DragOverlayItem image={activeItem} index={activeIndex} />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}