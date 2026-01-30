'use client';

import { Card as MuiCard, CardContent, CardActions, CardProps as MuiCardProps, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface CardProps extends MuiCardProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export default function Card({ title, subtitle, actions, children, ...props }: CardProps) {
  return (
    <MuiCard {...props}>
      <CardContent>
        {title && (
          <Typography variant="h5" component="h2" gutterBottom>
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {subtitle}
          </Typography>
        )}
        {children}
      </CardContent>
      {actions && <CardActions>{actions}</CardActions>}
    </MuiCard>
  );
}
