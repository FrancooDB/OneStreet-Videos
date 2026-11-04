import { useMemo } from "react";
import { createTikTokStyleCaptions } from "@remotion/captions";
import type { Caption, TikTokPage } from "@remotion/captions";
import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { captions as style, font, timeline } from "./brand";
import captionsData from "./data/captions.json";

// Subtítulos corridos al mismo origen que el video recortado (ver timeline en brand.ts)
const shiftedCaptions: Caption[] = (captionsData as Caption[])
  .filter((c) => c.endMs > timeline.trimStartMs)
  .map((c) => ({
    ...c,
    startMs: Math.max(0, c.startMs - timeline.trimStartMs),
    endMs: c.endMs - timeline.trimStartMs,
    timestampMs: c.timestampMs === null ? null : c.timestampMs - timeline.trimStartMs,
  }));

const CaptionPage: React.FC<{ page: TikTokPage }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const absoluteTimeMs = page.startMs + (frame / fps) * 1000;
  const pop = spring({ frame, fps, config: { damping: 15, stiffness: 200 }, durationInFrames: 10 });

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: style.paddingBottom }}>
      <div
        style={{
          fontFamily: font.family,
          fontStyle: font.style,
          fontWeight: font.headingWeight,
          fontSize: style.fontSize,
          lineHeight: 1.15,
          textAlign: "center",
          textTransform: font.transform,
          whiteSpace: "pre-wrap",
          padding: "0 70px",
          transform: `scale(${0.85 + 0.15 * pop})`,
          opacity: pop,
          WebkitTextStroke: `${style.strokeWidth}px ${style.strokeColor}`,
          paintOrder: "stroke fill",
        }}
      >
        {page.tokens.map((token, i) => {
          const isActive = token.fromMs <= absoluteTimeMs && token.toMs > absoluteTimeMs;
          return (
            <span key={`${token.fromMs}-${i}`} style={{ color: isActive ? style.activeColor : style.textColor }}>
              {token.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Captions: React.FC = () => {
  const { fps } = useVideoConfig();
  const { pages } = useMemo(
    () =>
      createTikTokStyleCaptions({
        captions: shiftedCaptions,
        combineTokensWithinMilliseconds: style.switchEveryMs,
      }),
    [],
  );

  return (
    <AbsoluteFill>
      {pages.map((page, index) => {
        const next = pages[index + 1] ?? null;
        const lastToken = page.tokens[page.tokens.length - 1];
        const endMs = Math.min(next ? next.startMs : Infinity, lastToken.toMs + 250);
        const from = Math.round((page.startMs / 1000) * fps);
        const durationInFrames = Math.round(((endMs - page.startMs) / 1000) * fps);
        if (durationInFrames <= 0) {
          return null;
        }
        return (
          <Sequence key={index} from={from} durationInFrames={durationInFrames}>
            <CaptionPage page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
