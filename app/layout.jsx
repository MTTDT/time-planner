import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Providers} from "./providers";
import { ThemeProvider } from "./context/ThemeContext";
import { RouteGuard } from './middleware';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Time planner",
  description: "Plan your time",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="w-full h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full min-h-screen m-0 p-0`}
      >
        <Providers>
          <main className="w-full min-h-screen">
          <ThemeProvider> <RouteGuard>
            {children}
          </RouteGuard></ThemeProvider>
          </main>
        </Providers>
      </body>
    </html>
  );
}
