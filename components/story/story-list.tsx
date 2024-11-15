"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StoryCard } from "@/components/story/story-card";
import { Story } from "@/lib/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

interface StoryListProps {
  projectId: string;
  selectedStoryId: string | null;
  onStorySelect: (storyId: string) => void;
}

export function StoryList({
  projectId,
  selectedStoryId,
  onStorySelect,
}: StoryListProps) {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    fetchStories();
  }, [projectId]);

  const fetchStories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/projects/${projectId}/stories`);
      if (!response.ok) throw new Error("Failed to fetch stories");
      const data = await response.json();
      setStories(data);
    } catch (error) {
      toast.error("Failed to load stories");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const syncJiraIssues = async () => {
    try {
      setIsSyncing(true);
      const response = await fetch(`/api/projects/${projectId}/sync-jira`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to sync Jira issues");

      toast.success("Successfully synced issues from Jira");
      fetchStories(); // Refresh the stories list
    } catch (error) {
      toast.error("Failed to sync Jira issues");
      console.error(error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card className="h-[calc(100vh-12rem)]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tasks</CardTitle>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={syncJiraIssues}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Sync Jira Issues
          </Button>
          <div className="text-sm text-muted-foreground">
            {stories.length} {stories.length === 1 ? "story" : "stories"}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-16rem)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : stories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No stories found. Create a new story or sync from Jira.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {stories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  isSelected={story.id === selectedStoryId}
                  onClick={() => onStorySelect(story.id)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
