import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Steppers from '../common/Steppers';
import { Divider } from '@mui/material';
import { useLocation } from 'react-router-dom';

function AppHeader() {
  const { pathname } = useLocation();
  // const isHide = pathname === '/booking'
  const pathsToHide = ['/confirmation', '/booking'];
  const isHide = () => pathsToHide.includes(pathname);
  return (
    <AppBar position='static' sx={{ backgroundColor: 'whitesmoke', boxShadow: 'none' }}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters sx={{ minHeight: { xs: 72, md: 88 } }}>
          {/* Left: Brand */}
          <Typography
            variant='h3'
            noWrap
            component='a'
            href='/'
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'serif',
              fontWeight: 700,
              color: '#B89072',
              textDecoration: 'none',
            }}
            m={3}
          >
            Oli.
          </Typography>

          <Divider
            orientation='vertical'
            variant='middle'
            flexItem
            sx={{ display: { xs: 'none', md: 'flex' } }}
          />

          {/* Mobile brand (takes first row left, pushes others to next line) */}
          <Typography
            variant='h5'
            component='a'
            href='/'
            sx={{
              display: { xs: 'flex', md: 'none' },
              fontFamily: 'sans-serif',
              fontWeight: 700,
              color: '#B89072',
              textDecoration: 'none',
            }}
          >
            Oli.
          </Typography>

          {/* Desktop stepper in the center/left area; allow it to shrink */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              minWidth: 0,
              pl: 4,
              flexBasis: '600px',
              maxWidth: '50vw',
            }}
          >
            <Box sx={{ width: '100%', visibility: isHide() ? 'hidden' : null }}>
              <Steppers />
            </Box>
          </Box>

          {/* Another spacer so the brand + stepper don't hug the button */}
          <Box sx={{ flexGrow: 1, display: { xs: 'block', md: 'block' } }} />

          {/* Right: Sign in button fixed on far right */}
          <Box sx={{ flexShrink: 0 }}>
            <Button
              variant='contained'
              sx={{
                textTransform: 'none',
                backgroundColor: '#B89072',
                '&:hover': { backgroundColor: '#a67d60' },
                borderRadius: '8px',
              }}
              disableElevation
              size='large'
            >
              Sign In
            </Button>
          </Box>
        </Toolbar>

        {/* Mobile second row: Stepper */}
        <Box
          sx={{
            display: { xs: 'block', md: 'none' },
            p: 2,
            pb: 1.5,
          }}
        >
          <Steppers />
        </Box>
      </Container>
    </AppBar>
  );
}

export default AppHeader;
