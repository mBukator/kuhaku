import { RootProvider } from "fumadocs-ui/provider/next";

import "./global.css";

import { Geist, Geist_Mono } from "next/font/google";

// The tokens read these variables; a className would set the face but bypass --font-sans.
const geistSans = Geist({
    subsets: ["latin"],
    variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-geist-mono",
});

export default function Layout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable}`}
            suppressHydrationWarning
        >
            <body className="flex flex-col min-h-screen">
                <RootProvider theme={{ defaultTheme: "dark" }}>{children}</RootProvider>
            </body>
        </html>
    );
}
