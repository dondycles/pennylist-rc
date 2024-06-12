import type { Metadata, Viewport } from "next";
import { Raleway, Anton, Readex_Pro } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/query-provider";
import { UseDefaultURL } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

const raleway = Raleway({ subsets: ["latin"], weight: ["500", "700", "900"] });
const anton = Readex_Pro({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-anton",
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
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${raleway.className} ${anton.variable} antialiased h-screen w-full bg-background`}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
