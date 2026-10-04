import { LandingLayout } from '@/components/layouts';
import { ResearcherList } from '@/components/researches/ResearcherList';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useContent } from '@/content/ContentContext';
import { getContentProps } from '@/content/getContentProps';
import { useResearchers } from '@/hooks';

const Researchers = () => {
  const { researchers, isLoading, isError } = useResearchers('/researchers');
  const { pages } = useContent();

  return (
    <LandingLayout title={pages.researchers.title} pageDescription={pages.researchers.description}>
      <div className="section container">
        <SectionHeading as="h1" eyebrow={pages.researchers.eyebrow} title={pages.researchers.title} />
        <ResearcherList researches={researchers} isLoading={isLoading} isError={!!isError} />
      </div>
    </LandingLayout>
  );
};

export const getStaticProps = getContentProps;

export default Researchers;
