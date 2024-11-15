import { ProjectDashboard } from "@/components/project-dashboard";
import { MainNav } from "@/components/main-nav";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="container mx-auto px-4 py-8">
        <ProjectDashboard />
      </main>
    </div>
  );
}
