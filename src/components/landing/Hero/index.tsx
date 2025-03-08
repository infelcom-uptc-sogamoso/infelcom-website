export const Hero = () => {
  return (
    <video
      id="vid"
      autoPlay
      loop
      muted
      preload="none"
      poster="/hero/hero-poster.png"
      className="hero-video">
      <source src="/hero/video.mp4" type="video/mp4" height={'calc(100vh - 64px)'} />
    </video>
  );
};
