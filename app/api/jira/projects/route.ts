import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { getJiraClient } from "@/lib/jira";

export async function GET() {
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

    const jiraClient = getJiraClient({
      jiraHost: user.settings.jiraHost,
      jiraEmail: user.settings.jiraEmail || "",
      jiraApiToken: user.settings.jiraApiToken,
    });
    const projects = await jiraClient.getAllProjects();

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching Jira projects:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
