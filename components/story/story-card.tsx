import { Story } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface StoryCardProps {
  story: Story;
  isSelected: boolean;
  onClick: () => void;
}

export function StoryCard({ story, isSelected, onClick }: StoryCardProps) {
  const getStatusColor = (status: Story["status"]) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "ESTIMATED":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "IN_PROGRESS":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  return (
    <div
      className={cn(
        "p-4 rounded-lg border cursor-pointer transition-colors",
        isSelected ? "border-primary bg-primary/5" : "hover:border-primary/50"
      )}
      onClick={onClick}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-medium line-clamp-2">{story.title}</h3>
          {story.finalPoints ? (
            <Badge variant="secondary" className="ml-2 shrink-0">
              {story.finalPoints} pts
            </Badge>
          ) : null}
        </div>
        {story.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {story.description}
          </p>
        )}
        <div className="flex items-center justify-between text-xs">
          <Badge
            variant="outline"
            className={cn("capitalize", getStatusColor(story.status))}
          >
            {story.status.toLowerCase().replace("_", " ")}
          </Badge>
          <span className="text-muted-foreground">
            {formatDistanceToNow(new Date(story.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
