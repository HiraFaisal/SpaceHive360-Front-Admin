"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { WorkspaceForm } from "./workspace-form";

interface NewWorkspaceSheetProps {
  children?: React.ReactNode;
  onSuccess?: () => void;
}

export function NewWorkspaceSheet({ children, onSuccess }: NewWorkspaceSheetProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
            <Plus className="h-4 w-4" /> Add Workspace
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md lg:max-w-lg overflow-y-auto overflow-x-hidden p-0 border-l border-border/50">
        <div className="h-full flex flex-col pt-6 pb-2 px-6">
          <SheetHeader className="pb-6 border-b mb-6 text-left">
            <SheetTitle className="text-2xl font-semibold tracking-tight">New Workspace</SheetTitle>
            <SheetDescription>
              Add a new unit to your inventory. Fill in the details below.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 pb-8">
            <WorkspaceForm 
              onSuccess={handleSuccess} 
              onCancel={() => setOpen(false)} 
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
