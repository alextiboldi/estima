"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { GanttChartSquare } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function LandingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleNavigation = () => {
    if (session) {
      router.push("/projects");
    } else {
      router.push("/auth/signin");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <GanttChartSquare className="h-6 w-6" />
              <span className="text-xl font-bold">Estima</span>
            </div>
            <Button onClick={handleNavigation}>
              {session ? "Dashboard" : "Login"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Estimate with Precision
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Take the guesswork out of story point estimation. With Estima, your
            team can collaboratively assess story complexity, effort, and
            risk—ensuring every story point is accurate and aligned with project
            realities. Estimate better, deliver faster.
          </p>
          <div className="space-x-4">
            <Button size="lg" onClick={handleNavigation}>
              {session ? "Go to Dashboard" : "Get Started"}
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>

          <div id="features" className="grid md:grid-cols-3 gap-8 py-24">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Real-time Collaboration</h3>
              <p className="text-muted-foreground">
                Estimate story points together with your team in real-time,
                ensuring everyone&aposs voice is heard.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Jira Integration</h3>
              <p className="text-muted-foreground">
                Seamlessly sync your projects and stories with Jira for a
                unified workflow.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Smart Calculations</h3>
              <p className="text-muted-foreground">
                Intelligent algorithms help calculate final story points based
                on team consensus.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
