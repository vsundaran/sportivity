import Toast from "react-native-toast-message";

export const useToast = () => {
  const showSuccess = (title = 'Success', message = '') => {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
    });
  };

  const showError = (title = 'Error', message = '') => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
    });
  };

  return { showSuccess, showError };
};
