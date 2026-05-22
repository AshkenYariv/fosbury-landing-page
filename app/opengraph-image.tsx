import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Fosbury — Run revenue on signals, not stories.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(900px 500px at 85% 12%, rgba(234, 90, 30, 0.10), transparent 60%), #FBF8F3",
          color: "#111111",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="64" height="64" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="7" fill="#1c1814" />
            <path
              d="M6.5 22 Q 16 5 25.5 22"
              stroke="#f5f1e8"
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
            />
            <line
              x1="5"
              y1="25"
              x2="27"
              y2="25"
              stroke="#c0512e"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
          <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.01em" }}>
            Fosbury
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            maxWidth: 980,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 84,
              fontWeight: 500,
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
            }}
          >
            <span>Run revenue on signals,</span>
            <span style={{ display: "flex", gap: 16 }}>
              <span>not</span>
              <span style={{ color: "#EA5A1E" }}>stories.</span>
            </span>
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.45,
              color: "#3A332C",
              maxWidth: 880,
            }}
          >
            Calls, product, email, support — captured automatically. A forecast you can defend.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#857C72",
          }}
        >
          <span>fosbury.ai</span>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                background: "#EA5A1E",
              }}
            />
            For revenue leaders
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
