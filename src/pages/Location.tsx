import {
  Box,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { StepperControls } from "../common/StepperControls";

const Location = () => {
  // const BORDER = "#8B4513";
  // const BORDER_HOVER = "#6E3610";
  const BORDER_FOCUS = "#B89072";

  return (
    <Box pt={6} pl={6}>
      <Typography
        variant="body1"
        sx={{
          mr: 2,
          display: { xs: "none", md: "flex" },
          fontFamily: "sans-serif",
          fontWeight: 700,
          color: "#B89072",
          textDecoration: "none",
        }}
      >
        STEP 1 OF 4
      </Typography>
      <Typography
        variant="h3"
        sx={{
          mr: 2,
          display: { xs: "none", md: "flex" },
          fontFamily: "serif",
          fontWeight: 700,
          color: "black",
          textDecoration: "none",
        }}
      >
        Enter your address
      </Typography>
      <Box width={650} py={4}>
        <TextField
          variant="outlined"
          fullWidth
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <LocationOnIcon sx={{ color: BORDER_FOCUS }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            // Input text style (typed content)
            "& .MuiInputBase-input": {
              fontWeight: 700,
              color: "#000",
            },
            // Outlined border colors in different states
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: BORDER_FOCUS,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: BORDER_FOCUS,
            },
            "& .Mui-focused .MuiOutlinedInput-notchedOutline, & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: BORDER_FOCUS,
                borderWidth: 2,
              },
            borderRadius: "4px",
            // Ensure the input root uses the same radius as the outline
            "& .MuiOutlinedInput-root": {
              borderRadius: "4px",
            },
          }}
        />
      </Box>
      <Box>
        <StepperControls  nextURL="/service" />
      </Box>
    </Box>
  );
};

export default Location;
