"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { useEffect, useState } from "react";
import { ImportProjectDialog } from "@/components/project/import-project-dialog";
import { Download } from "lucide-react";

const settingsSchema = z.object({
  jiraHost: z.string().url("Please enter a valid Jira URL"),
  jiraEmail: z.string().email("Please enter a valid email"),
  jiraApiToken: z.string().min(1, "API token is required"),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function JiraSettings() {
  const router = useRouter();
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [hasJiraSettings, setHasJiraSettings] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      jiraHost: "",
      jiraEmail: "",
      jiraApiToken: "",
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings/jira");
        if (response.ok) {
          const data = await response.json();
          form.reset(data);
          setHasJiraSettings(true);
        }
      } catch (error) {
        console.error("Failed to fetch Jira settings:", error);
      }
    };

    fetchSettings();
  }, [form]);

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      const response = await fetch("/api/settings/jira", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save settings");

      toast.success("Jira settings saved successfully");
      setHasJiraSettings(true);
      router.refresh();
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Integrations</h3>
        <p className="text-sm text-muted-foreground">
          Connect your external services to enhance your workflow
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Jira</CardTitle>
          <CardDescription>
            Configure your Jira integration to sync projects and issues
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

              <Button type="submit">Save Settings</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setIsImportDialogOpen(true)}
            className="w-full"
            disabled={!hasJiraSettings}
          >
            <Download className="mr-2 h-4 w-4" />
            Import Project from Jira
          </Button>
        </CardFooter>
      </Card>

      <ImportProjectDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
      />
    </div>
  );
}
