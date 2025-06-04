// utils/jwt.ts
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    exp: number; // expiry time in seconds
}

export const isTokenValid = (token: string): boolean => {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000; // in seconds
        return decoded.exp > currentTime;
    } catch (err) {
        return false;
    }
};
