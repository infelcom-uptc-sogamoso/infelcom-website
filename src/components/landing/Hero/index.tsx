import { useEffect, useRef, useState } from 'react';
import NextLink from 'next/link';
import { Button } from '@mui/material';
import { ArrowForward, Pause, PlayArrow } from '@mui/icons-material';
import { useContent } from '@/content/ContentContext';
import { useT } from '@/i18n/useT';
import styles from './Hero.module.css';

export const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const { site, hero } = useContent();
  const { t } = useT();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) videoRef.current?.pause();
  }, []);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play();
    else video.pause();
  };

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{site.institution}</p>
          <h1 id="hero-title" className={styles.title}>
            <span className={styles.acronym}>{site.name}</span>
            {site.fullName}
          </h1>
          <p className={styles.lead}>{hero.lead}</p>
          <div className={styles.actions}>
            <Button
              component={NextLink}
              href={hero.primaryHref}
              size="large"
              endIcon={<ArrowForward />}>
              {hero.primaryCta}
            </Button>
            <Button
              component={NextLink}
              href={hero.secondaryHref}
              size="large"
              variant="outlined"
              sx={{
                color: '#fff',
                borderColor: 'rgba(255,255,255,.5)',
                '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,.08)' },
              }}>
              {hero.secondaryCta}
            </Button>
          </div>
        </div>

        <div className={styles.media}>
          <video
            // Remount when the admin changes the video so the new source loads
            key={hero.video}
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={hero.poster}
            aria-label={t.hero.video(site.name)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}>
            <source src={hero.video} type="video/mp4" />
          </video>
          <button
            type="button"
            className={styles.videoBtn}
            onClick={toggleVideo}
            aria-label={playing ? t.hero.pause : t.hero.play}>
            {playing ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
          </button>
        </div>
      </div>
    </section>
  );
};
