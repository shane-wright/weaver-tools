import React from "react";
import ChatModal from "./components/ChatModal/ChatModal";
import { Box, Typography, Button, Container, Grid, Paper, useTheme } from '@mui/material';
import { styled } from '@mui/system';

// Custom styled components
const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: theme.palette.common.white,
  padding: theme.spacing(10, 2),
  textAlign: 'center',
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const App: React.FC = () => {
  const theme = useTheme();

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            Palantir
          </Typography>
          <Typography variant="h5" component="p" gutterBottom>
            A modern, local tool for AI Solutions.
          </Typography>
          <Button variant="contained" color="secondary" size="large" sx={{ mt: 3 }}>
            Get Started
          </Button>
        </Container>
      </HeroSection>

      {/* Features Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <FeatureCard elevation={3}>
              <Typography variant="h6" component="h3" gutterBottom>
                Custom Context
              </Typography>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard elevation={3}>
              <Typography variant="h6" component="h3" gutterBottom>
                Seamless RAG
              </Typography>
              <Typography>
                Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard elevation={3}>
              <Typography variant="h6" component="h3" gutterBottom>
                Easy to use
              </Typography>
              <Typography>
                Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum.
              </Typography>
            </FeatureCard>
          </Grid>
        </Grid>
      </Container>

      {/* Call to Action Section */}
      <Box sx={{ background: theme.palette.grey[100], py: 8 }}>
        <Container>
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" component="p" align="center" gutterBottom>
            Join thousands of satisfied users today.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button variant="contained" color="primary" size="large">
              Sign Up Now
            </Button>
          </Box>
        </Container>
      </Box>
      <ChatModal />
    </Box>
  );
};

export default App;