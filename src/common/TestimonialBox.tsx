import {
  Box,
  Typography,
  Avatar,
  AvatarGroup,
  Rating,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const BORDER = "#8B4513";

const TestimonialOne = () => {
  const customerImages = [
    "/path/to/customer1.jpg",
    "/path/to/customer2.jpg",
    "/path/to/customer3.jpg",
    "/path/to/customer4.jpg",
  ];
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        p: 2,
        marginBottom: 2,
        backgroundColor: "#faf7f4",
        borderTopLeftRadius: 40,
        borderBottomRightRadius: 40,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        border: "2px solid #e8e0d6",
        maxWidth: 500,
        textAlign: "center",
        marginLeft: 4,
        marginTop: 4,
        height: 130,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Avatar Group */}
      <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
        <AvatarGroup
          max={4}
          sx={{
            "& .MuiAvatar-root": {
              width: 48,
              height: 48,
              border: "2px solid white",
              fontSize: "1rem",
            },
          }}
        >
          {customerImages.map((image, index) => (
            <Avatar key={index} src={image} alt={`Customer ${index + 1}`} />
          ))}
        </AvatarGroup>
      </Box>

      {/* Testimonial Text */}
      <Typography
        variant="body1"
        sx={{
          color: "#6b5b47", // Brown text color
          fontSize: "0.95rem",
          lineHeight: 1.5,
          fontWeight: 500,
        }}
      >
        <strong>50,000+</strong> customers transformed their skin, <br />
        right from the privacy of their home
      </Typography>
    </Box>
  );
};

const TestimonialTwo = () => {
  return (
    <Box
      sx={{
        // position: "fixed",
        // bottom: 0,
        // left: 0,
        // right: 0,
        // p: 2,
        // marginBottom: 2,
        backgroundColor: "#faf7f4",
        borderTopLeftRadius: 40,
        borderBottomRightRadius: 40,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        border: "2px solid #e8e0d6",
        maxWidth: 500,
        textAlign: "center",
        marginLeft: 4,
        marginTop: 4,
        height: 130,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1,
            gap: 1,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: BORDER,
              fontSize: "1.5rem",
              fontWeight: 700,
            }}
          >
            4.8
          </Typography>
          <Rating
            value={4.8}
            readOnly
            precision={0.1}
            size="medium"
            sx={{
              "& .MuiRating-iconFilled": {
                color: BORDER, // Brown color for stars
              },
              "& .MuiRating-iconEmpty": {
                color: "#e8e0d6",
              },
            }}
          />
        </Box>
        <Typography
          variant="body1"
          sx={{
            color: "#6b5b47",
            fontSize: "0.95rem",
            lineHeight: 1.5,
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          Rated by <strong>1,200+</strong> users across the country
        </Typography>
      </Box>
    </Box>
  );
};

function TestimonialBox({ currentStep = 2 }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!isMobile) return null;

  if (currentStep === 1) {
    return <TestimonialOne />;
  }

  if (currentStep === 2) {
    return <TestimonialTwo />;
  }

  // return (
  //   <Box
  //     sx={{
  //       position: "fixed",
  //       bottom: 0,
  //       left: 0,
  //       right: 0,
  //       p: 2,
  //       marginBottom: 2,
  //       backgroundColor: "#faf7f4",
  //       borderTopLeftRadius: 40,
  //       borderBottomRightRadius: 40,
  //       borderTopRightRadius: 0,
  //       borderBottomLeftRadius: 0,
  //       border: "2px solid #e8e0d6",
  //       maxWidth: 500,
  //       textAlign: "center",
  //       marginLeft: 4,
  //       marginTop: 4,
  //       height: 130,
  //       display: "flex",
  //       flexDirection: "column",
  //       justifyContent: "center",
  //       alignItems: "center",
  //     }}
  //   >
  //     {currentStep === 2 ? (
  //       // Step 2 Content - Rating
  //       <Box
  //         sx={{
  //           display: "flex",
  //           flexDirection: "column",
  //           alignItems: "center",
  //         }}
  //       >
  //         <Box
  //           sx={{
  //             display: "flex",
  //             alignItems: "center",
  //             justifyContent: "center",
  //             mb: 1,
  //             gap: 1,
  //           }}
  //         >
  //           <Typography
  //             variant="h5"
  //             sx={{
  //               color: BORDER,
  //               fontSize: "1.5rem",
  //               fontWeight: 700,
  //             }}
  //           >
  //             4.8
  //           </Typography>
  //           <Rating
  //             value={4.8}
  //             readOnly
  //             precision={0.1}
  //             size="medium"
  //             sx={{
  //               "& .MuiRating-iconFilled": {
  //                 color: BORDER, // Brown color for stars
  //               },
  //               "& .MuiRating-iconEmpty": {
  //                 color: "#e8e0d6",
  //               },
  //             }}
  //           />
  //         </Box>
  //         <Typography
  //           variant="body1"
  //           sx={{
  //             color: "#6b5b47",
  //             fontSize: "0.95rem",
  //             lineHeight: 1.5,
  //             fontWeight: 500,
  //             textAlign: "center",
  //           }}
  //         >
  //           Rated by <strong>1,200+</strong> users across the country
  //         </Typography>
  //       </Box>
  //     ) : (
  //       // Default Content - Customer testimonial
  //       <>
  //         {/* Avatar Group */}
  //         <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
  //           <AvatarGroup
  //             max={4}
  //             sx={{
  //               "& .MuiAvatar-root": {
  //                 width: 48,
  //                 height: 48,
  //                 border: "2px solid white",
  //                 fontSize: "1rem",
  //               },
  //             }}
  //           >
  //             {customerImages.map((image, index) => (
  //               <Avatar key={index} src={image} alt={`Customer ${index + 1}`} />
  //             ))}
  //           </AvatarGroup>
  //         </Box>

  //         {/* Testimonial Text */}
  //         <Typography
  //           variant="body1"
  //           sx={{
  //             color: "#6b5b47", // Brown text color
  //             fontSize: "0.95rem",
  //             lineHeight: 1.5,
  //             fontWeight: 500,
  //           }}
  //         >
  //           <strong>50,000+</strong> customers transformed their skin, <br />
  //           right from the privacy of their home
  //         </Typography>
  //       </>
  //     )}
  //   </Box>
  // );
}

export default TestimonialBox;
