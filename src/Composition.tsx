import { Captions } from "./Captions";
import { POPUPS, Popups } from "./Popups";
import { AbsoluteFill, Composition, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { color, format, logo, motion, popup, shape, timeline } from "./brand";

export const MyComposition = () => {
  return <Composition id="MyComp" component={VerticalReel} durationInFrames={timeline.durationFrames} fps={format.fps} width={format.width} height={format.height} />;
};

export const VerticalReel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200 } });
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  // Zoom de impacto muy sutil al entrar cada popup
  const punch = POPUPS.reduce((acc, p) => {
    const start = Math.round(((p.fromMs - timeline.trimStartMs) / 1000) * fps);
    const progress = (frame - start) / motion.punchFrames;
    return progress >= 0 && progress < 1 ? acc + motion.punchScale * Math.sin(Math.PI * progress) : acc;
  }, 1);

  return (
    <AbsoluteFill style={{ backgroundColor: color.charcoal }}>
      <AbsoluteFill style={{ transform: `scale(${punch})` }}>
        <OffthreadVideo
          src={staticFile("IMG_6182_compressed.mp4")}
          trimBefore={timeline.trimStartFrames}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
      <Sequence from={0} durationInFrames={45}>
        <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: popup.top, opacity }}>
          <div
            style={{
              transform: `translateY(${(1 - enter) * -40}px)`,
              background: color.cream,
              borderRadius: shape.radiusPill,
              padding: "36px 70px",
            }}
          >
            <Img src={logo.wordmark} style={{ width: 620, display: "block" }} />
          </div>
        </AbsoluteFill>
      </Sequence>
      <Popups />
      <Captions />
    </AbsoluteFill>
  );
};
