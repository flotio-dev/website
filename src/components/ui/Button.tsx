'use client';

import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress } from '@mui/material';
import Link from 'next/link';
import { forwardRef, ReactNode } from 'react';
import { colors } from '@/theme';

interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'contained' | 'outlined' | 'text';
  href?: string;
  endIcon?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ loading, disabled, children, variant = 'primary', href, sx, endIcon, ...props }, ref) => {
    const variantStyles = {
      primary: {
        bgcolor: colors.primary.main,
        color: colors.text.dark.primary,
        border: 'none',
        '&:hover': {
          bgcolor: colors.primary.dark,
          boxShadow: `0 8px 32px ${colors.primary.main}66`,
          transform: 'translateY(-2px)',
        },
      },
      secondary: {
        bgcolor: colors.background.dark.card,
        color: colors.text.dark.primary,
        border: `1px solid ${colors.border.dark.hover}`,
        '&:hover': {
          bgcolor: colors.background.dark.cardHover,
          borderColor: colors.border.dark.hover,
          transform: 'translateY(-2px)',
        },
      },
    };

    const isCustomVariant = variant === 'primary' || variant === 'secondary';

    const baseStyles = isCustomVariant
      ? {
          fontWeight: 600,
          fontSize: '1.25rem',
          textTransform: 'none',
          borderRadius: '10px',
          px: 10,
          py: 3,
          minWidth: '280px',
          minHeight: '70px',
          boxShadow: 'none',
          transition: 'all 0.2s ease',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          ...variantStyles[variant],
          ...sx,
        }
      : sx;

    const muiVariant = isCustomVariant ? 'contained' : variant;

    const buttonContent = (
      <>
        {loading ? <CircularProgress size={24} color="inherit" /> : children}
        {endIcon && !loading && endIcon}
      </>
    );

    if (href) {
      return (
        <MuiButton
          ref={ref}
          component={Link}
          href={href}
          variant={muiVariant}
          disabled={loading || disabled}
          sx={baseStyles}
          {...props}
        >
          {buttonContent}
        </MuiButton>
      );
    }

    return (
      <MuiButton
        ref={ref}
        variant={muiVariant}
        disabled={loading || disabled}
        sx={baseStyles}
        {...props}
      >
        {buttonContent}
      </MuiButton>
    );
  }
);

Button.displayName = 'Button';

export default Button;
