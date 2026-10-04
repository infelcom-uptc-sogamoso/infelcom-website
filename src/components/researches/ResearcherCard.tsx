import { FC } from 'react';
import { OpenInNew } from '@mui/icons-material';
import { useT } from '@/i18n/useT';
import { inLocale } from '@/i18n/locale';
import styles from './Researchers.module.css';

interface Props {
  researcher: any;
}

export const ResearcherCard: FC<Props> = ({ researcher }) => {
  const { t, locale } = useT();
  const {
    imageUrl,
    name = t.admin.form.name,
    lastName = t.admin.form.lastName,
    email = t.admin.form.email,
    cvlacUrl = '',
  } = researcher;
  const type = inLocale(researcher, 'type', locale) || t.admin.form.description;

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
          {t.researchers.cvlac} <OpenInNew fontSize="inherit" aria-hidden />
        </a>
      )}
    </article>
  );
};
