import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

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
    const hasSettings = !!(
      user?.settings?.jiraHost &&
      user?.settings?.jiraEmail &&
      user?.settings?.jiraApiToken
    );

    return NextResponse.json({ hasSettings });
  } catch (error) {
    console.error("Error checking Jira settings:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
