'use client';

import { Box, Container, Typography, Grid, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import PublicIcon from '@mui/icons-material/Public';
import ShieldIcon from '@mui/icons-material/Shield';
import GitHubIcon from '@mui/icons-material/GitHub';
import HistoryIcon from '@mui/icons-material/History';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Omit<Feature, 'icon'>[] = [
  {
    title: 'Global Edge Network',
    description: 'Deploy your content to 35+ regions worldwide instantly. Low latency for everyone, everywhere.',
  },
  {
    title: 'DDoS Protection',
    description: 'Enterprise-grade security built-in. Automatic SSL, firewalls, and mitigation included.',
  },
  {
    title: 'Git Integration',
    description: 'Push to deploy. Automated previews for every pull request on GitHub, GitLab, and Bitbucket.',
  },
  {
    title: 'Instant Rollbacks',
    description: 'Made a mistake? Revert to a previous deployment version in one click with zero downtime.',
  },
];

const Features = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        pt: { xs: 16, md: 20 },
        pb: { xs: 10, md: 14 },
        bgcolor: theme.palette.background.default,
        px: { xs: 4, md: 12 },
      }}
    >
      <Container maxWidth={false} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: '85%' }}>
          <Grid container spacing={{ xs: 4, md: 6 }} justifyContent="center">
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6 }} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '10px',
                        bgcolor: theme.palette.mode === 'dark' ? theme.palette.primary.dark + '22' : theme.palette.primary.light + '22',
                        border: `1px solid ${theme.palette.primary.main}33`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {index === 0 && <PublicIcon sx={{ fontSize: 20, color: theme.palette.primary.main }} />}
                      {index === 1 && <ShieldIcon sx={{ fontSize: 20, color: theme.palette.primary.main }} />}
                      {index === 2 && <GitHubIcon sx={{ fontSize: 20, color: theme.palette.primary.main }} />}
                      {index === 3 && <HistoryIcon sx={{ fontSize: 20, color: theme.palette.primary.main }} />}
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          fontSize: '1rem',
                          mb: 1,
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: '0.875rem',
                          lineHeight: 1.7,
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Features;
