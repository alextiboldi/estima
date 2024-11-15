"use client";

import { useParams } from "next/navigation";
import { StoryList } from "@/components/story/story-list";
import { StoryEstimation } from "@/components/story/story-estimation";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { CreateStoryDialog } from "@/components/story/create-story-dialog";
import { MainNav } from "@/components/main-nav";

export default function ProjectPage() {
  const { projectId } = useParams();
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <MainNav />
      {/* <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Tasks</h1>
          <p className="text-muted-foreground">
            Estimate and track your project stories
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Story
        </Button>
      </div> */}

      <div className="grid gap-6 md:grid-cols-2">
        <StoryList
          projectId={projectId as string}
          selectedStoryId={selectedStoryId}
          onStorySelect={setSelectedStoryId}
        />
        {selectedStoryId && <StoryEstimation storyId={selectedStoryId} />}
      </div>

      <CreateStoryDialog
        projectId={projectId as string}
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
