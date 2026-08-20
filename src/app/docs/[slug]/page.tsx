import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Container,
  Stack,
  Paper,
  Grid,
} from '@mui/material';
import Navbar from '@/components/landing/Navbar';
import LandingFooter from '@/components/landing/LandingFooter';
import DocsSidebar from '@/components/docs/DocsSidebar';
import DocsTOC from '@/components/docs/DocsTOC';
import { getAllDocs, getDocBySlug } from '@/lib/markdown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface DocPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const docs = getAllDocs();
  return docs.map((doc) => ({
    slug: doc.slug,
  }));
}

export default async function DocArticlePage({ params }: DocPageProps) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  const allDocs = getAllDocs();

  return (
    <Box sx={{ bgcolor: 'var(--bg-canvas)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <Container
        maxWidth={false}
        sx={{
          maxWidth: '1520px',
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 4, lg: 6 },
          pt: { xs: 12, md: 14 },
          pb: 12,
          flex: 1,
          display: 'flex',
          gap: { xs: 0, lg: 5, xl: 6 },
          alignItems: 'flex-start',
        }}
      >
        {/* Left Sticky Navigation */}
        <DocsSidebar docs={allDocs} />

        {/* Center Article Content */}
        <Box sx={{ flex: 1, minWidth: 0, maxWidth: { xs: '100%', lg: '960px', xl: '1040px' } }}>
          {/* Breadcrumb Bar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4, fontSize: '0.85rem' }}>
            <Link
              href="/docs"
              style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 }}
            >
              Docs
            </Link>
            <ChevronRightIcon sx={{ fontSize: 16, color: 'var(--text-muted)' }} />
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
              {doc.category}
            </span>
            <ChevronRightIcon sx={{ fontSize: 16, color: 'var(--text-muted)' }} />
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              {doc.title}
            </span>
          </Box>

          {/* Article Header Card */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3.5, sm: 5 },
              mb: 5,
              borderRadius: '20px',
              bgcolor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '4px 10px',
                    borderRadius: '100px',
                    backgroundColor: 'rgba(255, 87, 34, 0.12)',
                    color: '#ff5722',
                    border: '1px solid rgba(255, 87, 34, 0.25)',
                  }}
                >
                  {doc.category}
                </span>
                {doc.badge && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontFamily: 'monospace',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {doc.badge}
                  </span>
                )}
              </Box>

              <h1
                style={{
                  fontSize: '2.25rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {doc.title}
              </h1>

              <p
                style={{
                  fontSize: '1.05rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {doc.description}
              </p>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, pt: 1, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {doc.readTime && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <AccessTimeIcon sx={{ fontSize: 16 }} />
                    {doc.readTime}
                  </span>
                )}
                {doc.updatedAt && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CalendarMonthIcon sx={{ fontSize: 16 }} />
                    Updated {doc.updatedAt}
                  </span>
                )}
              </Box>
            </Stack>
          </Paper>

          {/* Rendered Markdown Body */}
          <article
            className="docs-content"
            style={{
              fontSize: '15px',
              lineHeight: 1.8,
              color: 'var(--text-primary)',
            }}
            dangerouslySetInnerHTML={{ __html: doc.contentHtml }}
          />

          {/* Previous / Next Navigation Cards */}
          <Grid container spacing={2.5} sx={{ mt: 8, pt: 4, borderTop: '1px solid var(--border-subtle)' }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              {doc.prevDoc ? (
                <Link
                  href={`/docs/${doc.prevDoc.slug}`}
                  style={{ textDecoration: 'none', display: 'block', height: '100%' }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      height: '100%',
                      borderRadius: '14px',
                      bgcolor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: '#ff5722',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 20px rgba(255, 87, 34, 0.15)',
                      },
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>
                      <ArrowBackIcon sx={{ fontSize: 14 }} /> PREVIOUS
                    </span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {doc.prevDoc.title}
                    </span>
                  </Paper>
                </Link>
              ) : <div />}
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              {doc.nextDoc && (
                <Link
                  href={`/docs/${doc.nextDoc.slug}`}
                  style={{ textDecoration: 'none', display: 'block', height: '100%' }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      height: '100%',
                      borderRadius: '14px',
                      bgcolor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      textAlign: 'right',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: '#ff5722',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 20px rgba(255, 87, 34, 0.15)',
                      },
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>
                      NEXT <ArrowForwardIcon sx={{ fontSize: 14 }} />
                    </span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {doc.nextDoc.title}
                    </span>
                  </Paper>
                </Link>
              )}
            </Grid>
          </Grid>
        </Box>

        {/* Right Table of Contents */}
        <DocsTOC toc={doc.toc} />
      </Container>

      <LandingFooter />
    </Box>
  );
}
