import { SettingsLayout } from "@/components/settings/settings-layout";
import { MainNav } from "@/components/main-nav";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <SettingsLayout />
    </div>
  );
}
