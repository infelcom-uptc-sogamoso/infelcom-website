import { LandingLayout } from '@/components/layouts';
import { ResearcherList } from '@/components/researches/ResearcherList';
import { useResearchers } from '@/hooks';
import { Box } from '@mui/material';

const Researchers = () => {
  const { researchers, isLoading } = useResearchers('/researchers');

  return (
    <LandingLayout title="Investigadores" pageDescription="Investigadores">
      <Box sx={{ padding: { xs: '60px 30px 0px', sm: '60px 60px 0px' } }}>
        <ResearcherList researches={researchers} isLoading={isLoading} />
      </Box>
    </LandingLayout>
  );
};

export default Researchers;
