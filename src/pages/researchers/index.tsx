import { LandingLayout } from '@/components/layouts';
import { ResearcherList } from '@/components/researches/ResearcherList';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useResearchers } from '@/hooks';

const Researchers = () => {
  const { researchers, isLoading } = useResearchers('/researchers');

  return (
    <LandingLayout
      title="Investigadores"
      pageDescription="Docentes y estudiantes investigadores del grupo INFELCOM.">
      <div className="section container">
        <SectionHeading as="h1" eyebrow="Nosotros" title="Investigadores" />
        <ResearcherList researches={researchers} isLoading={isLoading} />
      </div>
    </LandingLayout>
  );
};

export default Researchers;
