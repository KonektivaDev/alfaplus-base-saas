import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const pageHeaderVariants = cva(
  [
    "w-full bg-background",
    "py-4 md:py-6",
    "border-border border-b",
    "group/page-header"
  ],
  {
    variants: {
      variant: {
        default: "border-border border-b",
        clear: "border-0",
        muted: "bg-muted/50 border-transparent"
      },
      size: {
        default: "py-4 md:py-6",
        sm: "py-3 md:py-4",
        xs: "py-2 md:py-3",
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

function PageHeader({
  className,
  variant = "default",
  size = "default",
  render,
  ...props
}: useRender.ComponentProps<"div"> & VariantProps<typeof pageHeaderVariants>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(pageHeaderVariants({ variant, size, className })),
      },
      props
    ),
    render,
    state: {
      slot: "page-header",
      variant,
      size,
    },
  })
}

function PageHeaderContainer({
  className,
  ...props
}: useRender.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header-container"
      className={cn(
        "container mx-auto flex flex-col gap-6 px-4 lg:px-6",
        className
      )}
      {...props}
    />
  )
}

function PageHeaderContent(
  { className, ...props }: useRender.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header-content"
      className={cn(
        "flex flex-col justify-between gap-6 md:flex-row md:items-center",
        className
      )}
      {...props}
    />
  )
}

function PageHeaderGroup(
  { className, ...props }: useRender.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header-group"
      className={cn(
        "space-y-2 group-data-[size=sm]/page-header:space-y-1.5 group-data-[size=xs]/page-header:space-y-1 group/page-header-group",
        className
      )}
      {...props}
    />
  )
}

function PageHeaderTitle(
  { className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      data-slot="page-header-title"
      className={cn(
        "text-lg font-semibold tracking-tight md:text-xl",
        className
      )}
      {...props}
    />
  )
}

function PageHeaderDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="page-header-description"
      className={cn(
        "text-muted-foreground text-xs lg:text-sm",
        className
      )}
      {...props}
    />
  )
}

function PageHeaderActions(
  { className, ...props }: useRender.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header-actions"
      className={cn("flex flex-row-reverse justify-end gap-2 md:flex-row", className)}
      {...props}
    />
  )
}

export {
  PageHeader,
  PageHeaderContainer,
  PageHeaderContent,
  PageHeaderGroup,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions
}