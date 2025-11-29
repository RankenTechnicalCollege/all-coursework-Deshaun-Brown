import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardContent className="pt-12 pb-12 text-center space-y-6">
          <div>
            <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
            <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
            <p className="text-muted-foreground mt-2">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/bug/list">View Bugs</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/user/list">View Users</Link>
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Need help? <Link to="/" className="text-primary hover:underline">Contact support</Link></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default NotFound;