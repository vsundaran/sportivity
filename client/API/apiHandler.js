import apiService from "./apiService";
import apiEndpoints from "./apiEndpoints";

//profile
export const GetProfile = async () => {
  try {
    const response = await apiService.get(apiEndpoints.USER.PROFILE);
    return response;
  } catch (err) {
    throw err
  }
};

export const UpdateProfile = async (data) => {
  try {
    const response = await apiService.put(apiEndpoints.USER.PROFILE, data);
    return response;
  } catch (err) {
    throw err
  }
};
