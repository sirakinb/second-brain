import { Composition, staticFile, Video, AbsoluteFill, Sequence, interpolate, useCurrentFrame, Easing } from 'remotion';
import { useEffect, useState } from 'react';

// Text overlay component with fade animation
const TextOverlay = ({ text, startFrame, endFrame }: { text: string; startFrame: number; endFrame: number }) => {
  const frame = useCurrentFrame();
  
  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 20, endFrame - 20, endFrame],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.ease) }
  );
  
  const translateY = interpolate(
    frame,
    [startFrame, startFrame + 20],
    [30, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) }
  );

  if (frame < startFrame || frame > endFrame) return null;

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity }}>
      <div style={{
        transform: `translateY(${translateY}px)`,
        textAlign: 'center',
        padding: '40px 60px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{
          fontSize: '64px',
          fontWeight: 'bold',
          color: 'white',
          margin: 0,
          textShadow: '0 4px 20px rgba(0,0,0,0.5)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          lineHeight: 1.3
        }}>{text}</h1>
      </div>
    </AbsoluteFill>
  );
};

// Crossfade video clip component
const FadeClip = ({ clipNumber, startFrame, duration, zIndex }: {
  clipNumber: number;
  startFrame: number;
  duration: number;
  zIndex: number;
}) => {
  const frame = useCurrentFrame();
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  
  useEffect(() => {
    setVideoSrc(staticFile(`clip_${clipNumber}.mp4`));
  }, [clipNumber]);

  if (!videoSrc) return null;

  // Fade in at start, fade out at end
  const fadeInDuration = 15;
  const fadeOutDuration = 15;
  
  const opacity = interpolate(
    frame,
    [
      startFrame,
      startFrame + fadeInDuration,
      startFrame + duration - fadeOutDuration,
      startFrame + duration
    ],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.ease) }
  );

  if (frame < startFrame || frame > startFrame + duration) return null;

  return (
    <AbsoluteFill style={{ opacity, zIndex }}>
      <Video
        src={videoSrc}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        muted
      />
    </AbsoluteFill>
  );
};

const StillAppVideo = () => {
  // Each clip is 150 frames (5 seconds), with 15 frame overlapping fades
  const clipDuration = 150;
  const fadeOverlap = 15;

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {/* 4 different video clips with crossfades */}
      <FadeClip clipNumber={1} startFrame={0} duration={clipDuration} zIndex={1} />
      <FadeClip clipNumber={2} startFrame={clipDuration - fadeOverlap} duration={clipDuration} zIndex={2} />
      <FadeClip clipNumber={3} startFrame={(clipDuration * 2) - (fadeOverlap * 2)} duration={clipDuration} zIndex={3} />
      <FadeClip clipNumber={4} startFrame={(clipDuration * 3) - (fadeOverlap * 3)} duration={clipDuration} zIndex={4} />

      {/* Text overlays - one per clip */}
      <TextOverlay text="Breathe in for 4 counts..." startFrame={20} endFrame={140} />
      <TextOverlay text="Hold for 4 counts..." startFrame={155} endFrame={275} />
      <TextOverlay text="Breathe out for 6 counts..." startFrame={295} endFrame={415} />
      <TextOverlay text="Peace is always one breath away" startFrame={445} endFrame={565} />
    </AbsoluteFill>
  );
};

export const RemotionRoot = () => (
  <>
    <Composition
      id="StillAppVideo"
      component={StillAppVideo}
      durationInFrames={600}
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);
