import { NextPage } from 'next';
import { Contact, Groups, Hero, WhatWeDo, WhyUs } from '@/components/landing';
import { LandingLayout } from '@/components/layouts';
import { StoriesList } from '@/components/stories/StoriesList';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useContent } from '@/content/ContentContext';
import { getContentProps } from '@/content/getContentProps';
import { useStories } from '@/hooks';

const HomePage: NextPage = () => {
  const { site, news } = useContent();
  const { stories, isLoading, isError } = useStories('/stories', {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
  });

  return (
    <LandingLayout title={`${site.name} | ${site.fullName}`} pageDescription={site.description}>
      <Hero />
      <WhyUs />
      <WhatWeDo />
      <Groups />
      <section className="section" aria-labelledby="news-title">
        <div className="container">
          <SectionHeading id="news-title" eyebrow={news.eyebrow} title={news.title} />
          <StoriesList stories={stories} isLoading={isLoading} isError={!!isError} limit={4} />
        </div>
      </section>
      <Contact />
    </LandingLayout>
  );
};

export const getStaticProps = getContentProps;

export default HomePage;
