import { useRouteError } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 3,
        textAlign: 'center'
      }}
    >
      <Typography variant="h1" color="error" gutterBottom>
        Oops!
      </Typography>
      <Typography variant="h5" gutterBottom>
        Sorry, an unexpected error has occurred.
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {error.statusText || error.message}
      </Typography>
      <Button
        variant="contained"
        onClick={() => window.location.href = '/'}
      >
        Go to Homepage
      </Button>
    </Box>
  );
};

export default ErrorPage;