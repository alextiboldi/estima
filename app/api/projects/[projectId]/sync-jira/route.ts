import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { getJiraClient } from "@/lib/jira";

export async function POST(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { settings: true },
    });

    if (!user?.settings?.jiraHost || !user?.settings?.jiraApiToken) {
      return new NextResponse("Jira settings not configured", { status: 400 });
    }

    // Get the project and its associated Jira project key
    const project = await prisma.project.findUnique({
      where: { id: params.projectId },
    });

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    const jiraClient = getJiraClient({
      jiraHost: user.settings.jiraHost,
      jiraEmail: user.settings.jiraEmail || "",
      jiraApiToken: user.settings.jiraApiToken,
    });

    // Get all issues for the project
    const issues = await jiraClient.getProjectIssues(
      project.name,
      project.selectedStatusId || ""
    );

    // Create stories for each issue
    const stories = await Promise.all(
      issues.issues.map((issue: any) =>
        prisma.story.create({
          data: {
            title: issue.fields.summary,
            description: issue.fields.description || undefined,
            projectId: params.projectId,
            status: "PENDING",
          },
        })
      )
    );

    return NextResponse.json({ success: true, storiesCreated: stories.length });
  } catch (error) {
    console.error("Error syncing Jira issues:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
