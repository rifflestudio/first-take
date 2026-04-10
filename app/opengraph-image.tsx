import { ImageResponse } from "next/og";

export const alt = "Riffle collaborative music creation";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 50% 40%, #2c2d31 0%, #121216 48%, #0c0c0f 100%)",
          color: "#f7f7fb",
          padding: "56px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 32,
            opacity: 0.78,
            marginBottom: 22,
            letterSpacing: 1.2,
          }}
        >
          a new playground for music creation
        </div>
        <div
          style={{
            fontSize: 88,
            fontWeight: 700,
            lineHeight: 1.04,
            maxWidth: 980,
            textTransform: "lowercase",
          }}
        >
          make music with your friends
        </div>
        <div
          style={{
            marginTop: 36,
            borderRadius: 9999,
            background: "#e8f986",
            color: "#090a0c",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 4.4,
            textTransform: "uppercase",
            padding: "18px 42px",
          }}
        >
          Go to app
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
