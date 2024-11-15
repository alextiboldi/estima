import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { title, description } = body;

    const story = await prisma.story.create({
      data: {
        title,
        description,
        projectId: params.projectId,
        status: "PENDING",
      },
    });

    revalidatePath(`/projects/${params.projectId}`);
    return NextResponse.json(story);
  } catch (error) {
    console.error("Error creating story:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const stories = await prisma.story.findMany({
      where: { projectId: params.projectId },
      orderBy: { createdAt: "desc" },
      include: {
        estimations: {
          select: {
            complexity: true,
            effort: true,
            risk: true,
            dependencies: true,
          },
        },
      },
    });

    return NextResponse.json(stories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
