import { Folder, Monitor, Tags } from "lucide-react";

const HowItWorks = () => {
  return (
    <div className="w-full px-4 md:px-6 py-12 md:py-24" id="how-it-works">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h3 className="text-balance text-3xl font-bold text-foreground md:text-5xl">
            How It Works
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            Get started in three simple steps. No technical knowledge required.
          </p>
        </div>
        <div className="space-y-24 md:space-y-32">
          <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12 lg:gap-16">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-3 rounded-full bg-primary/10 px-4 py-2">
                <Folder className="size-5 text-primary" />
                <span className="text-sm font-semibold text-primary">
                  Step 1
                </span>
              </div>
              <h4 className="text-2xl font-bold text-foreground md:text-4xl">
                Point to Your Media
              </h4>
              <p className="text-pretty text-base md:text-lg text-muted-foreground leading-relaxed">
                Choose any folder on your computer to get started. All the files
                inside will be automatically indexed and update when you add or
                remove them. You can add as many folders as you like.
              </p>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-center group overflow-hidden rounded-3xl border border-border bg-card shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-primary/10 p-3 md:p-6 bg-linear-to-t/oklch from-violet-500 to-violet-900 aspect-square">
                <img
                  src="/onboarding.png"
                  alt="Folder selection interface"
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-8 md:flex-row-reverse md:gap-12 lg:gap-16">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-3 rounded-full bg-primary/10 px-4 py-2">
                <Monitor className="size-5 text-primary" />
                <span className="text-sm font-semibold text-primary">
                  Step 2
                </span>
              </div>
              <h4 className="text-2xl font-bold text-foreground md:text-4xl">
                Access From Any Device In Your Home
              </h4>
              <p className="text-pretty text-base md:text-lg text-muted-foreground leading-relaxed">
                Enjoy your videos, photos, and music seamlessly across all your
                home devices. You are not limited to just the dektop app &mdash;
                it can open a{" "}
                <span className="whitespace-nowrap">built-in</span> web server
                that lets you stream your media to any device on your local
                network. All using the same, modern interface in your favorite
                browser.
              </p>
            </div>
            <div className="flex-1">
              <div className="relative">
                <div className="flex items-center justify-center group overflow-hidden rounded-3xl border border-border bg-card shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-primary/10 aspect-square bg-linear-to-bl/oklch from-blue-700 to-indigo-900 p-3 md:p-6">
                  <img
                    src="/device-group.png"
                    alt="Multi-device viewing"
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center justify-center absolute -bottom-6 -right-3 md:-right-6 size-[40%] max-size-[180px] md:max-size-[220px] overflow-hidden rounded-2xl border-4 border-background shadow-2xl transition-transform duration-500 hover:scale-105 xl:size-[220px] aspect-square bg-linear-to-br/oklch from-slate-500 to-slate-800 p-3 md:p-5">
                  <img
                    src="/tv.png"
                    alt="TV viewing"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-8 md:flex-row md:gap-12 lg:gap-16">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-3 rounded-full bg-primary/10 px-4 py-2">
                <Tags className="size-5 text-primary" />
                <span className="text-sm font-semibold text-primary">
                  Step 3
                </span>
              </div>
              <h4 className="text-2xl font-bold text-foreground md:text-4xl">
                Take Full Control
              </h4>
              <p className="text-pretty text-base md:text-lg text-muted-foreground leading-relaxed">
                Sort, filter, tag, comment, and group your media exactly how you
                want. Purpose-built interfaces, custom tags, and powerful search
                put you in complete control of your library.
              </p>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-center group overflow-hidden rounded-3xl border border-border bg-card shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-primary/10 p-6 md:p-10 bg-linear-to-br/oklch from-red-500 to-orange-500">
                <img
                  src="/editor-showcase.png"
                  alt="Organization features"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
