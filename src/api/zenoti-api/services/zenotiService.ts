import zenoti from "../zenotiConfig";

export const getCenetres = async () => {
  try {
    const response = await zenoti.get("/centers?expand=working_hours");
    return response.data;
  } catch (error) {
    console.error("Error fetching centers:", error);
    throw error;
  }
}

export const getCenterById = async (centerId: string) => {
  try { 
    const response = await zenoti.get(`/Centers/${centerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching center by ID:", error);   
    throw error;
  }
}

export const getSerivcesByCenterId = async (centerId: string) => {
  try {
    const response = await zenoti.get(`/Centers/${centerId}/services`);
    return response.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
}