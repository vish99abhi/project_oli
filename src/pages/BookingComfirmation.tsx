import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Button from "@mui/material/Button";

const BookingComfirmation = () => {
  return (
    <>
    <Box
      display="flex"
      mt={12}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="30vh"
      gap={3}
      sx={{ bgcolor: "background.paper", borderRadius: 3, p: 4, boxShadow: 2 }}
    >
      <CheckCircleOutlineIcon sx={{ fontSize: 64 }} />
      <Typography variant="h4" fontWeight={700} color="Black">
        Apponintment Confirmed!!
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center">
        Your booking your appoinntment with Loreal US is confirmed
      </Typography>
      <Typography variant="body2" sx={{}} component={'a'} href="#" color="text.secondary" align="center" maxWidth={400}>
        Appointment Details | Cancellaion Policy
      </Typography>
      <Button
        variant="contained"
        size="large"
        sx={{ mt: 2, borderRadius: 2, textTransform: "none", backgroundColor: "#000000" }}
        href="/"
      >
        Save to Calendar
      </Button>
    </Box>

    <Box  display="flex"
      mt={1}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={1}
      sx={{ bgcolor: "background.paper", borderRadius: 3, p: 4, boxShadow: 2 }}>
      <Typography variant="h6" fontWeight={200} color="Black">
         Create an account to manage or reshedule easily.
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center">
      </Typography>
    </Box>
    </>
  );
}

export default BookingComfirmation;