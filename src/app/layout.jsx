import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/redux/storeprovider";
import LayoutWrapper from "@/Components/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NESTRO - Modern Luxury Furniture",
  description: "Transform your living spaces with premium modern furniture from Nestro.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="w-auto flex flex-col min-h-screen scroll-smooth">
        <StoreProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}
