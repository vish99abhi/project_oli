import * as React from 'react';
import {
  Box,
  Stack,
  Paper,
  Typography,
  ButtonBase
} from '@mui/material';

import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';

import { format, isSameDay } from 'date-fns';

/* ===================== Palette tokens ===================== */
const BROWN = '#B89072';
const BROWN_DARK = '#9E7B61';
const GREEN = '#2EAD4A';
const BORDER = '#E6DFD8';
const TEXT_MUTED = '#6C757D';
const PANEL_BG = '#fff';

/* ===================== Types ===================== */
type Slot = {
  id: string;
  start: string;
  end: string;
  disabled?: boolean;
};
type AvailabilityMap = Record<string, Slot[]>;

/* ===================== Helpers and demo data ===================== */
const today = new Date();
const keyOf = (d: Date) => format(d, 'yyyy-MM-dd');

const demoAvailability: AvailabilityMap = (() => {
  const y = today.getFullYear();
  const m = today.getMonth();
  const d18 = keyOf(new Date(y, m, 18));
  const d22 = keyOf(new Date(y, m, 22));
  const d24 = keyOf(new Date(y, m, 24));

  return {
    [d18]: [
      { id: '1', start: '09:00 AM', end: '10:00 AM' },
      { id: '2', start: '10:00 AM', end: '11:00 AM' },
      { id: '3', start: '01:00 PM', end: '02:00 PM', disabled: true },
      { id: '4', start: '02:00 PM', end: '03:00 PM' },
      { id: '5', start: '03:00 PM', end: '04:00 PM' },
    ],
    [d22]: [
      { id: 'a', start: '09:00 AM', end: '10:00 AM' },
      { id: 'b', start: '11:00 AM', end: '12:00 PM' },
      { id: 'c', start: '01:00 PM', end: '02:00 PM' },
    ],
    [d24]: [
      { id: 'x', start: '10:00 AM', end: '11:00 AM' },
      { id: 'y', start: '12:00 PM', end: '01:00 PM' },
    ],
  };
})();

/* ===================== Custom Day (typed by inference) ===================== */
type BaseDayProps = React.ComponentProps<typeof PickersDay>;
type DayWithAvailProps = BaseDayProps & { availableDates: Set<string> };

function DayWithAvailability(props: DayWithAvailProps) {
  const { day, selected = false, outsideCurrentMonth, availableDates, ...other } = props;

  const k = keyOf(day as Date);
  const isAvailable = availableDates.has(k);
  const isSelected = selected;
  const isToday = isSameDay(day as Date, today);

  return (
    <PickersDay
      {...other}
      day={day}
      outsideCurrentMonth={outsideCurrentMonth}
      selected={isSelected}
      sx={{
        // Keep each day compact and prevent overflow
        width: 36,
        height: 36,
        m: '2px',
        fontWeight: 600,
        // Selected -> filled brown
        ...(isSelected && {
          bgcolor: BROWN,
          color: '#fff',
          '&:hover': { bgcolor: BROWN_DARK },
        }),
        // Available -> subtle green halo when not selected
        ...(isAvailable &&
          !isSelected && {
            position: 'relative',
            color: '#1b5e20',
            fontWeight: 700,
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              margin: 'auto',
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: GREEN,
              opacity: 0.2,
              zIndex: -1,
            },
          }),
        // Today outline if not selected
        ...(isToday &&
          !isSelected && {
            border: `1px solid ${BROWN}`,
          }),
      }}
    />
  );
}

/* ===================== Main component ===================== */
export default function BookingCalendarView() {

  // Start on a date that has availability for a nice first render
  const initialDate = new Date(today.getFullYear(), today.getMonth(), 18);

  const [selectedDate, setSelectedDate] = React.useState<Date>(initialDate);
  const [selectedSlotId, setSelectedSlotId] = React.useState<string | null>('2');

  const availableDates = React.useMemo(
    () => new Set(Object.keys(demoAvailability)),
    []
  );

  const dateKey = keyOf(selectedDate);
  const slots: Slot[] = demoAvailability[dateKey] ?? [];
  const titleRight = format(selectedDate, 'EEEE, MMMM d');

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{ p: 2 }}
      >
        {/* Calendar panel */}
        <Paper
          variant="outlined"
          sx={{
            borderColor: BORDER,
            p: 1.5,
            flex: 1,
            minWidth: { xs: 300, sm: 340 },
            maxWidth: { md: 420 },
            bgcolor: PANEL_BG,
            // Prevent any internal overflow from headers/grids
            overflow: 'hidden !important',
          }}
        >
          {/* <Typography sx={{ fontWeight: 700, px: 1, py: 1 }}>{titleLeft}</Typography> */}

          <DateCalendar
            value={selectedDate}
            onChange={(val) => {
              if (val) {
                setSelectedDate(val as Date);
                setSelectedSlotId(null); // clear slot when date changes
              }
            }}
            // Custom day slot
            slots={{
              day: (dayProps) => (
                <DayWithAvailability
                  {...(dayProps as BaseDayProps)}
                  availableDates={availableDates}
                />
              ),
            }}
            sx={{
              // Tighten header paddings and arrow area to avoid overflow
              '& .MuiPickersCalendarHeader-root': {
                px: 1,
                minHeight: 40,
              },
              '& .MuiPickersCalendarHeader-label': { fontWeight: 700 },
              '& .MuiPickersArrowSwitcher-root': {
                gap: 0.5,
              },
              // Make the week day labels compact
              '& .MuiDayCalendar-weekDayLabel': {
                fontSize: 12,
                color: TEXT_MUTED,
              },
              // Clamp the calendar grid to prevent growth
              '& .MuiDayCalendar-monthContainer': {
                px: 0.5,
              },
            }}
          />
        </Paper>

        {/* Time slots panel */}
        <Paper
          variant="outlined"
          sx={{
            borderColor: BORDER,
            p: 1.5,
            flex: 1,
            minWidth: { xs: 280, sm: 220 },
            maxWidth: { md: 220 },
            bgcolor: PANEL_BG,
          }}
        >
          <Typography sx={{ fontWeight: 700, px: 1, py: 1 }}>{titleRight}</Typography>
          {/* <Divider sx={{ borderColor: BORDER, mb: 1 }} /> */}

          <Stack spacing={1} sx={{ maxHeight: 360, overflowY: 'auto', pr: 0.5 }}>
            {slots.length === 0 ? (
              <Box sx={{ px: 1, py: 2, color: TEXT_MUTED }}>No times available</Box>
            ) : (
              slots.map((s) => {
                const selected = selectedSlotId === s.id;
                const disabled = !!s.disabled;
                const label = `${s.start} – ${s.end}`;

                return (
                  <ButtonBase
                    key={s.id}
                    disabled={disabled}
                    onClick={() => setSelectedSlotId(s.id)}
                    sx={{
                      width: '100%',
                      border: `1px solid ${BORDER}`,
                      borderRadius: 1,
                      p: 1.25,
                      justifyContent: 'flex-start',
                      bgcolor: selected ? BROWN : '#fff',
                      color: selected ? '#fff' : '#111',
                      '&:hover': {
                        bgcolor: selected ? BROWN_DARK : 'rgba(0,0,0,0.02)',
                      },
                      opacity: disabled ? 0.45 : 1,
                      cursor: disabled ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: 14,
                        letterSpacing: 0.2,
                      }}
                    >
                      {label}
                    </Typography>
                  </ButtonBase>
                );
              })
            )}
          </Stack>
        </Paper>
      </Stack>
    </LocalizationProvider>
  );
}
