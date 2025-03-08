import { ProjectCard } from '@/components/projects/ProjectCard';
import { LandingLayout } from '@/components/layouts';
import { useProjects } from '@/hooks';
import { Box, Grid, Typography } from '@mui/material';
import { ListSkeleton } from '@/components/skeletons/ListSkeleton';

const Projects = () => {
  const { projects, isLoading } = useProjects('/projects');

  return (
    <LandingLayout title="Proyectos" pageDescription="Nuestros proyectos">
      <Box sx={{ padding: '60px 60px 0px', minHeight: 'calc(100vh - 168px)' }}>
        <Typography variant="h1" align="center" mb={'30px'}>
          NUESTROS PROYECTOS
        </Typography>
        <Grid
          container
          display={'flex'}
          flexDirection={'column'}
          alignItems={'center'}
          gap={1}
          sx={{ width: '100%' }}>
          {isLoading && <ListSkeleton quantity={7} width={'70%'} height={38} />}
          {projects.map((project) => (
            <ProjectCard key={project.code} project={project} />
          ))}
        </Grid>
      </Box>
    </LandingLayout>
  );
};

export default Projects;
