'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  TextField,
  MenuItem,
  useTheme,
  Alert,
  Paper,
} from '@mui/material';
import Navbar from '@/components/landing/Navbar';
import LandingFooter from '@/components/landing/LandingFooter';
import Button from '@/components/ui/Button';
import EmailIcon from '@mui/icons-material/Email';
import ForumIcon from '@mui/icons-material/Forum';
import GitHubIcon from '@mui/icons-material/GitHub';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const contactTopics = [
  { value: 'support', label: 'Technical Support & Pipeline Assistance' },
  { value: 'sales', label: 'Enterprise Quotas & Dedicated Apple M2 Runners' },
  { value: 'feedback', label: 'Feature Request & Feedback' },
  { value: 'other', label: 'General Inquiry' },
];

export default function ContactPage() {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'support',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setLoading(true);
    // Simulate async submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.default,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />

      <Container maxWidth="lg" sx={{ pt: { xs: 14, md: 16 }, pb: 12, flex: 1 }}>
        {/* Page Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 }, maxWidth: 680, mx: 'auto' }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.6,
              borderRadius: '100px',
              bgcolor:
                theme.palette.mode === 'dark'
                  ? 'rgba(139, 92, 246, 0.15)'
                  : 'rgba(139, 92, 246, 0.08)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              color: '#8b5cf6',
              fontSize: '0.8rem',
              fontWeight: 600,
              mb: 2,
            }}
          >
            <SupportAgentIcon sx={{ fontSize: 16 }} />
            <span>We are here to help</span>
          </Box>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.25rem', sm: '3rem' },
              fontWeight: 800,
              color: theme.palette.text.primary,
              letterSpacing: '-0.02em',
              mb: 1.5,
            }}
          >
            Get in touch with the team
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, fontSize: '1.05rem', lineHeight: 1.6 }}>
            Have questions about Flotio CI/CD, need custom cloud build infrastructure, or looking for assistance? Reach out anytime.
          </Typography>
        </Box>

        <Grid container spacing={4} alignItems="stretch">
          {/* Contact Information & Channels */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={3} sx={{ height: '100%' }}>
              {/* Direct Email Card */}
              <Paper
                elevation={0}
                sx={{
                  p: 3.5,
                  borderRadius: '20px',
                  bgcolor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      bgcolor: 'rgba(56, 189, 248, 0.1)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#38bdf8',
                      shrink: 0,
                    }}
                  >
                    <EmailIcon sx={{ fontSize: 22 }} />
                  </Box>
                  <div>
                    <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: theme.palette.text.primary, mb: 0.5 }}>
                      Direct Email Support
                    </Typography>
                    <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.88rem', mb: 1.5, lineHeight: 1.5 }}>
                      Send us an email directly for technical questions, billing inquiries, or feedback.
                    </Typography>
                    <Typography
                      component="a"
                      href="mailto:contact@flotio.ovh"
                      sx={{
                        color: '#8b5cf6',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      contact@flotio.ovh
                    </Typography>
                  </div>
                </Box>
              </Paper>

              {/* Community & Discord Card */}
              <Paper
                elevation={0}
                sx={{
                  p: 3.5,
                  borderRadius: '20px',
                  bgcolor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      bgcolor: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#8b5cf6',
                      shrink: 0,
                    }}
                  >
                    <ForumIcon sx={{ fontSize: 22 }} />
                  </Box>
                  <div>
                    <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: theme.palette.text.primary, mb: 0.5 }}>
                      Community & Discussions
                    </Typography>
                    <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.88rem', mb: 1.5, lineHeight: 1.5 }}>
                      Join the developer community, share CI/CD tips, and follow live platform status.
                    </Typography>
                    <Typography
                      component="a"
                      href="https://github.com/flotio-dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: '#8b5cf6',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.75,
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      <GitHubIcon sx={{ fontSize: 16 }} />
                      github.com/flotio-dev
                    </Typography>
                  </div>
                </Box>
              </Paper>

              {/* Response Time SLA Card */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  bgcolor:
                    theme.palette.mode === 'dark'
                      ? 'rgba(16, 185, 129, 0.08)'
                      : 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <AccessTimeIcon sx={{ fontSize: 20, color: '#10b981' }} />
                <Typography sx={{ fontSize: '0.85rem', color: theme.palette.text.secondary, fontWeight: 500 }}>
                  Guaranteed response time: <strong style={{ color: theme.palette.text.primary }}>under 24 hours</strong> on business days.
                </Typography>
              </Paper>
            </Stack>
          </Grid>

          {/* Contact Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3.5, sm: 5 },
                borderRadius: '24px',
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                height: '100%',
              }}
            >
              {submitted ? (
                <Box
                  sx={{
                    py: 8,
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      bgcolor: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#10b981',
                      mb: 2.5,
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 36 }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 1 }}>
                    Message sent successfully!
                  </Typography>
                  <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.95rem', maxWidth: 420, mb: 3.5, lineHeight: 1.6 }}>
                    Thank you for reaching out, {formData.name}. Our engineering team will get back to you shortly at {formData.email}.
                  </Typography>
                  <Button variant="secondary" onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', topic: 'support', message: '' }); }}>
                    Send another message
                  </Button>
                </Box>
              ) : (
                <form onSubmit={handleSubmit}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 0.75 }}>
                    Send us a message
                  </Typography>
                  <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.9rem', mb: 3.5 }}>
                    Fill out the form below and our team will get back to you as quickly as possible.
                  </Typography>

                  <Stack spacing={2.5}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          required
                          label="Your Name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Jane Doe"
                          size="small"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          required
                          type="email"
                          label="Email Address"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="jane@company.com"
                          size="small"
                        />
                      </Grid>
                    </Grid>

                    <TextField
                      select
                      fullWidth
                      label="Inquiry Topic"
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      size="small"
                    >
                      {contactTopics.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      fullWidth
                      required
                      multiline
                      rows={5}
                      label="Your Message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your project, issue, or question..."
                    />

                    <Box sx={{ pt: 1 }}>
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                        sx={{ width: { xs: '100%', sm: 'auto' }, px: 4, py: 1.25 }}
                      >
                        {loading ? 'Sending...' : 'Send Message'}
                      </Button>
                    </Box>
                  </Stack>
                </form>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <LandingFooter />
    </Box>
  );
}
