import { FC } from 'react';
import { IResearcher } from '@/interfaces';
import { ResearcherCard } from './ResearcherCard';
import { CardSkeleton } from '../skeletons/CardSkeleton';
import styles from './Researchers.module.css';

interface Props {
  researches: IResearcher[];
  isLoading: boolean;
}

const isDirector = (r: IResearcher) => r.type.includes('Director') || r.type.includes('Directora');
const byName = (a: IResearcher, b: IResearcher) => a.name.localeCompare(b.name);

export const ResearcherList: FC<Props> = ({ researches, isLoading }) => {
  const shown = researches.filter((r) => r.isShowed);
  const professors = shown.filter((r) => r.role === 'professor');
  const students = shown.filter((r) => r.role === 'student');

  const groups = [
    {
      title: 'Docentes',
      people: [
        ...professors.filter(isDirector),
        ...professors.filter((r) => !isDirector(r)).sort(byName),
      ],
    },
    {
      title: 'Estudiantes',
      people: [
        ...students.filter((r) => r.type !== 'Semillero de investigación'),
        ...students.filter((r) => r.type === 'Semillero de investigación').sort(byName),
      ],
    },
  ];

  return (
    <>
      {groups.map(({ title, people }) => (
        <section key={title} className={styles.group} aria-labelledby={`team-${title}`}>
          <h2 id={`team-${title}`} className={styles.groupTitle}>
            {title}
          </h2>
          <div className={styles.grid} aria-busy={isLoading}>
            {isLoading && <CardSkeleton quantity={3} height={320} />}
            {people.map((researcher) => (
              <ResearcherCard key={researcher.code} researcher={researcher} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
};
