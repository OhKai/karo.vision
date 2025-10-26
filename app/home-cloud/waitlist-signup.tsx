"use client";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useState } from "react";

const WaitlistSignup = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="w-full px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-3xl border border-border bg-linear-to-br from-card/95 to-card/80 p-8 shadow-2xl backdrop-blur-sm md:p-12">
          <div className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="size-8 text-primary" />
            </div>
            <h3 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
              Join the Waitlist
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-lg text-muted-foreground">
              Be the first to know when we launch. Get notified and receive
              special pricing for early adopters.
            </p>
          </div>
          <form onSubmit={handleWaitlistSubmit} className="mt-8">
            <ButtonGroup className="w-full">
              <Input
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="h-10"
              />
              <Button
                type="submit"
                size="lg"
                className="whitespace-nowrap px-8"
              >
                {isSubmitted ? "You're on the list!" : "Join Waitlist"}
              </Button>
            </ButtonGroup>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              No spam. Unsubscribe anytime.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WaitlistSignup;
