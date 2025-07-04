import apiEndpoints from "./apiEndpoints";
import apiService from "./apiService";

//profile
export const GetProfile = async (): Promise<any> => {
  try {
    const response = await apiService.get(apiEndpoints.USER.PROFILE);
    return response || {};
  } catch (err) {
    throw err;
  }
};

export const UpdateProfile = async (data: any) => {
  try {
    const response = await apiService.put(apiEndpoints.USER.PROFILE, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (err) {
    throw err;
  }
};

// sport
export const UpdateSkill = async (data: any) => {
  try {
    const response = await apiService.post(
      apiEndpoints.SKILLS.USER_SKILL,
      data
    );
    return response;
  } catch (err) {
    throw err;
  }
};
export const GetUserSkill = async (data: any) => {
  try {
    const response = await apiService.get(apiEndpoints.SKILLS.USER_SKILL, data);
    return response || {};
  } catch (err) {
    throw err;
  }
};

// get skills
export const GetSkills = async () => {
  try {
    const response = await apiService.get(apiEndpoints.SKILLS.GET_SKILLS);
    // console.log(response, "response getSkills")
    return response || {};
  } catch (err) {
    throw err;
  }
};

// activity
export const CreateActivity = async (data: any) => {
  try {
    const response = await apiService.post(
      apiEndpoints.ACTIVITY.CREATE_ACTIVITY,
      data
    );
    return response;
  } catch (err) {
    throw err;
  }
};

export const GetActivity = async () => {
  try {
    const response = await apiService.get(apiEndpoints.ACTIVITY.GET_ACTIVITIES);
    //console.log(response, "response GetActivity");
    return response;
  } catch (err) {
    throw err;
  }
};

export const SaveActivity = async (data: { activityId: string }) => {
  try {
    const response = await apiService.post(
      apiEndpoints.ACTIVITY.SAVE_ACTIVITY,
      data
    );
    return response;
  } catch (err) {
    throw err;
  }
};

export const RemoveSavedActivity = async (data: { activityId: string }) => {
  try {
    const response = await apiService.post(
      apiEndpoints.ACTIVITY.REMOVE_SAVE_ACTIVITY,
      data
    );
    return response;
  } catch (err) {
    throw err;
  }
};

export const GetPlayers = async (query: string, tab: string) => {
  try {
    const response = await apiService.get(apiEndpoints.PLAYERS.GET_PLAYERS, {
      name: query,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
