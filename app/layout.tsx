import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import App from "./app";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "karo.vision Home Cloud",
  description: "karo.vision Home Cloud",
};

export const viewport: Viewport = {
  // Disable autozoom on input focus in iOS.
  maximumScale: 1,
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-[family-name:var(--font-geist-sans)] antialiased`}
      >
        <App>{children}</App>
      </body>
    </html>
  );
};

export default RootLayout;
