import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

const variants = {
  "1": {
    eyebrow: "AI-NATIVE ERP · CONSUMER BRANDS",
    headline: "Close in two days.",
    sub: "A perpetual ledger that posts as your business happens.",
    panel: "ledger",
  },
  "2": {
    eyebrow: "MARGIN TRUTH · DAILY",
    headline: "Know your margin every morning.",
    sub: "SKU-level margin with landed cost allocated automatically.",
    panel: "margin",
  },
  "3": {
    eyebrow: "ONE LEDGER · ONE TRUTH",
    headline: "The substrate beneath your stack.",
    sub: "Operations and finance, finally telling the same story.",
    panel: "stack",
  },
} as const;

type VariantKey = keyof typeof variants;

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const variant = (url.searchParams.get("variant") ?? "1") as VariantKey;
  const v = variants[variant] ?? variants["1"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0E0E0F",
          color: "#F0F0F2",
          display: "flex",
          flexDirection: "column",
          padding: "72px",
          fontFamily: "Inter, system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* accent glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 50% 40% at 35% 35%, rgba(110,86,207,0.35), transparent 65%)",
          }}
        />

        {/* grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            opacity: 0.6,
          }}
        />

        {/* mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, zIndex: 1 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: "#F0F0F2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: 3, background: "#0E0E0F" }} />
          </div>
          <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: -0.5 }}>
            Fosbury
          </div>
        </div>

        {/* eyebrow */}
        <div
          style={{
            marginTop: "auto",
            fontFamily: "ui-monospace, SF Mono, monospace",
            fontSize: 16,
            letterSpacing: 4,
            color: "#9E9EA6",
            zIndex: 1,
          }}
        >
          {v.eyebrow}
        </div>

        {/* headline */}
        <div
          style={{
            display: "flex",
            fontSize: 88,
            fontWeight: 500,
            letterSpacing: -2,
            lineHeight: 1.02,
            marginTop: 18,
            color: "#F0F0F2",
            zIndex: 1,
          }}
        >
          {v.headline}
        </div>

        {/* accent underline */}
        <div
          style={{
            marginTop: 20,
            width: 96,
            height: 3,
            borderRadius: 2,
            background: "#8A74E6",
            zIndex: 1,
          }}
        />

        {/* sub */}
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 26,
            color: "#9E9EA6",
            maxWidth: 880,
            lineHeight: 1.4,
            zIndex: 1,
          }}
        >
          {v.sub}
        </div>

        {/* footer row */}
        <div
          style={{
            marginTop: 36,
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#64646C",
            fontFamily: "ui-monospace, SF Mono, monospace",
            fontSize: 14,
            letterSpacing: 2,
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                background: "#8A74E6",
              }}
            />
            <span>LIVE</span>
          </div>
          <span>·</span>
          <span>SUBSTRATE.COM</span>
          <span>·</span>
          <span>VARIANT 0{variant}</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
