"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

import { ProjectCard } from "@/components/project/project-card";

import { Project } from "@prisma/client";

export function ProjectList({ projectList }: { projectList: Project[] }) {
  // const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(projectList);

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
        {Array.isArray(projects) && projects.length === 0 && (
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
