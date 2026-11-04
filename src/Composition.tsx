import { Captions } from "./Captions";
import { POPUPS, Popups } from "./Popups";
import { AbsoluteFill, Composition, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { color, format, motion, timeline } from "./brand";
import { LogoIntro } from "./components/LogoIntro";
import { toTrimmedFrame } from "./components/timing";

export const MyComposition = () => {
  return <Composition id="MyComp" component={VerticalReel} durationInFrames={timeline.durationFrames} fps={format.fps} width={format.width} height={format.height} />;
};

export const VerticalReel: React.FC = () => {
  const frame = useCurrentFrame();
  // Zoom de impacto muy sutil al entrar cada overlay
  const punch = POPUPS.reduce((acc, p) => {
    const progress = (frame - toTrimmedFrame(p.fromMs)) / motion.punchFrames;
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
      <LogoIntro />
      <Popups />
      <Captions />
    </AbsoluteFill>
  );
};
