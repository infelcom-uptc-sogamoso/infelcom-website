import type { GetStaticPaths } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Button, Chip, Skeleton, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { LandingLayout } from '@/components/layouts';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ResearcherCard } from '@/components/researches/ResearcherCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { IGroupPage } from '@/interfaces';
import { getContentProps } from '@/content/getContentProps';
import { useContent } from '@/content/ContentContext';
import { useT } from '@/i18n/useT';
import { inLocale } from '@/i18n/locale';
import people from '@/components/researches/Researchers.module.css';

/** Public page of one research group: /groups/<slug>. Everything comes from /api/group. */
const GroupPage = () => {
  const { slug } = useRouter().query;
  const { t, locale } = useT();
  const { groups: heading, site } = useContent();
  const {
    data: group,
    error,
    isLoading,
  } = useSWR<IGroupPage>(
    typeof slug === 'string' ? `/api/group?slug=${encodeURIComponent(slug)}` : null,
    { revalidateOnFocus: false },
  );
  const text = (field: string) => (group ? inLocale(group, field, locale) : '');
  const name = text('name');
  const lines = text('lines')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const block = (title: string, body: string) =>
    body && (
      <section style={{ marginTop: 32 }}>
        <Typography variant="h3" component="h2" gutterBottom>
          {title}
        </Typography>
        <Typography sx={{ whiteSpace: 'pre-line' }}>{body}</Typography>
      </section>
    );

  return (
    <LandingLayout
      title={name ? `${name} | ${site.name}` : heading.title}
      pageDescription={text('description') || heading.title}
      imageFullUrl={group?.logo}>
      <article className="section container" style={{ maxWidth: 1000 }}>
        <Button
          component={NextLink}
          href="/#groups"
          variant="text"
          startIcon={<ArrowBack />}
          sx={{ mb: 3 }}>
          {t.groups.back}
        </Button>

        {isLoading ? (
          <>
            <Skeleton variant="text" height={64} />
            <Skeleton variant="rounded" height={240} sx={{ mt: 2, borderRadius: 4 }} />
          </>
        ) : error || !group ? (
          <Typography role="alert">
            {error?.status === 404 ? t.groups.notFound : t.common.loadError}
          </Typography>
        ) : (
          <>
            <header style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
              {group.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={group.logo}
                  alt={t.groups.logoAlt(group.code)}
                  width={120}
                  height={120}
                  style={{ objectFit: 'contain' }}
                />
              )}
              <div style={{ flex: '1 1 260px', minWidth: 0 }}>
                <SectionHeading as="h1" eyebrow={group.code} title={name} />
                <Chip
                  size="small"
                  color={group.isActive ? 'success' : 'default'}
                  label={group.isActive ? t.groups.active : t.groups.inactive}
                />
              </div>
            </header>

            {text('description') && (
              <Typography
                sx={{ mt: 3, fontSize: '1.1rem', color: 'text.secondary', whiteSpace: 'pre-line' }}>
                {text('description')}
              </Typography>
            )}
            {block(t.groups.objectives, text('objectives'))}
            {lines.length > 0 && (
              <section style={{ marginTop: 32 }}>
                <Typography variant="h3" component="h2" gutterBottom>
                  {t.groups.lines}
                </Typography>
                <ul style={{ paddingInlineStart: 20, margin: 0 }}>
                  {lines.map((line) => (
                    <li key={line}>
                      <Typography>{line}</Typography>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {block(t.groups.info, text('info'))}

            <section style={{ marginTop: 40 }}>
              <Typography variant="h3" component="h2" gutterBottom>
                {t.groups.director}
              </Typography>
              {group.director ? (
                <div className={people.grid} style={{ maxWidth: 320 }}>
                  <ResearcherCard researcher={group.director} />
                </div>
              ) : (
                <Typography sx={{ color: 'text.secondary' }}>{t.groups.noDirector}</Typography>
              )}
            </section>

            {group.members.length > 0 && (
              <section style={{ marginTop: 40 }}>
                <Typography variant="h3" component="h2" gutterBottom>
                  {t.groups.members}
                </Typography>
                <div className={people.grid}>
                  {group.members.map((member) => (
                    <ResearcherCard key={member._id} researcher={member} />
                  ))}
                </div>
              </section>
            )}

            <section style={{ marginTop: 40 }}>
              <Typography variant="h3" component="h2" gutterBottom>
                {t.groups.projects}
              </Typography>
              {group.projects.length === 0 ? (
                <Typography sx={{ color: 'text.secondary' }}>{t.groups.noProjects}</Typography>
              ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                  {group.projects.map((project) => (
                    <ProjectCard key={project._id} project={project} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </article>
    </LandingLayout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => ({ paths: [], fallback: 'blocking' });
export const getStaticProps = getContentProps;

export default GroupPage;
