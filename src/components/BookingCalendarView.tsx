import * as React from "react";
import { Box, Stack, Paper, Typography, ButtonBase } from "@mui/material";

import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";

import { format, isSameDay } from "date-fns";
import { useUserDetails } from "../store/UserContext";
import {
  createBooking,
  getAvailableSlots,
} from "../api/zenoti-api/services/zenotiService";

/* ===================== Palette tokens ===================== */
const BROWN = "#B89072";
const BROWN_DARK = "#9E7B61";
const GREEN = "#2EAD4A";
const BORDER = "#E6DFD8";
const TEXT_MUTED = "#6C757D";
const PANEL_BG = "#fff";

/* ===================== Types ===================== */
type Slot = {
  id: string;
  start: string;
  end: string;
  disabled?: boolean;
};

interface TimeSlot {
  id: string;
  start: string;
  end: string;
  disabled?: boolean;
}

interface AvailabilityMap {
  [date: string]: TimeSlot[];
}

interface ApiSlot {
  Time: string;
  Warnings: any;
  Priority: number;
  Available: boolean;
  SalePrice: any;
}

/* ===================== Helpers ===================== */
const today = new Date();

// Helper function to create date key - FIXED to avoid timezone issues
const keyOf = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper function to format time to 12-hour format
const formatTo12Hour = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// Main conversion function with debugging
const convertApiResponseToAvailabilityMap = (
  apiResponse: ApiSlot[]
): AvailabilityMap => {
  const availabilityMap: AvailabilityMap = {};

  apiResponse.forEach((slot) => {
    // Parse the ISO string to Date object
    const startTime = new Date(slot.Time);

    // Calculate end time (assuming 30-minute slots)
    const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);

    // Get date key using the fixed keyOf function
    const dateKey = keyOf(startTime);
    console.log("📅 Slot date key:", dateKey, "from", slot.Time);

    // Initialize array for this date if it doesn't exist
    if (!availabilityMap[dateKey]) {
      availabilityMap[dateKey] = [];
    }

    // Create time slot object
    const timeSlot: TimeSlot = {
      id: (availabilityMap[dateKey].length + 1).toString(),
      start: formatTo12Hour(startTime),
      end: formatTo12Hour(endTime),
      ...(slot.Available === false && { disabled: true }),
    };

    availabilityMap[dateKey].push(timeSlot);
  });

  return availabilityMap;
};

/* ===================== Custom Day Component ===================== */
type BaseDayProps = React.ComponentProps<typeof PickersDay>;
type DayWithAvailProps = BaseDayProps & { availableDates: Set<string> };

function DayWithAvailability(props: DayWithAvailProps) {
  const {
    day,
    selected = false,
    outsideCurrentMonth,
    availableDates,
    ...other
  } = props;

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
        width: 36,
        height: 36,
        m: "2px",
        fontWeight: 600,
        ...(isSelected && {
          bgcolor: BROWN,
          color: "#fff",
          "&:hover": { bgcolor: BROWN_DARK },
        }),
        ...(isAvailable &&
          !isSelected && {
            position: "relative",
            color: "#1b5e20",
            fontWeight: 700,
            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              margin: "auto",
              width: 28,
              height: 28,
              borderRadius: "50%",
              backgroundColor: GREEN,
              opacity: 0.2,
              zIndex: -1,
            },
          }),
        ...(isToday &&
          !isSelected && {
            border: `1px solid ${BROWN}`,
          }),
      }}
    />
  );
}

// Function to format Date object to YYYY-MM-DD string
const formatDateToString = (dateObj: Date): string => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/* ===================== Main component ===================== */
export default function BookingCalendarView({
  selectedDate,
  setSelectedDate,
  selectedSlotId,
  setSelectedSlotId,
}: any) {
  const { selectedServices, guestDetails, setBookingDetails } =
    useUserDetails();

  // **FIXED STATE: Replace demoAvailability with dynamic data**
  const [availabilityData, setAvailabilityData] =
    React.useState<AvailabilityMap>({});
  const [isLoading, setIsLoading] = React.useState(false);

  // **FIXED: Properly memoized available dates from API data**
  const availableDates = React.useMemo(() => {
    const dateKeys = Object.keys(availabilityData);
    return new Set(dateKeys);
  }, [availabilityData]);

  const dateKey = keyOf(selectedDate);
  const slots: Slot[] = availabilityData[dateKey] ?? [];
  const titleRight = format(selectedDate, "EEEE, MMMM d");

  // Debug current state
  React.useEffect(() => {
    console.log("🔍 Component State Debug:", {
      selectedDate,
      dateKey,
      availabilityData,
      availabilityDataKeys: Object.keys(availabilityData),
      slots,
      slotsLength: slots.length,
      availableDates: Array.from(availableDates),
    });
  }, [selectedDate, availabilityData, dateKey, slots, availableDates]);

  // Create booking payload function
  const createBookingPayload = React.useCallback(
    (date: Date) => {
      const items: Array<{ item: { id: string } }> = [];
      const formattedDate = formatDateToString(date);

      selectedServices.forEach((category: any) => {
        category.services.forEach((service: any) => {
          items.push({
            item: {
              id: service.serviceId,
            },
          });
        });
      });

      return {
        center_id: guestDetails.center_id,
        date: formattedDate,
        guests: [
          {
            id: guestDetails.user_id,
            items: items,
          },
        ],
      };
    },
    [selectedServices, guestDetails]
  );

  // **FIXED: Fetch availability data with better error handling**
  const fetchAvailabilityForDate = React.useCallback(
    async (date: Date) => {
      console.log("🚀 Fetching availability for date:", date);

      if (!guestDetails?.center_id || !selectedServices?.length) {
        console.log("❌ Missing required data:", {
          center_id: guestDetails?.center_id,
          selectedServicesLength: selectedServices?.length,
        });
        return;
      }

      setIsLoading(true);
      try {
        const bookingPayload = createBookingPayload(date);
        console.log("📦 Booking Payload:", bookingPayload);

        // Create booking to get slots
        const response = await createBooking(bookingPayload);
        setBookingDetails(response);
        console.log("✅ Booking created successfully. ID:", response.id);

        // Get available slots
        const bookingTiming = await getAvailableSlots(response.id);

        // Check if slots exist and is array
        if (!bookingTiming.slots || !Array.isArray(bookingTiming.slots)) {
          console.error("❌ Invalid slots data:", bookingTiming.slots);
          return;
        }

        // Convert to availability map
        const newAvailabilityMap = convertApiResponseToAvailabilityMap(
          bookingTiming.slots
        );
        console.log("🗺️ Converted Availability Map:", newAvailabilityMap);

        // **FIXED: Update state properly**
        setAvailabilityData((prev) => {
          const updated = {
            ...prev,
            ...newAvailabilityMap,
          };

          return updated;
        });
      } catch (error) {
        console.error("💥 Error fetching availability:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [createBookingPayload, guestDetails, selectedServices]
  );

  // **Handle date selection with API call**
  const handleDateChange = async (newDate: Date | null) => {
    if (!newDate) return;

    setSelectedDate(newDate);
    setSelectedSlotId(null); // Reset selected slot

    // Always fetch fresh data (remove caching for debugging)
    await fetchAvailabilityForDate(newDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ p: 2 }}>
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
            overflow: "hidden !important",
          }}
        >
          <DateCalendar
            value={selectedDate}
            onChange={handleDateChange}
            slots={{
              day: (dayProps) => (
                <DayWithAvailability
                  {...(dayProps as BaseDayProps)}
                  availableDates={availableDates}
                />
              ),
            }}
            sx={{
              "& .MuiPickersCalendarHeader-root": {
                px: 1,
                minHeight: 40,
              },
              "& .MuiPickersCalendarHeader-label": { fontWeight: 700 },
              "& .MuiPickersArrowSwitcher-root": {
                gap: 0.5,
              },
              "& .MuiDayCalendar-weekDayLabel": {
                fontSize: 12,
                color: TEXT_MUTED,
              },
              "& .MuiDayCalendar-monthContainer": {
                px: 0.5,
              },
            }}
          />
        </Paper>

        {/* Time slots panel - ADDED DEBUGGING INFO */}
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
          <Typography sx={{ fontWeight: 700, px: 1, py: 1 }}>
            {titleRight}
          </Typography>

          <Stack
            key={`${dateKey}-${slots.length}`} // Force re-render
            spacing={1}
            sx={{ maxHeight: 360, overflowY: "auto", pr: 0.5 }}
          >
            {isLoading ? (
              <Box sx={{ px: 1, py: 2, color: TEXT_MUTED }}>
                Loading available times...
              </Box>
            ) : slots.length === 0 ? (
              <Box sx={{ px: 1, py: 2, color: TEXT_MUTED }}>
                No times available
              </Box>
            ) : (
              slots.map((s, index) => {
                const selected = selectedSlotId?.id === s.id;
                const disabled = !!s.disabled;
                const label = `${s.start} – ${s.end}`;

                return (
                  <ButtonBase
                    key={`${s.id}-${index}`} // Ensure unique keys
                    disabled={disabled}
                    onClick={() => {
                      console.log("🎯 Slot selected:", s);
                      setSelectedSlotId(s);
                    }}
                    sx={{
                      width: "100%",
                      border: `1px solid ${BORDER}`,
                      borderRadius: 1,
                      p: 1.25,
                      justifyContent: "flex-start",
                      bgcolor: selected ? BROWN : "#fff",
                      color: selected ? "#fff" : "#111",
                      "&:hover": {
                        bgcolor: selected ? BROWN_DARK : "rgba(0,0,0,0.02)",
                      },
                      opacity: disabled ? 0.45 : 1,
                      cursor: disabled ? "not-allowed" : "pointer",
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
