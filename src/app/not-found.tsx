import Link from "next/link";
import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The page you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
