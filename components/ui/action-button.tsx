"use client";

import { type ComponentProps, type ReactNode, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LoadingSwap } from "./loading-swap";
import { AlertTriangleIcon, CheckCircleIcon, InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ActionButton({
  action,
  requireAreYouSure = false,
  areYouSureDescription = "This action cannot be undone.",
  areYouSureTitle = "Are you sure?",
  mediaVariant = "default",
  ...props
}: ComponentProps<typeof Button> & {
  action: () => Promise<{ error: boolean; message?: string }>;
  requireAreYouSure?: boolean;
  areYouSureTitle?: string;
  mediaVariant?: "destructive" | "success" | "default";
  areYouSureDescription?: ReactNode;
}) {
  const [isLoading, startTransition] = useTransition();

  function performAction() {
    startTransition(async () => {
      const data = await action();
      if (data.error) {
        toast.error("Error!", {
          description: data.message ?? "An unknown error occurred.",
        });
      } else if (data.message) {
        toast.success(data.message);
      }
    });
  }

  if (requireAreYouSure) {
    return (
      <AlertDialog open={isLoading ? true : undefined}>
        <AlertDialogTrigger render={<Button {...props} />}></AlertDialogTrigger>
        <AlertDialogContent className="min-w-lg">
          <AlertDialogHeader>
            <AlertDialogMedia>
              {mediaVariant === "destructive" ? (
                <AlertTriangleIcon className="text-destructive size-8" />
              ) : mediaVariant === "success" ? (
                <CheckCircleIcon className="text-primary size-8" />
              ) : (
                <InfoIcon className="text-primary size-8" />
              )}
            </AlertDialogMedia>
            <AlertDialogTitle>{areYouSureTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {areYouSureDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={cn(
                mediaVariant === "destructive" &&
                  "bg-destructive text-destructive-foreground hover:bg-destructive/90",
              )}
              disabled={isLoading}
              onClick={performAction}
            >
              <LoadingSwap isLoading={isLoading}>Yes</LoadingSwap>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Button
      {...props}
      disabled={props.disabled ?? isLoading}
      onClick={(e) => {
        performAction();
        props.onClick?.(e);
      }}
    >
      <LoadingSwap
        isLoading={isLoading}
        className="inline-flex items-center gap-2"
      >
        {props.children}
      </LoadingSwap>
    </Button>
  );
}
