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

export const getSerivcesByCenterId = async (centerId: string, params: { only_add_ons?: boolean;
    category_id?: string;}) => {
  try {
    const response = await zenoti.get(`/Centers/${centerId}/services`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
}

export const getCategoriesByCenterId = async (centerId: string) => {
  try {
    const response = await zenoti.get(`/centers/${centerId}/categories?page=1&s`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}


export const guestUserCreation = async (payload: any) => {
  try {
    const response = await zenoti.post(`/guests`, payload);
    return response.data;
  } catch (error) {
    console.error("Error creating guest user:", error);
    throw error;
  } 
}