import { Box } from "@mui/material"
import { StepperControls } from "../common/StepperControls"


const TreatmentServices = () => {

    return(
        <>
            <h1>Treatment page</h1>
             <Box>
                <StepperControls previousURL="/"  nextURL="/date" />
            </Box>
        </>
    )

}

export default TreatmentServices