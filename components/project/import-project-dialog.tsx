"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface JiraProject {
  id: string;
  key: string;
  name: string;
}

interface JiraStatus {
  id: string;
  name: string;
  statusCategory: {
    key: string;
  };
}

interface ImportProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportProjectDialog({
  open,
  onOpenChange,
}: ImportProjectDialogProps) {
  const [projects, setProjects] = useState<JiraProject[]>([]);
  const [statuses, setStatuses] = useState<JiraStatus[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedStatusId, setSelectedStatusId] = useState<string>("");
  const [selectedStatusName, setSelectedStatusName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"projects" | "statuses" | "importing">(
    "projects"
  );

  useEffect(() => {
    if (open) {
      fetchProjects();
    } else {
      resetDialog();
    }
  }, [open]);

  useEffect(() => {
    if (selectedProject) {
      fetchStatuses(selectedProject);
    }
  }, [selectedProject]);

  const resetDialog = () => {
    setProjects([]);
    setStatuses([]);
    setSelectedProject("");
    setSelectedStatusName("");
    setSelectedStatusId("");
    setStep("projects");
    setIsLoading(false);
  };

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/jira/projects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      toast.error("Failed to fetch Jira projects");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatuses = async (projectKey: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/jira/projects/${projectKey}/statuses`);
      const data = await response.json();
      setStatuses(data);
      setStep("statuses");
    } catch (error) {
      toast.error("Failed to fetch project statuses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    try {
      setStep("importing");
      setIsLoading(true);

      const response = await fetch("/api/projects/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectKey: selectedProject,
          statusId: selectedStatusId,
          statusName: selectedStatusName,
        }),
      });

      if (!response.ok) throw new Error("Import failed");

      toast.success("Project imported successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to import project");
    } finally {
      setIsLoading(false);
    }
  };

  const onStatusSelected = (statusId: string) => {
    const statusName = statuses.find((status) => status.id === statusId)?.name;
    setSelectedStatusName(statusName || "");
    setSelectedStatusId(statusId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {step === "projects" && "Select Jira Project"}
            {step === "statuses" && "Select Issue Status"}
            {step === "importing" && "Importing Project"}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {step === "projects" && (
              <ScrollArea className="h-[300px] pr-4">
                <RadioGroup
                  value={selectedProject}
                  onValueChange={setSelectedProject}
                >
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center space-x-2 py-2"
                    >
                      <RadioGroupItem value={project.key} id={project.id} />
                      <Label
                        htmlFor={project.id}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {project.key}
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </ScrollArea>
            )}

            {step === "statuses" && (
              <ScrollArea className="h-[300px] pr-4">
                <RadioGroup
                  value={selectedStatusId}
                  onValueChange={onStatusSelected}
                >
                  {statuses.map((status) => (
                    <div
                      key={status.id}
                      className="flex items-center space-x-2 py-2"
                    >
                      <RadioGroupItem value={status.id} id={status.id} />
                      <Label htmlFor={status.id} className="cursor-pointer">
                        {status.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </ScrollArea>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  if (step === "statuses") {
                    setStep("projects");
                    setSelectedStatusName("");
                    setSelectedStatusId("");
                  } else {
                    onOpenChange(false);
                  }
                }}
                disabled={isLoading}
              >
                {step === "statuses" ? "Back" : "Cancel"}
              </Button>
              <Button
                onClick={step === "statuses" ? handleImport : () => {}}
                disabled={
                  isLoading ||
                  (step === "projects" && !selectedProject) ||
                  (step === "statuses" && !selectedStatusId)
                }
              >
                {step === "projects" ? "Next" : "Import"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
