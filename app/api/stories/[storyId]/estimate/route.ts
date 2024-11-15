import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { calculateStoryPoints } from "@/lib/estimation";
import { revalidatePath } from "next/cache";
import { pusher } from "@/lib/pusher";

export async function POST(
  request: Request,
  { params }: { params: { storyId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { complexity, effort, risk, dependencies } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Create or update estimation
    const estimation = await prisma.estimation.upsert({
      where: {
        storyId_userId: {
          storyId: params.storyId,
          userId: user.id,
        },
      },
      update: {
        complexity,
        effort,
        risk,
        dependencies,
      },
      create: {
        storyId: params.storyId,
        userId: user.id,
        complexity,
        effort,
        risk,
        dependencies,
      },
    });

    // Get all estimations for the story
    const allEstimations = await prisma.estimation.findMany({
      where: { storyId: params.storyId },
    });

    // Calculate final points if we have enough estimations
    if (allEstimations.length >= 2) {
      const storyPoints = calculateStoryPoints(allEstimations);
      await prisma.story.update({
        where: { id: params.storyId },
        data: {
          finalPoints: storyPoints,
          status: "ESTIMATED",
        },
      });
    }

    // Trigger real-time update
    await pusher.trigger(`story-${params.storyId}`, "estimation-updated", {
      estimation,
      finalPoints: allEstimations.length >= 2,
    });

    revalidatePath(`/projects/[projectId]`);
    return NextResponse.json(estimation);
  } catch (error) {
    console.error("Error processing estimation:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}