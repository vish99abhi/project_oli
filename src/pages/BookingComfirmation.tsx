import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import DoneIcon from "@mui/icons-material/Done";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

const BORDER = "#E6DFD8";
const BROWN = "#B89072";
const BROWN_SOFT = "#E9DACE";

type BookingConfirmationProps = {
  providerName?: string;
  onSaveToCalendar?: () => void;
  onAccountClick?: () => void;
};

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  providerName = "Loreal US",
  onSaveToCalendar,
  onAccountClick,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box pt={4} px={{ xs: 4, md: 4 }}>
      <Box
        display="flex"
        mt={12}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="30vh"
        gap={3}
        sx={{
          border: `1px solid ${BORDER}`,
          background:
            "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(250,247,243,0.65) 100%)",
          borderRadius: 2,
          p: 4,
        }}
      >
        <Box
          sx={{
            background: BROWN,
            borderRadius: "50%",
            width: 65,
            height: 65,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1,
          }}
        >
          <DoneIcon sx={{ fontSize: 46, color: "#fff" }} />
        </Box>
        <Typography
          variant={isMobile ? "h4" : "h3"}
          fontWeight={700}
          color="text.primary"
          sx={{ fontFamily: "serif" }}
        >
          Appointment Confirmed!!
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          fontWeight={550}
          sx={{ fontFamily: "sans-serif", mb: -2 }}
        >
          Your appointment with {providerName} is confirmed.
        </Typography>
        <Typography
          variant="body2"
          sx={{ textDecoration: "underline", mb: 4 }}
          component="div"
          color="text.secondary"
          align="center"
          maxWidth={400}
        >
          <Link href="#" underline="hover" color="inherit">
            Appointment Details
          </Link>{" "}
          |{" "}
          <Link href="#" underline="hover" color="inherit">
            Cancellation Policy
          </Link>
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            mt: 1,
            borderRadius: 2,
            textTransform: "none",
            backgroundColor: "#000",
            fontWeight: 600,
            fontFamily: "inherit",
            "&:hover": { backgroundColor: "#222" },
          }}
          onClick={onSaveToCalendar}
        >
          Save to Calendar
        </Button>
      </Box>

      <Box
        display="flex"
        mt={4}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={1}
        sx={{
          bgcolor: BROWN_SOFT,
          borderRadius: 1.5,
          p: 2,
          boxShadow: 0,
        }}
      >
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ fontFamily: "inherit" }}
        >
          <Link
            href="#"
            underline="hover"
            color="inherit"
            fontWeight={600}
            onClick={onAccountClick}
          >
            Create an account
          </Link>{" "}
          to manage or reschedule easily
        </Typography>
      </Box>
    </Box>
  );
};

export default BookingConfirmation;
