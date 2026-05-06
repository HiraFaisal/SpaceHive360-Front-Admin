"use client";

import { useEffect, useState } from "react";
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

interface WorkspaceSheetProps {
  children?: React.ReactNode;
  initialData?: any;
  mode?: "create" | "view" | "edit";
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function WorkspaceSheet({ 
  children, 
  initialData, 
  mode: initialMode = "create", 
  onSuccess,
  open: externalOpen,
  onOpenChange: externalOnOpenChange
}: WorkspaceSheetProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState<"create" | "view" | "edit">(initialMode);

  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange !== undefined ? externalOnOpenChange : setInternalOpen;

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  const getSheetTitle = () => {
    switch (currentMode) {
      case "view": return "Workspace Details";
      case "edit": return "Edit Workspace";
      default: return "New Workspace";
    }
  };

  const getSheetDescription = () => {
    switch (currentMode) {
      case "view": return "Viewing workspace information. You cannot make changes here.";
      case "edit": return "Update the workspace details below.";
      default: return "Add a new unit to your inventory. Fill in the details below.";
    }
  };

  // Reset mode when opening/closing
  useEffect(() => {
    if (open) {
      setCurrentMode(initialMode);
    }
  }, [open, initialMode]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {children && (
        <SheetTrigger asChild>
          {children}
        </SheetTrigger>
      )}
      <SheetContent className="w-full sm:max-w-md lg:max-w-lg overflow-y-auto overflow-x-hidden p-0 border-l border-border/50">
        <div className="h-full flex flex-col pt-6 pb-2 px-6">
          <SheetHeader className="pb-6 border-b mb-6 text-left relative">
            <div className="flex justify-between items-start pr-8">
              <div>
                <SheetTitle className="text-2xl font-semibold tracking-tight">{getSheetTitle()}</SheetTitle>
                <SheetDescription className="mt-1">
                  {getSheetDescription()}
                </SheetDescription>
              </div>
              {currentMode === "view" && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentMode("edit")}
                  className="gap-1.5"
                >
                  Edit
                </Button>
              )}
            </div>
          </SheetHeader>
          <div className="flex-1 pb-8">
            <WorkspaceForm 
              mode={currentMode}
              initialData={initialData}
              onSuccess={handleSuccess} 
              onCancel={() => setOpen(false)} 
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
