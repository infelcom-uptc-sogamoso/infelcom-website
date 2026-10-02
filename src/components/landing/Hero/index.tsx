import { useEffect, useRef, useState } from 'react';
import NextLink from 'next/link';
import { Button } from '@mui/material';
import { ArrowForward, Pause, PlayArrow } from '@mui/icons-material';
import { SITE_FULL_NAME } from '@/utils/site';
import styles from './Hero.module.css';

export const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

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
          <p className={styles.eyebrow}>UPTC · Facultad Seccional Sogamoso</p>
          <h1 id="hero-title" className={styles.title}>
            <span className={styles.acronym}>INFELCOM</span>
            {SITE_FULL_NAME}
          </h1>
          <p className={styles.lead}>Investigamos para cambiar el mundo.</p>
          <div className={styles.actions}>
            <Button component={NextLink} href="/projects" size="large" endIcon={<ArrowForward />}>
              Ver proyectos
            </Button>
            <Button
              component={NextLink}
              href="/#contact"
              size="large"
              variant="outlined"
              sx={{
                color: '#fff',
                borderColor: 'rgba(255,255,255,.5)',
                '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,.08)' },
              }}>
              Contáctanos
            </Button>
          </div>
        </div>

        <div className={styles.media}>
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/hero/hero-poster.jpg"
            aria-label="Video de presentación de INFELCOM"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}>
            <source src="/hero/video.mp4" type="video/mp4" />
          </video>
          <button
            type="button"
            className={styles.videoBtn}
            onClick={toggleVideo}
            aria-label={playing ? 'Pausar video' : 'Reproducir video'}>
            {playing ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
          </button>
        </div>
      </div>
    </section>
  );
};
