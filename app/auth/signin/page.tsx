import { SignInButtons } from "@/components/auth/sign-in-buttons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GanttChartSquare } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <GanttChartSquare className="h-8 w-8" />
              <span className="text-2xl font-bold">Estima</span>
            </div>
          </div>
          <CardTitle className="text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInButtons />
        </CardContent>
      </Card>
    </div>
  );
}
