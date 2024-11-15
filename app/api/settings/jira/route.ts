import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { settings: true },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json({
      jiraHost: user.settings?.jiraHost || "",
      jiraEmail: user.settings?.jiraEmail || "",
      jiraApiToken: user.settings?.jiraApiToken || "",
    });
  } catch (error) {
    console.error("Error getting Jira settings:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { jiraHost, jiraEmail, jiraApiToken } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Update or create user settings
    await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: {
        jiraHost,
        jiraEmail,
        jiraApiToken,
      },
      create: {
        userId: user.id,
        jiraHost,
        jiraEmail,
        jiraApiToken,
      },
    });

    revalidatePath("/settings");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving Jira settings:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
