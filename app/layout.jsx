"use client"
import { ThemeProvider } from "./context/ThemeContext";
import { RouteGuard } from './middleware';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <RouteGuard>
            {children}
          </RouteGuard>
        </ThemeProvider>
      </body>
    </html>
  );
}