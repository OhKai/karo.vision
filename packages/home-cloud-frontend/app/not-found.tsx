import { Button } from "@/components/ui/button";
import { House, MessageSquareWarning } from "lucide-react";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="mt-32 flex flex-col items-center gap-6">
      <MessageSquareWarning className="text-muted-foreground/35 h-20 w-20" />
      <div className="text-muted-foreground text-center">
        The page you are looking for does not exist.
      </div>
      <Button asChild>
        <Link href="/">
          <House /> Return Home
        </Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
