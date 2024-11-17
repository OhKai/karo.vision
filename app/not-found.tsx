import { Button } from "@/components/ui/button";
import { House, MessageSquareWarning } from "lucide-react";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="mt-32 flex flex-col gap-6 items-center">
      <MessageSquareWarning className="w-[80px] h-[80px] text-muted-foreground/35" />
      <div className="text-center text-muted-foreground">
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
