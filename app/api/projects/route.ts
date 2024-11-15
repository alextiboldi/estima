import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name, description } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: user.id,
        members: {
          connect: { id: user.id },
        },
      },
    });

    revalidatePath("/projects");
    return NextResponse.json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(request: Request) {
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

    const projects = await prisma.project.findMany({
      where: {
        ownerId: user.id,
        members: { every: { id: user.id } },
      },
    });
    revalidatePath("/projects");
    console.log("Returning projects", projects);
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching project:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
