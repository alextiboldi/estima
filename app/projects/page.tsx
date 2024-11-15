import { ProjectList } from "@/components/project/project-list";
import { MainNav } from "@/components/main-nav";

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="container mx-auto px-4 py-8">
        <ProjectList />
      </main>
    </div>
  );
}