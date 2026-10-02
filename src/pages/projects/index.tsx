import { Skeleton } from '@mui/material';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { LandingLayout } from '@/components/layouts';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useProjects } from '@/hooks';

const Projects = () => {
  const { projects, isLoading } = useProjects('/projects');

  return (
    <LandingLayout
      title="Proyectos"
      pageDescription="Proyectos de investigación del grupo INFELCOM.">
      <div className="section container" style={{ maxWidth: 960 }}>
        <SectionHeading as="h1" eyebrow="Investigación" title="Nuestros proyectos" />
        <div style={{ display: 'grid', gap: 12 }} aria-busy={isLoading}>
          {isLoading &&
            [...Array(7)].map((_, i) => (
              <Skeleton key={i} variant="rounded" height={56} sx={{ borderRadius: 4 }} />
            ))}
          {projects.map((project) => (
            <ProjectCard key={project.code} project={project} />
          ))}
        </div>
      </div>
    </LandingLayout>
  );
};

export default Projects;
