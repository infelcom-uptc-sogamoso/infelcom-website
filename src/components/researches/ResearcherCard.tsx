import { FC } from 'react';
import { OpenInNew } from '@mui/icons-material';
import styles from './Researchers.module.css';

interface Props {
  researcher: any;
}

export const ResearcherCard: FC<Props> = ({ researcher }) => {
  const {
    imageUrl,
    name = 'Nombre(s)',
    lastName = 'Apellido(s)',
    type = 'Descripción',
    email = 'Correo electrónico',
    cvlacUrl = '',
  } = researcher;

  return (
    <article className={styles.card}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl || '/hero/image-not-available.jpg'}
        alt={`${name} ${lastName}`}
        loading="lazy"
        className={styles.avatar}
      />
      <h3 className={styles.name}>
        {name} {lastName}
      </h3>
      <p className={styles.type}>{type}</p>
      <a href={`mailto:${email}`} className={styles.email}>
        {email}
      </a>
      {cvlacUrl && (
        <a href={cvlacUrl} target="_blank" rel="noopener noreferrer" className={styles.cvlac}>
          Ver CvLAC <OpenInNew fontSize="inherit" aria-hidden />
        </a>
      )}
    </article>
  );
};
