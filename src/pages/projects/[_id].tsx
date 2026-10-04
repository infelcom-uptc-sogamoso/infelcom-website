import type { GetStaticPaths } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Button, Chip, Skeleton, Typography } from '@mui/material';
import { ArrowBack, OpenInNew } from '@mui/icons-material';
import { LandingLayout } from '@/components/layouts';
import { IProject } from '@/interfaces';
import { getContentProps } from '@/content/getContentProps';
import { useContent } from '@/content/ContentContext';
import { useT } from '@/i18n/useT';
import { inLocale } from '@/i18n/locale';

const ProjectPage = () => {
  const { _id } = useRouter().query;
  const { t, locale } = useT();
  const { pages } = useContent();
  const {
    data: project,
    error,
    isLoading,
  } = useSWR<IProject>(typeof _id === 'string' ? `/api/project?_id=${_id}` : null, {
    revalidateOnFocus: false,
  });
  const title = project ? inLocale(project, 'title', locale) : '';
  const description = project ? inLocale(project, 'description', locale) : '';
  const group = project?.groupInfo;

  return (
    <LandingLayout
      title={title || pages.projects.title}
      pageDescription={description || pages.projects.description}
      imageFullUrl={project?.image}>
      <article className="section container" style={{ maxWidth: 860 }}>
        <Button
          component={NextLink}
          href="/projects"
          variant="text"
          startIcon={<ArrowBack />}
          sx={{ mb: 3 }}>
          {t.projects.back}
        </Button>
        {isLoading ? (
          <>
            <Skeleton variant="text" height={64} />
            <Skeleton variant="rounded" height={360} sx={{ mt: 2, borderRadius: 4 }} />
          </>
        ) : error || !project ? (
          <Typography role="alert">
            {error?.status === 404 || error?.status === 400
              ? t.projects.notFound
              : t.common.loadError}
          </Typography>
        ) : (
          <>
            <Typography variant="h1">{title}</Typography>
            {group && (
              <Chip
                component={NextLink}
                href={`/groups/${group.slug}`}
                clickable
                color="primary"
                variant="outlined"
                label={`${t.projects.group}: ${group.code} · ${inLocale(group, 'name', locale)}`}
                sx={{ mt: 2, maxWidth: '100%' }}
              />
            )}
            {project.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.image}
                alt={title}
                style={{
                  display: 'block',
                  width: '100%',
                  height: 'auto',
                  margin: '24px 0',
                  borderRadius: 16,
                }}
              />
            )}
            <Typography sx={{ mt: 2, whiteSpace: 'pre-line' }}>{description}</Typography>
            {project.url && (
              <Button
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<OpenInNew />}
                sx={{ mt: 3 }}>
                {t.projects.demo}
              </Button>
            )}
          </>
        )}
      </article>
    </LandingLayout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => ({ paths: [], fallback: 'blocking' });
export const getStaticProps = getContentProps;

export default ProjectPage;
