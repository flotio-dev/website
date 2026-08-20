'use client';

import React from 'react';
import { Box } from '@mui/material';

interface FlotioLogoProps {
  size?: number | string;
  className?: string;
}

export default function FlotioLogo({ size = 28, className }: FlotioLogoProps) {
  return (
    <Box
      component="svg"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      sx={{
        width: size,
        height: size,
        display: 'block',
        filter: 'drop-shadow(0 2px 8px rgba(255, 87, 34, 0.35))',
      }}
    >
      <defs>
        <linearGradient id="flotio-brand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B4A" />
          <stop offset="50%" stopColor="#FF5722" />
          <stop offset="100%" stopColor="#E11D48" />
        </linearGradient>
      </defs>
      {/* Top horizontal capsule */}
      <rect x="18" y="20" width="64" height="20" rx="10" fill="url(#flotio-brand-gradient)" />
      {/* Lower stem & curved hook */}
      <path
        d="M18 48C18 42.477 22.477 38 28 38H52C57.523 38 62 42.477 62 48C62 53.523 57.523 58 52 58H38V72C38 77.523 33.523 82 28 82C22.477 82 18 77.523 18 72V48Z"
        fill="url(#flotio-brand-gradient)"
      />
    </Box>
  );
}
