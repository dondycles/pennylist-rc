import type { Metadata, Viewport } from "next";
import { Raleway, Readex_Pro } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/query-provider";
import { UseDefaultURL } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["500", "600", "700", "900"],
  variable: "--font-raleway",
});
const readex = Readex_Pro({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-readex",
});
const APP_NAME = "pennylist.";
const APP_DEFAULT_TITLE = "pennylist.";
const APP_TITLE_TEMPLATE = "%s - pennylist";
const APP_DESCRIPTION = "The easiest way of tracking your wealth and expenses.";

export const metadata: Metadata = {
  metadataBase: new URL(UseDefaultURL()),
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${raleway.variable} ${readex.variable} antialiased font-raleway h-screen w-full bg-background`}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
