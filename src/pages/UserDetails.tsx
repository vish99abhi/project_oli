import { Box, Button, Stack, Typography } from '@mui/material';
import BookingDetailsForm from '../components/BookingDetailsForm';
import { useUserDetails } from '../store/UserContext';
import { useNavigate } from 'react-router-dom';
import { useStepper } from '../store/StepperContext';
import { useState } from 'react';
import { guestUserCreation, updateGuestDetails } from '../api/zenoti-api/services/zenotiService';

const UserDetails = () => {
  const navigate = useNavigate();
  const { goNext, goBack } = useStepper();
  const { setUserDetails, setGuestDetails, guestDetails, userDetails } = useUserDetails();

  console.log('Guest Details from context:', guestDetails);
  console.log('User Details from context:', userDetails);
  const { center_id, personal_info } = guestDetails;
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    save: false,
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
  });

  const handleChange = (field: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = field === 'save' ? e.target.checked : e.target.value;
    setValues((s: any) => ({ ...s, [field]: v }));
  };

  const handleBlur = (field: keyof typeof values) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  console.log('Values:', values);

  const createGuestUser = async () => {
    let payload = {
      id: guestDetails.user_id,
      code: '',
      center_id: center_id,
      preferred_service_id: '',
      center_name: '',
      personal_info: {
        user_name: '',
        first_name: values.name,
        last_name: 'last name',
        middle_name: '',
        preferred_name: '',
        email: values.email,
        mobile_phone: {
          country_code: 95,
          phone_code: 0,
          number: values.phone,
        },
      },
    };
    console.log('Creating guest user with payload:', payload);
    try {
      const response = await updateGuestDetails(guestDetails.user_id, payload);
      console.log('Guest user created:', response);
      setGuestDetails(response);
    } catch (error) {
      console.log('Error creating guest user:', error);
    }
  };

  const handleNextStep = () => {
    console.log(values);
    setUserDetails((prevUserDetails) => ({
      ...prevUserDetails,
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      saveInfo: values.save,
    }));
    goNext();
    createGuestUser();
    navigate('/booking');
  };

  const handleBackStep = () => {
    goBack();
    navigate('/date');
  };

  // Basic validation
  const validateName = (name: string) => name.trim().length > 0;
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\d{10,}$/.test(phone.replace(/\D/g, ''));

  const nameError = touched.name && !validateName(values.name);
  const emailError = touched.email && !validateEmail(values.email);
  const phoneError = touched.phone && !validatePhone(values.phone);

  return (
    <>
      <Box pt={6} pl={{ xs: 0, md: 4 }}>
        <Box display={'flex'} alignItems={{ xs: 'center', md: 'start' }} flexDirection={'column'}>
          <Typography
            variant='body1'
            sx={{
              fontFamily: 'sans-serif',
              fontWeight: 700,
              color: '#B89072',
              textDecoration: 'none',
            }}
          >
            STEP 4 OF 4
          </Typography>
          <Typography
            sx={{
              typography: { xs: 'h5', md: 'h3' },
              mr: 2,
              fontFamily: 'serif !important',
              fontWeight: 'bold !important',
              color: 'black',
              textDecoration: 'none',
            }}
          >
            Enter your details
          </Typography>
        </Box>
        <Box>
          <BookingDetailsForm
            values={values}
            setValues={setValues}
            touched={touched}
            setTouched={setTouched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            nameError={nameError}
            emailError={emailError}
            phoneError={phoneError}
          />
        </Box>
        <Box px={1.6} display='flex' justifyContent='space-between' mt={2}>
          <Stack direction='row' spacing={1}>
            <Button
              onClick={handleBackStep}
              sx={{
                textTransform: 'none',
                color: 'black',
                display: { xs: 'none', md: 'block' },
              }}
            >
              Back
            </Button>
            <Button
              variant='contained'
              disableElevation
              disabled={
                !validateName(values.name) ||
                !validateEmail(values.email) ||
                !validatePhone(values.phone)
              }
              onClick={handleNextStep}
              size='large'
              sx={{
                textTransform: 'none',
                backgroundColor: 'Black',
                width: { xs: '100%', md: 'auto' },
              }}
            >
              Next
            </Button>
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default UserDetails;
