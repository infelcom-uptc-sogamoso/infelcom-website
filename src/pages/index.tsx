import { NextPage } from 'next';
import { Contact, Groups, Hero, WhatWeDo, WhyUs } from '@/components/landing';
import { LandingLayout } from '@/components/layouts';
import { StoriesList } from '@/components/stories/StoriesList';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useStories } from '@/hooks';
import { SITE_DESCRIPTION, SITE_NAME } from '@/utils/site';

const HomePage: NextPage = () => {
  const { stories, isLoading } = useStories('/stories', {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
  });

  return (
    <LandingLayout
      title={`${SITE_NAME} | Grupo de Investigación UPTC Sogamoso`}
      pageDescription={SITE_DESCRIPTION}>
      <Hero />
      <WhyUs />
      <WhatWeDo />
      <Groups />
      <section className="section" aria-labelledby="news-title">
        <div className="container">
          <SectionHeading id="news-title" eyebrow="Actualidad" title="Noticias" />
          <StoriesList stories={stories} isLoading={isLoading} limit={4} />
        </div>
      </section>
      <Contact />
    </LandingLayout>
  );
};

export default HomePage;
