import { LandingLayout } from '@/components/layouts';
import { StoriesList } from '@/components/stories/StoriesList';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useStories } from '@/hooks';

const Stories = () => {
  const { stories, isLoading } = useStories('/stories');

  return (
    <LandingLayout
      title="Noticias"
      pageDescription="Últimas noticias del grupo de investigación INFELCOM.">
      <div className="section container">
        <SectionHeading as="h1" eyebrow="Actualidad" title="Últimas noticias" />
        <StoriesList stories={stories} isLoading={isLoading} />
      </div>
    </LandingLayout>
  );
};

export default Stories;
