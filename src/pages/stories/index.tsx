import { LandingLayout } from '@/components/layouts';
import { StoriesList } from '@/components/stories/StoriesList';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useContent } from '@/content/ContentContext';
import { getContentProps } from '@/content/getContentProps';
import { useStories } from '@/hooks';

const Stories = () => {
  const { stories, isLoading, isError } = useStories('/stories');
  const { pages } = useContent();

  return (
    <LandingLayout title={pages.stories.title} pageDescription={pages.stories.description}>
      <div className="section container">
        <SectionHeading as="h1" eyebrow={pages.stories.eyebrow} title={pages.stories.title} />
        <StoriesList stories={stories} isLoading={isLoading} isError={!!isError} />
      </div>
    </LandingLayout>
  );
};

export const getStaticProps = getContentProps;

export default Stories;
