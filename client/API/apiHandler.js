import apiEndpoints from "./apiEndpoints";
import apiService from "./apiService";

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
    const response = await apiService.put(apiEndpoints.USER.PROFILE, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response;
  } catch (err) {
    throw err
  }
};


// sport
export const UpdateSkill = async (data) => {
  try {
    const response = await apiService.post(apiEndpoints.SKILLS.USER_SKILL, data);
    return response;
  } catch (err) {
    throw err
  }
};

// get skills
export const GetSkills = async () => {
  try {
    const response = await apiService.get(apiEndpoints.SKILLS.GET_SKILLS);
    return response;
  } catch (err) {
    throw err
  }
};
