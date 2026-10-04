import { Skeleton } from '@mui/material';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { LandingLayout } from '@/components/layouts';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useContent } from '@/content/ContentContext';
import { getContentProps } from '@/content/getContentProps';
import { useT } from '@/i18n/useT';
import { useProjects } from '@/hooks';

const Projects = () => {
  const { projects, isLoading, isError } = useProjects('/projects');
  const { pages } = useContent();
  const { t } = useT();

  return (
    <LandingLayout title={pages.projects.title} pageDescription={pages.projects.description}>
      <div className="section container" style={{ maxWidth: 960 }}>
        <SectionHeading as="h1" eyebrow={pages.projects.eyebrow} title={pages.projects.title} />
        <div style={{ display: 'grid', gap: 12 }} aria-busy={isLoading}>
          {isLoading &&
            [...Array(7)].map((_, i) => (
              <Skeleton key={i} variant="rounded" height={56} sx={{ borderRadius: 4 }} />
            ))}
          {isError && <p role="alert">{t.common.loadError}</p>}
          {!isLoading && !isError && projects.length === 0 && <p>{t.projects.empty}</p>}
          {projects.map((project) => (
            <ProjectCard key={project.code} project={project} />
          ))}
        </div>
      </div>
    </LandingLayout>
  );
};

export const getStaticProps = getContentProps;

export default Projects;
