'use client';

import React, { useState } from 'react';
import { Box, Container, Typography, Stack, useTheme, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import TerminalIcon from '@mui/icons-material/Terminal';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import BoltIcon from '@mui/icons-material/Bolt';

interface CommandExample {
  id: string;
  tabLabel: string;
  command: string;
  output: string[];
}

const commandExamples: CommandExample[] = [
  {
    id: 'build-watch',
    tabLabel: 'flotio build start --watch',
    command: 'flotio build start --branch main --mode release --target aab --watch',
    output: [
      '✓ Triggered build #42 for project taxflow (branch: main, mode: release)',
      'Watching logs for build 42 in real-time...',
      '',
      '===========================================',
      'STEP: Provisioning & Environment Information',
      '===========================================',
      '- Java Version: OpenJDK 17.0.19',
      '- Target Flutter Version: 3.19.0',
      '- Android SDK: API Level 34',
      '',
      '===========================================',
      'STEP: Building Android App Bundle',
      '===========================================',
      '  Running "flutter build appbundle --release"...',
      '  ✓ Built build/app/outputs/bundle/release/app-release.aab (34.2MB)',
      '',
      '── Build Succeeded (Duration: 84s) ──',
      '✓ Artifact uploaded: https://artifacts.flotio.ovh/builds/42/app-release.aab',
    ],
  },
  {
    id: 'logs-sync',
    tabLabel: 'flotio build logs --watch',
    command: 'flotio build logs --watch 42',
    output: [
      'Watching logs for build 42 (project 15)...',
      '  Press Ctrl+C to stop.',
      '',
      '[1/6] Cloning git repository: flotio-dev/taxflow (commit 9fc6cf5)...',
      '[2/6] Restoring pre-warmed Gradle cache...',
      '[3/6] Setting up Flutter SDK 3.19.0...',
      '[4/6] Resolving pub dependencies: flutter pub get...',
      '[5/6] Injecting Keystore & Code Signing secrets from vault...',
      '[6/6] Compiling release APK binary...',
      '',
      '── Build Succeeded ──',
      '  Duration: 58s',
    ],
  },
  {
    id: 'config',
    tabLabel: 'flotio config update',
    command: 'flotio config update --flutter 3.24.5 --package com.flotio.taxflow --track production',
    output: [
      '✓ Project configuration updated successfully:',
      '  - Project ID: 15 (taxflow)',
      '  - Flutter Version: 3.24.5 (stable)',
      '  - Package Name: com.flotio.taxflow',
      '  - Google Play Track: production',
      '  - Auto Release on Main: Enabled',
    ],
  },
];

export default function CliShowcase() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeExample = commandExamples[activeTab];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeExample.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 7 }, maxWidth: 640, mx: 'auto' }}>
          <Typography
            sx={{
              display: 'inline-block',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#ff7a50',
              mb: 1,
            }}
          >
            Developer First Experience
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.85rem', md: '2.5rem' },
              color: theme.palette.text.primary,
              letterSpacing: '-0.02em',
              mb: 1.5,
            }}
          >
            Control your pipeline directly from your CLI
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, fontSize: '1rem', lineHeight: 1.6 }}>
            Never context-switch away from your terminal. Trigger builds, stream logs, manage keystores, and publish releases with one command.
          </Typography>
        </Box>

        {/* Terminal Window Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              maxWidth: 920,
              mx: 'auto',
              borderRadius: '20px',
              border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'}`,
              bgcolor: '#080a0f',
              overflow: 'hidden',
              boxShadow:
                theme.palette.mode === 'dark'
                  ? '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255, 87, 34, 0.15)'
                  : '0 20px 50px rgba(0, 0, 0, 0.15), 0 0 30px rgba(255, 87, 34, 0.1)',
            }}
          >
            {/* Terminal Window Top Bar */}
            <Box
              sx={{
                px: { xs: 2, sm: 3 },
                py: 1.75,
                bgcolor: '#0f1219',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
              }}
            >
              {/* Left: Window Dots + Title */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ display: 'flex', gap: 0.75 }}>
                  <Box sx={{ width: 11, height: 11, borderRadius: '50%', bgcolor: '#ef4444' }} />
                  <Box sx={{ width: 11, height: 11, borderRadius: '50%', bgcolor: '#f59e0b' }} />
                  <Box sx={{ width: 11, height: 11, borderRadius: '50%', bgcolor: '#10b981' }} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 1 }}>
                  <TerminalIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                  <Typography sx={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#94a3b8', fontWeight: 600 }}>
                    flotio-cli — bash
                  </Typography>
                </Box>
              </Box>

              {/* Center/Tabs */}
              <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', maxWidth: '100%' }}>
                {commandExamples.map((ex, idx) => {
                  const isActive = activeTab === idx;
                  return (
                    <Box
                      key={ex.id}
                      onClick={() => setActiveTab(idx)}
                      sx={{
                        px: 2,
                        py: 0.6,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontFamily: 'monospace',
                        transition: 'all 0.2s',
                        bgcolor: isActive ? 'rgba(255, 87, 34, 0.25)' : 'transparent',
                        border: `1px solid ${isActive ? 'rgba(255, 87, 34, 0.5)' : 'transparent'}`,
                        color: isActive ? '#ffab91' : '#64748b',
                        '&:hover': {
                          color: '#e2e8f0',
                          bgcolor: isActive ? 'rgba(255, 87, 34, 0.3)' : 'rgba(255, 255, 255, 0.04)',
                        },
                      }}
                    >
                      {ex.tabLabel}
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* Terminal Body */}
            <Box sx={{ p: { xs: 2.5, sm: 4 }, fontFamily: 'monospace', fontSize: { xs: '0.78rem', sm: '0.86rem' } }}>
              {/* Command Prompt Line */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                  mb: 3,
                  p: 1.5,
                  borderRadius: '10px',
                  bgcolor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0, flex: 1, overflowX: 'auto' }}>
                  <Typography component="span" sx={{ color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>
                    $
                  </Typography>
                  <Typography component="span" sx={{ color: '#f8fafc', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {activeExample.command}
                  </Typography>
                </Box>

                <Tooltip title={copied ? 'Copied to clipboard!' : 'Copy command'}>
                  <Box
                    onClick={handleCopy}
                    sx={{
                      p: 1,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      color: copied ? '#10b981' : '#94a3b8',
                      bgcolor: 'rgba(255, 255, 255, 0.06)',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      '&:hover': {
                        color: '#f8fafc',
                        bgcolor: 'rgba(255, 255, 255, 0.12)',
                      },
                    }}
                  >
                    {copied ? <CheckIcon sx={{ fontSize: 16 }} /> : <ContentCopyIcon sx={{ fontSize: 16 }} />}
                  </Box>
                </Tooltip>
              </Box>

              {/* Output Stream */}
              <Box sx={{ spaceY: 0.5, color: '#cbd5e1', lineHeight: 1.65, maxHeight: 340, overflowY: 'auto' }}>
                {activeExample.output.map((line, i) => {
                  let color = '#94a3b8';
                  let fontWeight = 400;

                  if (line.startsWith('✓') || line.includes('Succeeded')) {
                    color = '#34d399';
                    fontWeight = 600;
                  } else if (line.startsWith('STEP:')) {
                    color = '#38bdf8';
                    fontWeight = 700;
                  } else if (line.startsWith('===')) {
                    color = '#64748b';
                  } else if (line.startsWith('Watching logs')) {
                    color = '#a78bfa';
                  }

                  return (
                    <Box key={i} sx={{ color, fontWeight, minHeight: '1.4em', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {line}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
