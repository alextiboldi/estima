"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Settings, Link2, Bell, Shield, Users } from "lucide-react";
import { JiraSettings } from "@/components/settings/sections/jira-settings";
import { GeneralSettings } from "@/components/settings/sections/general-settings";
import { NotificationSettings } from "@/components/settings/sections/notification-settings";
// import { SecuritySettings } from "@/components/settings/sections/security-settings";
import { TeamSettings } from "@/components/settings/sections/team-settings";

interface SettingsSection {
  id: string;
  icon: React.ReactNode;
  label: string;
  component: React.ReactNode;
}

const sections: SettingsSection[] = [
  {
    id: "general",
    icon: <Settings className="h-4 w-4" />,
    label: "General",
    component: <GeneralSettings />,
  },
  {
    id: "connect",
    icon: <Link2 className="h-4 w-4" />,
    label: "Connect",
    component: <JiraSettings />,
  },
  {
    id: "notifications",
    icon: <Bell className="h-4 w-4" />,
    label: "Notifications",
    component: <NotificationSettings />,
  },
  //   {
  //     id: "security",
  //     icon: <Shield className="h-4 w-4" />,
  //     label: "Security",
  //     component: <SecuritySettings />,
  //   },
  {
    id: "teams",
    icon: <Users className="h-4 w-4" />,
    label: "Teams",
    component: <TeamSettings />,
  },
];

export function SettingsLayout() {
  const [currentSection, setCurrentSection] = useState("general");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:space-x-6">
        <aside className="md:w-64 flex-shrink-0">
          <div className="space-y-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Settings
              </h2>
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="space-y-1">
                  {sections.map((section) => (
                    <Button
                      key={section.id}
                      variant={
                        currentSection === section.id ? "secondary" : "ghost"
                      }
                      className={cn(
                        "w-full justify-start",
                        currentSection === section.id && "bg-secondary"
                      )}
                      onClick={() => setCurrentSection(section.id)}
                    >
                      {section.icon}
                      <span className="ml-2">{section.label}</span>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </aside>
        <Separator orientation="vertical" className="hidden md:block" />
        <main className="flex-1 md:max-w-2xl lg:max-w-3xl">
          <div className="space-y-6">
            {
              sections.find((section) => section.id === currentSection)
                ?.component
            }
          </div>
        </main>
      </div>
    </div>
  );
}
