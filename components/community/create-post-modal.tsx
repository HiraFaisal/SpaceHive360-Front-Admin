"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { communityApi } from "@/lib/api/community";
import { toast } from "sonner";
import { ImagePlus, Send } from "lucide-react";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreatePostModal({ isOpen, onClose, onSuccess }: CreatePostModalProps) {
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("GENERAL");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("tag", tag);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await communityApi.createPost(formData);
      toast.success("Post created successfully");
      setContent("");
      setTag("GENERAL");
      setImageFile(null);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create Community Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="tag" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</Label>
            <Select value={tag} onValueChange={setTag}>
              <SelectTrigger className="rounded-xl border-border/50">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="GENERAL">General</SelectItem>
                <SelectItem value="ANNOUNCEMENT">Announcement</SelectItem>
                <SelectItem value="COLLAB REQUEST">Collaboration</SelectItem>
                <SelectItem value="INTRODUCTIONS">Introduction</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">What's on your mind?</Label>
            <Textarea
              id="content"
              placeholder="Share updates, ask questions, or announce something..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[150px] rounded-2xl border-border/50 focus:ring-primary/20 resize-none p-4"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Attach Image (Optional)</Label>
            <div className="flex items-center gap-4">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="rounded-xl border-border/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !content.trim()}
              className="rounded-xl bg-primary hover:bg-primary/90 px-8 gap-2 shadow-lg shadow-primary/20"
            >
              {isSubmitting ? "Posting..." : "Share Post"}
              <Send className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
