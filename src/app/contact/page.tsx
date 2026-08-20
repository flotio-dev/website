'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  useTheme,
  Paper,
  InputBase,
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
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import BugReportIcon from '@mui/icons-material/BugReport';

interface TopicOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const contactTopics: TopicOption[] = [
  { id: 'support', label: 'Technical Support', icon: <HelpOutlineIcon sx={{ fontSize: 16 }} /> },
  { id: 'sales', label: 'Enterprise & Dedicated Runners', icon: <RocketLaunchIcon sx={{ fontSize: 16 }} /> },
  { id: 'bug', label: 'Bug Report', icon: <BugReportIcon sx={{ fontSize: 16 }} /> },
  { id: 'other', label: 'General Inquiry', icon: <SupportAgentIcon sx={{ fontSize: 16 }} /> },
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
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.default,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Navbar />

      {/* Ambient background glow */}
      <Box
        sx={{
          position: 'absolute',
          top: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: '500px',
          background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(70px)',
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ pt: { xs: 14, md: 16 }, pb: 12, flex: 1, position: 'relative', zIndex: 1 }}>
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
            <span>Direct Engineering Support</span>
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
            Get in touch with us
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, fontSize: '1.05rem', lineHeight: 1.6 }}>
            Have questions about Flotio CI/CD, custom build runner quotas, or troubleshooting your Flutter builds? We are here to help.
          </Typography>
        </Box>

        <Grid container spacing={4} alignItems="stretch">
          {/* Left Column: Direct Info Cards */}
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
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'rgba(56, 189, 248, 0.4)',
                    boxShadow: '0 8px 24px rgba(56, 189, 248, 0.1)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: '12px',
                      bgcolor: 'rgba(56, 189, 248, 0.12)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#38bdf8',
                      flexShrink: 0,
                    }}
                  >
                    <EmailIcon sx={{ fontSize: 22 }} />
                  </Box>
                  <div>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: theme.palette.text.primary, mb: 0.5 }}>
                      Direct Email
                    </Typography>
                    <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.88rem', mb: 1.5, lineHeight: 1.5 }}>
                      Send us an email directly for technical questions, custom quotes, or partnerships.
                    </Typography>
                    <Typography
                      component="a"
                      href="mailto:contact@flotio.ovh"
                      sx={{
                        color: '#38bdf8',
                        fontWeight: 600,
                        fontSize: '0.92rem',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      contact@flotio.ovh
                    </Typography>
                  </div>
                </Box>
              </Paper>

              {/* GitHub & Community Card */}
              <Paper
                elevation={0}
                sx={{
                  p: 3.5,
                  borderRadius: '20px',
                  bgcolor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'rgba(139, 92, 246, 0.4)',
                    boxShadow: '0 8px 24px rgba(139, 92, 246, 0.1)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: '12px',
                      bgcolor: 'rgba(139, 92, 246, 0.12)',
                      border: '1px solid rgba(139, 92, 246, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#8b5cf6',
                      flexShrink: 0,
                    }}
                  >
                    <ForumIcon sx={{ fontSize: 22 }} />
                  </Box>
                  <div>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: theme.palette.text.primary, mb: 0.5 }}>
                      GitHub Community & Issues
                    </Typography>
                    <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.88rem', mb: 1.5, lineHeight: 1.5 }}>
                      Join the open community, submit feature requests, and report issues directly.
                    </Typography>
                    <Typography
                      component="a"
                      href="https://github.com/flotio-dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: '#8b5cf6',
                        fontWeight: 600,
                        fontSize: '0.92rem',
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
                <AccessTimeIcon sx={{ fontSize: 22, color: '#10b981' }} />
                <Typography sx={{ fontSize: '0.88rem', color: theme.palette.text.secondary, fontWeight: 500 }}>
                  Guaranteed response time: <strong style={{ color: theme.palette.text.primary }}>under 24h</strong> on business days.
                </Typography>
              </Paper>
            </Stack>
          </Grid>

          {/* Right Column: Modern Polished Contact Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3.5, sm: 5 },
                borderRadius: '24px',
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow:
                  theme.palette.mode === 'dark'
                    ? '0 12px 40px rgba(0, 0, 0, 0.4)'
                    : '0 12px 30px rgba(0, 0, 0, 0.05)',
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
                      width: 68,
                      height: 68,
                      borderRadius: '50%',
                      bgcolor: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#10b981',
                      mb: 2.5,
                      boxShadow: '0 0 25px rgba(16, 185, 129, 0.2)',
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 38 }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: theme.palette.text.primary, mb: 1 }}>
                    Message sent successfully!
                  </Typography>
                  <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.95rem', maxWidth: 420, mb: 3.5, lineHeight: 1.6 }}>
                    Thank you for reaching out, <strong style={{ color: theme.palette.text.primary }}>{formData.name}</strong>. Our engineering team will get back to you shortly at <strong style={{ color: theme.palette.text.primary }}>{formData.email}</strong>.
                  </Typography>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', topic: 'support', message: '' });
                    }}
                  >
                    Send another message
                  </Button>
                </Box>
              ) : (
                <form onSubmit={handleSubmit}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: theme.palette.text.primary, mb: 0.75, letterSpacing: '-0.01em' }}>
                    Send us a message
                  </Typography>
                  <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.9rem', mb: 3.5 }}>
                    Fill in your details below and our team will get back to you swiftly.
                  </Typography>

                  <Stack spacing={3}>
                    {/* Name and Email in 2 columns */}
                    <Grid container spacing={2.5}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: theme.palette.text.primary, mb: 1 }}>
                          Your Name <span style={{ color: '#ef4444' }}>*</span>
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.25,
                            px: 2,
                            py: 1.2,
                            borderRadius: '12px',
                            bgcolor: theme.palette.mode === 'dark' ? '#090a0f' : '#f8fafc',
                            border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)'}`,
                            transition: 'all 0.2s',
                            '&:focus-within': {
                              borderColor: '#8b5cf6',
                              boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.2)',
                            },
                          }}
                        >
                          <PersonOutlineIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                          <InputBase
                            required
                            fullWidth
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Alex Morgan"
                            sx={{
                              fontSize: '0.9rem',
                              color: theme.palette.text.primary,
                              '& input::placeholder': { color: '#64748b', opacity: 1 },
                            }}
                          />
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: theme.palette.text.primary, mb: 1 }}>
                          Email Address <span style={{ color: '#ef4444' }}>*</span>
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.25,
                            px: 2,
                            py: 1.2,
                            borderRadius: '12px',
                            bgcolor: theme.palette.mode === 'dark' ? '#090a0f' : '#f8fafc',
                            border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)'}`,
                            transition: 'all 0.2s',
                            '&:focus-within': {
                              borderColor: '#8b5cf6',
                              boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.2)',
                            },
                          }}
                        >
                          <AlternateEmailIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                          <InputBase
                            required
                            fullWidth
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="alex@company.com"
                            sx={{
                              fontSize: '0.9rem',
                              color: theme.palette.text.primary,
                              '& input::placeholder': { color: '#64748b', opacity: 1 },
                            }}
                          />
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Inquiry Topic / Pill Buttons */}
                    <Box>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: theme.palette.text.primary, mb: 1.25 }}>
                        Topic of Inquiry
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
                        {contactTopics.map((topic) => {
                          const isSelected = formData.topic === topic.id;
                          return (
                            <Box
                              key={topic.id}
                              onClick={() => setFormData({ ...formData, topic: topic.id })}
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                px: 2,
                                py: 1,
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontSize: '0.82rem',
                                fontWeight: isSelected ? 600 : 500,
                                transition: 'all 0.2s',
                                bgcolor: isSelected
                                  ? 'rgba(139, 92, 246, 0.2)'
                                  : theme.palette.mode === 'dark'
                                    ? '#090a0f'
                                    : '#f8fafc',
                                border: isSelected
                                  ? '1px solid #8b5cf6'
                                  : `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'}`,
                                color: isSelected
                                  ? '#c4b5fd'
                                  : theme.palette.text.secondary,
                                '&:hover': {
                                  borderColor: isSelected ? '#8b5cf6' : 'rgba(139, 92, 246, 0.5)',
                                  color: theme.palette.text.primary,
                                },
                              }}
                            >
                              <Box sx={{ color: isSelected ? '#8b5cf6' : '#94a3b8', display: 'flex' }}>
                                {topic.icon}
                              </Box>
                              <span>{topic.label}</span>
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>

                    {/* Message Area */}
                    <Box>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: theme.palette.text.primary, mb: 1 }}>
                        Your Message <span style={{ color: '#ef4444' }}>*</span>
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1.25,
                          p: 2,
                          borderRadius: '12px',
                          bgcolor: theme.palette.mode === 'dark' ? '#090a0f' : '#f8fafc',
                          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)'}`,
                          transition: 'all 0.2s',
                          '&:focus-within': {
                            borderColor: '#8b5cf6',
                            boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.2)',
                          },
                        }}
                      >
                        <ChatBubbleOutlineIcon sx={{ fontSize: 18, color: '#94a3b8', mt: 0.25 }} />
                        <InputBase
                          required
                          fullWidth
                          multiline
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Tell us about your requirements, project setup, or any issue you encountered..."
                          sx={{
                            fontSize: '0.9rem',
                            color: theme.palette.text.primary,
                            '& textarea::placeholder': { color: '#64748b', opacity: 1 },
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Bottom Action & Privacy Notice */}
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'stretch', sm: 'center' },
                        justifyContent: 'space-between',
                        gap: 2,
                        pt: 1,
                      }}
                    >
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                        endIcon={<SendIcon sx={{ fontSize: 16 }} />}
                        sx={{
                          py: 1.35,
                          px: 3.5,
                          borderRadius: '12px',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          boxShadow: '0 4px 20px rgba(139, 92, 246, 0.35)',
                        }}
                      >
                        {loading ? 'Sending...' : 'Send Message'}
                      </Button>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#64748b', fontSize: '0.78rem' }}>
                        <LockOutlinedIcon sx={{ fontSize: 14 }} />
                        <span>Confidential & spam-free communication.</span>
                      </Box>
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
