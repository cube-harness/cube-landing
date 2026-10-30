import { MotionProvider } from "@/components/layout/motion-provider";
import type { Metadata } from "next";
import { FAQS } from "@/lib/faq";
import { Inter, JetBrains_Mono, Cinzel } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cube-agent.pages.dev"),
  title: "Cube — Agent Harness For LLM",
  description:
    "Read and edit code, run commands with approval, and resume sessions with local memory. Choose OAuth, API keys, or Ollama/LM Studio. Add skills and MCP tools.",
  keywords: [
    "AI coding agent",
    "Terminal coding assistant",
    "CLI developer tools",
    "Local AI coding",
    "MCP tools",
    "Context compression",
    "Tool pruning",
    "SOUL.md",
    "AGENTS.md",
    "Multiple provider",
    "OAuth",
    "Cube",
  ],
  authors: [{ name: "Hoai Phuc", url: "https://github.com/hphucdev-04"}],
  creator: "Hoai Phuc (phuc.ph24012004@gmail.com)",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Cube — Agent Harness For LLM",
    description:
      "Read and edit code, run commands with approval, and resume sessions with local memory. Choose OAuth, API keys, or Ollama/LM Studio. Add skills and MCP tools.",
    url: "https://cube-agent.pages.dev/",
    siteName: "Cube",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cube — Agent Harness For LLM",
    description:
      "Read and edit code, run commands with approval, and resume sessions with local memory. Choose OAuth, API keys, or Ollama/LM Studio. Add skills and MCP tools.",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://cube-agent.pages.dev/#website",
      name: "Cube",
      url: "https://cube-agent.pages.dev/",
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://cube-agent.pages.dev/#software",
      name: "Cube",
      operatingSystem: "Windows x64, macOS arm64/x64, Linux x64",
      applicationCategory: "DeveloperApplication",
      description:
        "Read and edit code, run commands with approval, and resume sessions with local memory. Choose OAuth, API keys, or Ollama/LM Studio. Add skills and MCP tools.",
      url: "https://cube-agent.pages.dev/",
      softwareVersion: "0.1.16",
      installUrl: "https://cube-agent.pages.dev/#install",
      downloadUrl: [
        "https://cube-agent.pages.dev/install.ps1",
        "https://cube-agent.pages.dev/install.sh",
      ],
      featureList: [
        "Terminal coding agent",
        "File editing and patches",
        "Tool approval and workspace permissions",
        "OAuth and API key gateways",
        "Ollama and LM Studio",
        "Local SQLite history and durable memory",
        "Skills and MCP tools",
        "Managed background commands",
        "Parallel subagent delegation",
      ],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      author: {
        "@type": "Person",                                                                                                                   
        "name": "Hoai Phuc",                                                                                              
        "email": "mailto:phuc.ph24012004@gmail.com",                                                                                         
        "url": "https://github.com/hphucdev-04"    
      },
    },
    {
      "@type": "FAQPage",
      "@id": "https://cube-agent.pages.dev/#faq",
      mainEntity: FAQS.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} ${cinzel.variable} h-full antialiased dark scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#0A0908] text-[#F5F5F4] font-sans selection:bg-[#38BDF8]/30 selection:text-white"
      >
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
