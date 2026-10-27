import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Cube — AI coding agent for your terminal, framed by receding architectural arches";

export default async function Image() {
  const [artwork, logo] = await Promise.all([
    readFile(join(process.cwd(), "public/assets/og-architecture.jpg"), "base64"),
    readFile(join(process.cwd(), "src/app/icon.svg"), "base64"),
  ]);

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", backgroundColor: "#0A0908", color: "#F5F5F4" }}>
        {/* The existing etching supplies real perspective, masonry and chiaroscuro. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/jpeg;base64,${artwork}`} alt="" width={1200} height={630} style={{ position: "absolute", inset: 0, objectFit: "cover" }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundImage: "linear-gradient(90deg, rgba(10,9,8,0.97) 0%, rgba(10,9,8,0.86) 38%, rgba(10,9,8,0.18) 100%)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundImage: "linear-gradient(0deg, rgba(10,9,8,0.85) 0%, transparent 48%, rgba(10,9,8,0.35) 100%)" }} />
        <div style={{ position: "absolute", left: 36, top: 36, right: 36, bottom: 36, border: "1px solid rgba(120,113,108,0.6)" }} />
        <div style={{ position: "absolute", left: 36, right: 36, top: 128, height: 1, backgroundColor: "rgba(120,113,108,0.5)" }} />
        <div style={{ position: "absolute", left: 756, top: 36, bottom: 36, width: 1, backgroundColor: "rgba(120,113,108,0.3)" }} />
        <div style={{ position: "absolute", left: 36, right: 36, top: 526, height: 1, backgroundColor: "rgba(120,113,108,0.5)" }} />
        <div style={{ display: "flex", position: "absolute", top: 54, left: 62, alignItems: "center", gap: 15 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`data:image/svg+xml;base64,${logo}`} alt="" width={44} height={44} />
          <span style={{ fontSize: 31, fontWeight: 700, letterSpacing: 5 }}>CUBE</span>
          <span style={{ marginLeft: 18, fontSize: 13, letterSpacing: 3, color: "#A8A29E" }}>TERMINAL CLI</span>
        </div>
        <div style={{ display: "flex", position: "absolute", top: 73, right: 63, fontSize: 13, letterSpacing: 3, color: "#D6D3D1" }}>I // VI</div>
        <div style={{ display: "flex", position: "absolute", left: 64, top: 160, flexDirection: "column", width: 675 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#A8A29E", fontSize: 13, letterSpacing: 3 }}>
            <div style={{ width: 7, height: 7, backgroundColor: "#38BDF8" }} />
            AI CODING AGENT
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 24, fontSize: 62, fontWeight: 700, lineHeight: 1.07, letterSpacing: -2 }}>
            <span>Your terminal.</span>
            <span>Your coding agent.</span>
          </div>
          <div style={{ display: "flex", marginTop: 27, maxWidth: 590, fontSize: 21, lineHeight: 1.5, color: "#D6D3D1" }}>
            Read, edit and run with approval. Keep local memory. Bring your own models, skills and MCP tools.
          </div>
        </div>
        <div style={{ display: "flex", position: "absolute", bottom: 64, left: 64, right: 64, justifyContent: "space-between", fontSize: 13, letterSpacing: 2, color: "#A8A29E" }}>
          <span>WINDOWS / macOS / LINUX</span>
          <span>OAUTH / API KEYS / LOCAL MODELS</span>
        </div>
        <div style={{ position: "absolute", right: 21, top: 310, width: 29, height: 1, backgroundColor: "#38BDF8" }} />
        <div style={{ position: "absolute", right: 35, top: 296, width: 1, height: 29, backgroundColor: "#38BDF8" }} />
      </div>
    ),
    size,
  );
}
