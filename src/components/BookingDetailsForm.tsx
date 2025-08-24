
import {
  Box,
  Stack,
  TextField,
  Checkbox,
  FormControlLabel,
  InputAdornment,
} from "@mui/material";

const BROWN = "#C9B3A1"; // outline color (tweak to match)
const BROWN_HOVER = "#BDA591";
const BROWN_FOCUS = "#B89072";
const TEXT = "#111";
const PLACEHOLDER = "#666";

export default function BookingDetailsForm({
  values,
  handleChange,
  handleBlur,
  nameError,
  emailError,
  phoneError,
}: any) {
  const commonSx = {
    // Input text
    "& .MuiInputBase-input": {
      fontWeight: 700,
      color: TEXT,
      "::placeholder": {
        color: PLACEHOLDER,
        fontWeight: 500,
        opacity: 1,
      },
      // Larger padding to match screenshot
      py: 1.5,
    },
    // Outlined border colors
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#fff",
      borderRadius: "8px",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: BROWN,
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: BROWN_HOVER,
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: BROWN_FOCUS,
        borderWidth: 2,
      },
    },
  } as const;

  return (
    <Box sx={{ p: 2, bgcolor: "#faf7f3" }}>
      <Stack spacing={2}>
        <TextField
          value={values.name}
          onChange={handleChange("name")}
          onBlur={handleBlur("name")}
          error={!!nameError}
          helperText={nameError ? "Name is required" : ""}
          variant="outlined"
          fullWidth
          placeholder="Full name"
          InputProps={{
            inputProps: { "aria-label": "Full name" },
          }}
          sx={commonSx}
        />

        <TextField
          value={values.email}
          onChange={handleChange("email")}
          onBlur={handleBlur("email")}
          error={!!emailError}
          helperText={emailError ? "Enter a valid email" : ""}
          type="email"
          variant="outlined"
          fullWidth
          placeholder="Email"
          InputProps={{
            inputProps: { "aria-label": "Email" },
          }}
          sx={commonSx}
        />

        <TextField
          value={values.phone}
          onChange={handleChange("phone")}
          onBlur={handleBlur("phone")}
          error={!!phoneError}
          helperText={phoneError ? "Enter a valid phone number" : ""}
          variant="outlined"
          fullWidth
          placeholder="Phone number"
          InputProps={{
            inputProps: { "aria-label": "Phone number" },
            startAdornment: (
              <InputAdornment position="start">
              </InputAdornment>
            ),
          }}
          sx={commonSx}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={values.save}
              onChange={handleChange("save")}
              sx={{
                color: BROWN_FOCUS,
                "&.Mui-checked": { color: BROWN_FOCUS },
              }}
            />
          }
          label="Save my details for further bookings."
          sx={{
            color: "#333",
            "& .MuiFormControlLabel-label": { fontSize: 14 },
          }}
        />
      </Stack>
    </Box>
  );
}
