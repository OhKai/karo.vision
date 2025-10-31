"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

const FaqSection = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "Which features does the free version of the app include?",
      answer:
        "The free version has all the same features as the paid version, just limited to 100 files at a time. You can unlock unlimited files with a paid plan, but you'll never be forced to upgrade.",
    },
    {
      question: "Which devices and platforms are supported?",
      answer:
        "The native app currently supports macOS, Windows, and Linux. The built-in web server allows access from any device with a modern web browser on your local network. Native mobile apps are coming soon™.",
    },
    {
      question: "How does the app handle my privacy and data?",
      answer:
        "Your files never leave your home network. The file-sharing with other devices in your home is done through a built-in web server that keeps everything local. We never access or sell your data.",
    },
    {
      question: "Can I organize media from multiple folders?",
      answer:
        "You can add as many folders as you want from different locations. The app creates a unified library while keeping your files exactly where they are.",
    },
    {
      question: "Does it work offline?",
      answer:
        "Yes! The app works fully offline. In fact, it is one of its core features. All your media, tags, and organization features are available without an internet connection.",
    },
    {
      question: "What file formats are supported?",
      answer:
        "We support all major formats including MP4, MOV, AVI for videos; JPG, PNG, HEIC, RAW for photos; and MP3, FLAC, WAV for music. HTML5-incompatible formats are automatically transcoded for the web interface.",
    },
  ];

  return (
    <div className="relative z-10 w-full px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h3 className="text-balance text-2xl font-bold text-foreground md:text-4xl">
            Frequently Asked Questions
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-base md:text-lg text-muted-foreground">
            Everything you need to know about our app. Can&apos;t find what
            you&apos;re looking for? Reach out to our support team.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-border bg-card/80 backdrop-blur-sm transition-all duration-300 hover:border-primary/50"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="flex w-full items-center justify-between gap-3 md:gap-4 p-4 md:p-6 text-left transition-colors"
              >
                <span className="text-base md:text-lg font-semibold text-foreground">
                  {faq.question}
                </span>
                <div className="shrink-0">
                  {openFaq === index ? (
                    <Minus className="size-5 text-primary transition-transform duration-300" />
                  ) : (
                    <Plus className="size-5 text-muted-foreground transition-transform duration-300" />
                  )}
                </div>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openFaq === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="border-t border-border/50 px-6 pb-6 pt-4">
                  <p className="text-pretty leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqSection;
