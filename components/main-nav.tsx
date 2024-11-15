import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserNav } from "@/components/user-nav";
import { GanttChartSquare, Settings } from "lucide-react";

export function MainNav() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <GanttChartSquare className="h-6 w-6" />
          <span className="font-bold">Estima</span>
        </Link>
        <nav className="flex items-center space-x-6 ml-6">
          <Link href="/projects">
            <Button variant="ghost">Projects</Button>
          </Link>
          <Link href="/teams">
            <Button variant="ghost">Teams</Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </div>
  );
}
