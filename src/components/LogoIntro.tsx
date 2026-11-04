import { AbsoluteFill, Img, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { logo, popup, shape, overlay } from "../brand";

/** Logo en píldora crema al inicio del video. Desaparece antes del primer overlay. */
export const LogoIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200 } });
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  return (
    <Sequence from={0} durationInFrames={popup.logoFrames}>
      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: popup.top, opacity }}>
        <div
          style={{
            transform: `translateY(${(1 - enter) * -40}px)`,
            background: overlay.logoBg,
            borderRadius: shape.radiusPill,
            padding: popup.logoPadding,
          }}
        >
          <Img src={logo.wordmark} style={{ width: popup.logoWidth, display: "block" }} />
        </div>
      </AbsoluteFill>
    </Sequence>
  );
};
