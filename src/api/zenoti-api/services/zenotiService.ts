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

export const updateGuestDetails = async (guestId: string, payload: any) => {
  try {
    const response = await zenoti.put(`/guests/${guestId}`, payload); 
    return response.data;
  } catch (error) {
    console.error("Error updating guest user:", error);
    throw error;
  } 
}


export const createBooking = async (payload: any) => {
  try {
    const response = await zenoti.post(`/bookings?is_double_booking_enabled=true`, payload); 
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
}

export const getAvailableSlots = async (bookingId: string) => {
  try {
    const response = await zenoti.get(`/bookings/${bookingId}/slots`);
    return response.data;
  } catch (error) {
    console.error("Error fetching available slots:", error);
    throw error;
  }
}

export const reservedSoltsBooking = async (bookingId: string, payload: any) => {
   try {
    const response = await zenoti.post(`/bookings/${bookingId}/slots/reserve`, payload);
    return response.data;
  } catch (error) {
    console.error("Error fetching available slots:", error);
    throw error;
  }
}

export const confirmBooking = async (bookingId: string) => {
  try {
    const response = await zenoti.post(`/bookings/${bookingId}/slots/confirm`)
    return response.data
  } catch (error) {
    throw error;
  }
}