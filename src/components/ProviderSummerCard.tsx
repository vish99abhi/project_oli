import {
  Box,
  Paper,
  Stack,
  Avatar,
  Typography,
  Button,
  Divider,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

const BORDER = '#E6DFD8';
const BROWN = '#B89072';
const BROWN_SOFT = '#E9DACE';
const TEXT_MUTED = '#8B8B8B';

type Props = {
  providerName?: string;
  providerSubtitle?: string;
  location?: string;
  treatment?: string;
  dateTime?: string;
  onChangeProvider?: () => void;
  onEditAddress?: () => void;
  onEditTreatment?: () => void;
  onEditDateTime?: () => void;
};

export default function ProviderSummaryCard({
  providerName = 'Loreal US',
  providerSubtitle = 'Specializes in Anti-Aging Treatments',
  location = '1493 Providence Lane, Springfield, IL, USA',
  treatment = 'Microneedling',
  dateTime = 'July 18, 2025, 10:00 AM–11:00 AM',
  onChangeProvider,
  onEditAddress,
  onEditTreatment,
  onEditDateTime,
}: Props) {
  return (
    <Box>
        <Paper
      variant="outlined"
      sx={{
        mx: 2,
        borderColor: BORDER,
        borderRadius: 2,
        overflow: 'hidden',
        background:
          'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(250,247,243,0.65) 100%)',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: '#EFE7E0',
              }}
            />
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: 22, color: '#6B4F3B' }}>
                {providerName}
              </Typography>
              <Typography sx={{ fontSize: 14, color: BROWN }}>
                {providerSubtitle}
              </Typography>
            </Box>
          </Stack>

          <Button
            onClick={onChangeProvider}
            sx={{
              textTransform: 'none',
              color: BROWN,
              fontWeight: 700,
              '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
            }}
          >
            Change Provider
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ borderColor: BORDER }} />

      {/* Body rows */}
      <Box sx={{ p: 2.5 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          {/* Left: labels and values */}
          <Stack spacing={3} flex={1}>
            <FieldBlock label="Location (we come to you!)" value={location} />
            <FieldBlock label="Treatment" value={treatment} />
            <FieldBlock label="Date & Time" value={dateTime} />
          </Stack>

          {/* Right: edit actions */}
          <Stack spacing={3} width={{ xs: '100%', md: 170 }}>
            <PillButton onClick={onEditAddress} label="Edit Address" />
            <PillButton onClick={onEditTreatment} label="Edit Treatment" />
            <PillButton onClick={onEditDateTime} label="Date / Time" />
          </Stack>
        </Stack>
      </Box>
    </Paper>
      <Box sx={{ py: 2}}>
        <Typography sx={{ fontSize: 14, color: '#333', fontWeight: 'bold' }}>
          Receive reminders by SMS/email
        </Typography>
      </Box>
    </Box>
  );
}

function FieldBlock({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography sx={{ fontSize: 14, color: TEXT_MUTED, mb: 0.5 }}>
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 800, color: '#111' }}>{value}</Typography>
    </Box>
  );
}

function PillButton({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <Button
      onClick={onClick}
      startIcon={<EditOutlinedIcon sx={{ color: BROWN }} />}
      variant="outlined"
      fullWidth
      sx={{
        justifyContent: 'flex-start',
        textTransform: 'none',
        color: '#6B4F3B',
        borderColor: BORDER,
        backgroundColor: '#FFF7F0',
        borderRadius: 999,
        fontWeight: 700,
        px: 1.5,
        py: 1.25,
        '&:hover': {
          borderColor: BROWN,
          backgroundColor: BROWN_SOFT,
        },
      }}
    >
      {label}
    </Button>
  );
}
