import { ProjectList } from "@/components/project/project-list";
import { MainNav } from "@/components/main-nav";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

export default async function ProjectsPage() {
  const session = await getServerSession();
  if (!session) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  const projects = await prisma.project.findMany({
    where: {
      ownerId: session.user?.id,
      members: { every: { id: session.user?.id } },
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="container mx-auto px-4 py-8">
        <ProjectList projectList={projects} />
      </main>
    </div>
  );
}
