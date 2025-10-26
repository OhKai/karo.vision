import { Button } from "@/components/ui/button";
import { Sparkles, Check, Zap, Crown } from "lucide-react";

const PricingSection = () => {
  return (
    <div className="w-full px-4 py-20 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 text-center">
          <h2 className="text-balance text-4xl font-bold text-foreground md:text-6xl">
            Choose Your Plan
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            Start with the free app, then upgrade when you need more files with
            a simple subscription or one-time payment.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
          <div className="group relative overflow-hidden rounded-3xl border-2 border-border bg-card p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-2xl lg:p-10">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative space-y-6">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary/20 to-primary/10">
                <Sparkles className="size-7 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Free</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Perfect for getting started
                </p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-foreground">€0</span>
                <span className="text-lg text-muted-foreground">forever</span>
              </div>
              <Button
                variant="outline"
                size="lg"
                className="w-full bg-transparent"
              >
                Download App
              </Button>
              <div className="space-y-4 pt-6 border-t border-border">
                <div className="flex items-start gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="size-3 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">
                    All core features
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="size-3 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">
                    Up to 100 files
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-3xl border-2 border-primary bg-card p-8 shadow-2xl transition-all duration-300 hover:shadow-primary/20 lg:p-10 lg:scale-105">
            <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-primary/5 to-transparent" />
            <div className="absolute -right-16 -top-16 size-40 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute right-4 top-4 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-lg">
              LIMITED OFFER
            </div>
            <div className="relative space-y-6">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
                <Zap className="size-7 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">
                  Home Cloud Pro
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Easiest. Most flexible.
                </p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-foreground">€1</span>
                <span className="text-lg text-muted-foreground">/mo</span>
              </div>
              <Button size="lg" className="w-full shadow-lg shadow-primary/30">
                Buy Pro
              </Button>
              <div className="space-y-4 pt-6 border-t border-border">
                <div className="flex items-start gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary">
                    <Check className="size-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    Everything in Free, plus:
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary">
                    <Check className="size-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">
                    Unlimited files
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary">
                    <Check className="size-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">
                    All future updates (including major versions)
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary">
                    <Check className="size-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">
                    First access to new features
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary">
                    <Check className="size-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground">
                    Cancel anytime
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-3xl border-2 border-border bg-card p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-2xl lg:p-10">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative space-y-6">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary/20 to-primary/10">
                <Crown className="size-7 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Lifetime</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Pay once, own forever
                </p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-foreground">€45</span>
                <span className="text-lg text-muted-foreground">once</span>
              </div>
              <Button
                variant="outline"
                size="lg"
                className="w-full bg-transparent"
              >
                Buy Lifetime
              </Button>
              <div className="space-y-4 pt-6 border-t border-border">
                <div className="flex items-start gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="size-3 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    Everything in Free, plus:
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="size-3 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">
                    Unlimited files
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="size-3 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">
                    Updates for this major version
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="size-3 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">
                    No recurring payments
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="size-3 text-primary" />
                  </div>
                  <span className="text-sm text-foreground">
                    Offline activation (3 devices)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-12 text-center text-sm text-muted-foreground">
          30-day money-back guarantee • Cancel anytime • No questions asked
        </p>
      </div>
    </div>
  );
};

export default PricingSection;
