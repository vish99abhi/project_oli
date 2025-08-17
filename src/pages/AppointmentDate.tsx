import { Box } from "@mui/material";
import { StepperControls } from "../common/StepperControls";


const AppointmentDate = () => {
    return (
        <>
            <h1>AppointmentDate</h1>
            <Box>
                <StepperControls previousURL="/service"  nextURL="/details" />
            </Box>
        </>
    )
}

export default AppointmentDate;