import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { getJiraClient } from "@/lib/jira";

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { projectKey, statusId, statusName } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { settings: true },
    });

    if (!user?.settings?.jiraHost || !user?.settings?.jiraApiToken) {
      return new NextResponse("Jira settings not configured", { status: 400 });
    }

    const jiraClient = getJiraClient({
      jiraHost: user.settings.jiraHost,
      jiraEmail: user.settings.jiraEmail || "",
      jiraApiToken: user.settings.jiraApiToken,
    });

    // Get project details
    const projects = await jiraClient.getAllProjects();
    const projectDetails = projects.find((p: any) => p.key === projectKey);

    if (!projectDetails) {
      return new NextResponse("Project not found", { status: 404 });
    }

    // Create project in database without importing tasks
    const project = await prisma.project.create({
      data: {
        name: projectDetails.name,
        description: projectDetails.description || undefined,
        selectedStatusId: statusId,
        selectedStatusName: statusName,
        jiraProjectKey: projectKey,
        ownerId: user.id,
        members: {
          connect: { id: user.id },
        },
      },
    });

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error("Error importing project:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
