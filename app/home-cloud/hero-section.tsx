import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { Check, Star } from "lucide-react";
import HeroCTA from "./hero-cta";

const HeroSection = () => {
  return (
    <>
      <BackgroundRippleEffect />
      <div className="mx-4 mt-32 md:mt-48 text-center">
        <div className="z-10 relative mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 backdrop-blur-sm">
          <Star className="size-4 fill-primary text-primary" />
          <span className="text-sm font-medium text-primary">
            A karo.vision solution
          </span>
        </div>
        <h1 className="z-10 relative text-balance text-5xl font-bold tracking-tight text-foreground md:text-7xl lg:text-8xl">
          The Media App
          <br />
          <span className="bg-linear-to-r from-primary via-primary/80 to-primary/65 bg-clip-text text-transparent">
            That Your OS Is Missing
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl leading-relaxed">
          The most intuitive way to browse your videos, photos, and music. View
          everything from any device in your home, organize with ease, and never
          lose track of your files.
        </p>
      </div>

      <div className="w-full px-4 pt-[104px] pb-16 md:pb-20 md:pt-[170px]">
        <div className="relative mx-auto mb-[-140px] flex max-w-5xl justify-center md:mb-[-25px]">
          <div className="absolute bottom-0 left-[8%] z-1 w-[260px] rotate-[-10deg] transition-all duration-500 hover:rotate-[-8deg] hover:scale-105 md:w-[340px] hover:-translate-y-3 mb-[-175px]">
            <div className="overflow-hidden rounded-4xl p-1 bg-background shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]">
              <img
                src="/screenshot-photos.png"
                alt="App Screenshot 1"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="relative z-3 w-[280px] transition-all duration-500 hover:scale-105 md:w-[360px] hover:-translate-y-7">
            <div className="absolute inset-0 -z-10 rounded-t-4xl bg-primary/20 blur-2xl" />
            <div className="overflow-hidden rounded-t-4xl bg-background shadow-[0_25px_70px_-15px_rgba(0,0,0,0.4)]">
              <img
                src="/screenshot-video-page.png"
                alt="App Screenshot 2"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="absolute bottom-0 right-[8%] z-2 w-[260px] rotate-10 transition-all duration-500 hover:rotate-8 hover:scale-105 md:w-[340px] hover:-translate-y-3 mb-[-175px]">
            <div className="overflow-hidden rounded-4xl p-1 bg-background shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]">
              <img
                src="/screenshot-videos.png"
                alt="App Screenshot 3"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
        <div className="z-10 relative mx-auto max-w-2xl overflow-hidden rounded-2xl border border-border bg-card/95 shadow-2xl backdrop-blur-md">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent" />
          <div className="relative p-8 md:p-12">
            <h3 className="text-balance text-center text-2xl font-bold text-foreground md:text-3xl">
              Start Re-Discovering Today
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-pretty text-center text-muted-foreground">
              Use the full featured app for free, forever. If you need more
              files, upgrade anytime.
            </p>
            <HeroCTA />
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="size-4 text-green-500" />
                <span>Mac, Windows, Linux</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-4 text-green-500" />
                <span>Access in any browser</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-4 text-green-500" />
                <span>Free for up to 100 files</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
