import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
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
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const project = await prisma.project.findUnique({
      where: { id: params.projectId },
    });

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    await prisma.story.deleteMany({
      where: { projectId: params.projectId },
    });

    await prisma.project.delete({
      where: { id: params.projectId },
    });

    return new NextResponse("Project deleted", { status: 200 });
  } catch (error) {
    console.error("Error deleting project:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
