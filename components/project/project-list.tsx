"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CreateProjectDialog } from "@/components/project/create-project-dialog";
import { ProjectCard } from "@/components/project/project-card";
import { useSession } from "next-auth/react";

interface Project {
  id: string;
  name: string;
  description: string;
  totalStories: number;
  estimatedStories: number;
}

export function ProjectList() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleDeleteProject = async (projectId: string) => {
    try {
      await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      setProjects((projects) => projects.filter((p) => p.id !== projectId));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  // useEffect(() => {
  //   // TODO: Fetch projects from API
  //   const mockProjects: Project[] = [
  //     {
  //       id: "1",
  //       name: "E-commerce Platform",
  //       description: "Online shopping platform redesign",
  //       totalStories: 12,
  //       estimatedStories: 8,
  //     },
  //     {
  //       id: "2",
  //       name: "Mobile App",
  //       description: "Cross-platform mobile application",
  //       totalStories: 8,
  //       estimatedStories: 3,
  //     },
  //   ];
  //   setProjects(mockProjects);
  // }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">
            Manage your projects and estimate story points collaboratively.
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 && (
          <p className="text-muted-foreground">
            No projects found. Go to settings and import existing projects from
            Jira
          </p>
        )}
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onDelete={handleDeleteProject}
          />
        ))}
      </div>

      {/* <CreateProjectDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      /> */}
    </div>
  );
}
