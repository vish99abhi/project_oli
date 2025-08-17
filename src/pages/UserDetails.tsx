import { Box } from "@mui/material";
import { StepperControls } from "../common/StepperControls";

const UserDetails = () => {

    return (
        <>
            <h1>UserDetails</h1>
             <Box>
                <StepperControls previousURL="/date"  nextURL="/" />
            </Box>
        </>
    )
}

export default UserDetails;