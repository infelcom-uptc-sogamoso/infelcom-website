import { FC } from 'react';
import { IResearcher } from '@/interfaces';
import { Box, Divider, Grid, Typography } from '@mui/material';
import { ResearcherCard } from './ResearcherCard';
import { CardSkeleton } from '../skeletons/CardSkeleton';

interface Props {
  researches: IResearcher[];
  isLoading: boolean;
}

export const ResearcherList: FC<Props> = ({ researches, isLoading }) => {
  const professors = researches.filter(
    (researcher) => researcher.role === 'professor' && researcher.isShowed,
  );
  const students = researches.filter(
    (researcher) => researcher.role === 'student' && researcher.isShowed,
  );

  const topProfessors = professors.filter(
    (researcher) => researcher.type.includes('Director') || researcher.type.includes('Directora'),
  );
  const commonProfessors = professors
    .filter(
      (researcher) =>
        !(researcher.type.includes('Director') || researcher.type.includes('Directora')),
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const topStudents = students.filter(
    (researcher) => researcher.type !== 'Semillero de investigación',
  );
  const commonStudents = students
    .filter((researcher) => researcher.type === 'Semillero de investigación')
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Box>
      <Typography variant="h1" align="center" mb={'30px'}>
        DOCENTES
      </Typography>
      <Grid container spacing={4}>
        {isLoading && <CardSkeleton quantity={3} width={300} height={340} />}
        {topProfessors.map((researcher) => (
          <ResearcherCard key={researcher.code} researcher={researcher} />
        ))}
        {commonProfessors.map((researcher) => (
          <ResearcherCard key={researcher.code} researcher={researcher} />
        ))}
      </Grid>
      <Divider sx={{ mt: '30px' }} />
      <Typography variant="h1" align="center" mt={'30px'} mb={'30px'}>
        ESTUDIANTES
      </Typography>
      <Grid container spacing={4}>
        {isLoading && <CardSkeleton quantity={3} width={300} height={340} />}
        {topStudents.map((researcher) => (
          <ResearcherCard key={researcher.code} researcher={researcher} />
        ))}
        {commonStudents.map((researcher) => (
          <ResearcherCard key={researcher.code} researcher={researcher} />
        ))}
      </Grid>
    </Box>
  );
};
