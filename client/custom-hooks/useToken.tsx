// import * as Keychain from 'react-native-keychain';
// import { useCallback } from 'react';

// const TOKEN_KEY = 'authToken';

// export function useToken() {
//     // Save token
//     const saveToken = useCallback(async (token: string) => {
//         await Keychain.setGenericPassword(TOKEN_KEY, token, {
//             service: TOKEN_KEY,
//         });
//     }, []);

//     // Retrieve token
//     const getToken = useCallback(async (): Promise<string | null> => {
//         const credentials = await Keychain.getGenericPassword({ service: TOKEN_KEY });
//         return credentials ? credentials.password : null;
//     }, []);

//     // Delete token
//     const deleteToken = useCallback(async () => {
//         await Keychain.resetGenericPassword({ service: TOKEN_KEY });
//     }, []);

//     return { saveToken, getToken, deleteToken };
// }