"use client";

import { Button } from "@/components/ui/button";
import { Download, ArrowRight, Mail } from "lucide-react";

const HeroCTA = () => {
  return (
    <div className="mt-8 sm:mt-6 flex flex-col gap-4 sm:flex-row sm:justify-center">
      <Button
        size="lg"
        className="group w-full text-base font-semibold shadow-lg shadow-primary/25 sm:w-auto"
        onClick={() =>
          document
            .querySelector("#waitlist")
            ?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      >
        <Mail className="size-5 transition-transform group-hover:scale-110" />
        {/*`Download Free App`*/}Join The Waitlist
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="w-full sm:w-auto bg-transparent"
        onClick={() =>
          document
            .querySelector("#how-it-works")
            ?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      >
        Learn More
        <ArrowRight />
      </Button>
    </div>
  );
};

export default HeroCTA;
