"use client";

import { useEffect } from "react";
import { Button } from "../components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <AlertCircle className="w-8 h-8 mx-auto mb-4 text-destructive" />
        <h2 className="text-lg font-semibold mb-2">Something went wrong!</h2>
        <p className="text-muted-foreground mb-4">
          An error occurred while loading this page.
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
