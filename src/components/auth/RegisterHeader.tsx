import { Typography } from '@mui/material';

export default function RegisterHeader() {
  return (
    <div>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
        Inscription
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Créez votre compte Flotio
      </Typography>
    </div>
  );
}
