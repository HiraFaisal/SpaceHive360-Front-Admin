"use client";

import { useEffect, useState } from "react";
import { Search, Plus, MoreVertical } from "lucide-react";
import { deleteWorkspaceType } from "@/lib/api/workspaceTypes";
import { updateWorkspaceType } from "@/lib/api/workspaceTypes"; // ✅ ADDED

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Label } from "@/components/ui/label";
import {
  getWorkspaceTypes,
  createWorkspaceType,
} from "@/lib/api/workspaceTypes";

export default function WorkspaceTypesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [workspaceTypes, setWorkspaceTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ EDIT STATES ADDED
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    iconUrl: "",
    isActive: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const fetchWorkspaceTypes = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getWorkspaceTypes();

      const mappedTypes = (data ?? []).map((item: any) => ({
        id: item.recId,
        name: item.name,
        description: item.description,
        icon: item.iconUrl || "🏢",
        isActive: item.isActive,
      }));

      setWorkspaceTypes(mappedTypes);
    } catch (err) {
      console.error(err);
      setError("Failed to load workspace types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceTypes();
  }, []);

  const handleCreate = async () => {
    try {
      if (!form.name.trim()) {
        alert("Name is required");
        return;
      }

      setSubmitting(true);

      await createWorkspaceType({
        name: form.name,
        description: form.description,
        iconUrl: form.iconUrl,
        isActive: true,
      });

      await fetchWorkspaceTypes();

      setForm({
        name: "",
        description: "",
        iconUrl: "",
        isActive: true,
      });

      setIsAddOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create workspace type");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTypes = workspaceTypes.filter((type) =>
    (type.name ?? "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="p-10 text-center text-muted-foreground">
        Loading workspace types...
      </div>
    );
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }

  const handleDelete = async () => {
    console.log("Deleting ID:", deleteId);
    if (!deleteId) return;

    try {
      setDeleting(true);

      await deleteWorkspaceType(deleteId);

      await fetchWorkspaceTypes();

      setIsDeleteOpen(false);
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete workspace type");
    } finally {
      setDeleting(false);
    }
  };

  // =========================
  // ✅ EDIT HANDLER (ADDED)
  // =========================
  const handleUpdate = async () => {
    if (!editId) return;

    try {
      if (!form.name.trim()) {
        alert("Name is required");
        return;
      }

      setSubmitting(true);

      await updateWorkspaceType(editId, {
        recId: editId,
        workspaceType: {
          name: form.name,
          description: form.description,
        },
      });

      await fetchWorkspaceTypes();

      setIsEditOpen(false);
      setEditId(null);

      setForm({
        name: "",
        description: "",
        iconUrl: "",
        isActive: true,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to update workspace type");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workspace Types</h1>
          <p className="text-muted-foreground">
            Define different categories of resources available.
          </p>
        </div>

        {/* ADD */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Workspace Type
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Workspace Type</DialogTitle>
              <DialogDescription>
                Create a new workspace category.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label className="mb-2">Name</Label>
                <Input id="name" value={form.name} onChange={handleChange} />
              </div>

              <div>
                <Label className="mb-2">Description</Label>
                <Input
                  id="description"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label className="mb-2">Icon URL</Label>
                <Input
                  id="iconUrl"
                  value={form.iconUrl}
                  onChange={handleChange}
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleCreate} disabled={submitting}>
                {submitting ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* SEARCH */}
      <div className="flex items-center gap-2 bg-card p-4 rounded-lg border shadow-sm">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search types..."
          className="border-none shadow-none focus-visible:ring-0 flex-1 bg-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* GRID */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTypes.map((type) => (
          <Card key={type.id}>
            <CardHeader>
              <div className="flex justify-between">
                <div className="text-3xl">{type.icon}</div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    {/* ================= EDIT ================= */}
                    <DropdownMenuItem
                      onClick={() => {
                        setEditId(type.id);
                        setForm({
                          name: type.name,
                          description: type.description || "",
                          iconUrl: "",
                          isActive: type.isActive,
                        });
                        setIsEditOpen(true);
                      }}
                    >
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => {
                        setDeleteId(type.id);
                        setIsDeleteOpen(true);
                      }}
                      className="text-red-500"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <CardTitle>{type.name}</CardTitle>

              <CardDescription>
                {type.description || "No description"}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* ================= EDIT MODAL (ADDED) ================= */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Workspace Type</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="mb-2">Name</Label>
              <Input id="name" value={form.name} onChange={handleChange} />
            </div>

            <div>
              <Label className="mb-2">Description</Label>
              <Input
                id="description"
                value={form.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleUpdate} disabled={submitting}>
              {submitting ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL (UNCHANGED) */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Workspace Type</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this workspace type? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Yes, Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}