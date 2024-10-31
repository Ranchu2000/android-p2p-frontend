// app/layout.tsx
import { ReactNode } from "react";
import Head from "next/head";
import "@/styles/global.css";

export const metadata = {
  title: "My App",
  description: "An example app with Next.js",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>
      <body>{children}</body>
    </html>
  );
}
