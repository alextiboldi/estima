"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const settingsSchema = z.object({
  jiraHost: z.string().url("Please enter a valid Jira URL"),
  jiraEmail: z.string().email("Please enter a valid email"),
  jiraApiToken: z.string().min(1, "API token is required"),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function SettingsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const router = useRouter();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      jiraHost: "",
      jiraEmail: "",
      jiraApiToken: "",
    },
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/settings/jira", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save settings");

      toast.success("Settings saved successfully");
      router.refresh();

      // Fetch Jira projects after successful settings save
      const projectsResponse = await fetch("/api/jira/projects");
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);
      }
    } catch (error) {
      toast.error("Failed to save settings");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Jira Integration</CardTitle>
          <CardDescription>
            Configure your Jira integration settings to sync projects and issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="jiraHost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jira Host URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://your-domain.atlassian.net"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Your Jira instance URL (e.g.,
                      https://your-domain.atlassian.net)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jiraEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jira Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your-email@example.com"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      The email address associated with your Jira account
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jiraApiToken"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Token</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your Jira API token"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Your Jira API token. You can generate one from your
                      Atlassian account settings.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Settings"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {projects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Jira Projects</CardTitle>
            <CardDescription>
              Available projects from your Jira instance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-2 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {project.key}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Import
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
