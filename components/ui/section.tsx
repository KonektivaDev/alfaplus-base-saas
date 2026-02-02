import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

function SectionGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="section-group"
      className={cn(
        "bg-background gap-4 group/section-group flex w-full flex-col",
        className
      )}
      {...props}
    />
  )
}

function SectionSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="section-separator"
      orientation="horizontal"
      className={cn("my-2", className)}
      {...props}
    />
  )
}


const sectionVariants = cva(
  "bg-background gap-4 group/section flex w-full flex-col",
  {
    variants: {
      variant: {
        default: "bg-background",
        muted: "bg-muted/50",
      }
    }
  }
)

function Section({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"div"> & VariantProps<typeof sectionVariants>) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(sectionVariants({ variant, className })),
      },
      props
    ),
    render,
    state: {
      slot: "section",
      variant,
    }
  })
}

function SectionHeader(
  { className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="section-header"
      className="container mx-auto flex flex-col gap-6 px-4 pt-4 md:pt-6 lg:px-6"
    >
      <div
        data-slot="section-header-content"
        className={cn(
          "flex flex-col justify-between gap-4 md:flex-row md:items-center md:gap-6",
          className
        )}
        {...props}
      />
    </div>
  )
}

function SectionTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-slot="section-title"
      className={cn(
        "text-base font-semibold tracking-tight ",
        className
      )}
      {...props}
    />
  )
}


function SectionDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="section-description"
      className={cn("text-muted-foreground text-xs", className)}
      {...props}
    />
  )
}

function SectionActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("flex flex-col-reverse gap-3 md:flex-row", className)}
      {...props}
    />
  )
}

function SectionContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="section-content"
      className={cn("container mx-auto px-4 py-6 lg:px-6", className)}
      {...props}
    />
  )
}

export {
  Section,
  SectionGroup,
  SectionSeparator,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionActions,
  SectionContent
}