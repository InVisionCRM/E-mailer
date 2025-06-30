'use client'

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Label } from "@/components/ui/label"

import { cn } from "@/lib/utils"

const textareaVariants = cva(
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: { default: "", outline: "" },
      size: {
        default: "h-9",
        sm: "h-8 rounded-md",
        lg: "h-10 rounded-md px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & VariantProps<typeof textareaVariants>
>(({ className, variant, size, ...props }, ref) => {
  return (
    <textarea
      className={cn(textareaVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

const TextareaLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <Label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} ref={ref} {...props} />
))
TextareaLabel.displayName = LabelPrimitive.Root.displayName

const TextareaWrapper = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ className, ...props }, ref) => (
  <Slot
    ref={ref}
    className={cn(
      "relative flex items-center justify-center rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-1 focus-within:ring-ring disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
))
TextareaWrapper.displayName = "TextareaWrapper"

export { Textarea, TextareaLabel, TextareaWrapper }
