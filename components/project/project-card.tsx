import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreVertical, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useState } from "react";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    totalStories: number;
    estimatedStories: number;
  };
  onDelete: (projectId: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const progress = (project.estimatedStories / project.totalStories) * 100;
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDeleteClick = (e) => {
    e.preventDefault(); // Prevent Link navigation
    setShowDeleteAlert(true);
    setDropdownOpen(false);
  };

  const handleConfirmDelete = () => {
    onDelete(project.id);
    setShowDeleteAlert(false);
  };

  return (
    <div className="relative group">
      <Link href={`/projects/${project.id}`}>
        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{project.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu
                  open={dropdownOpen}
                  onOpenChange={setDropdownOpen}
                >
                  <DropdownMenuTrigger
                    className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
                    onClick={(e) => e.preventDefault()} // Prevent Link navigation when clicking menu
                  >
                    <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive cursor-pointer"
                      onClick={handleDeleteClick}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Stories Estimated</span>
                <span className="font-medium">
                  {project.estimatedStories}/{project.totalStories}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </Link>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project "{project.name}" and all
              its associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
