import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    shortBio: string;
    country: string;
    rating: number;
    activities: number;
    avatar: string;
    profileImage: string;
    location: {
        address: string,
    }
}

interface PlayersState {
    selectedPlayers: User[];
}

const initialState: PlayersState = {
    selectedPlayers: [],
};

export const playersSlice = createSlice({
    name: 'players',
    initialState,
    reducers: {
        addSelectedPlayer: (state, action: PayloadAction<User>) => {
            if (!state.selectedPlayers.some(player => player._id === action.payload._id)) {
                state.selectedPlayers.push(action.payload);
            }
        },
        removeSelectedPlayer: (state, action: PayloadAction<string>) => {
            state.selectedPlayers = state.selectedPlayers.filter(
                player => player._id !== action.payload
            );
        },
        clearSelectedPlayers: (state) => {
            state.selectedPlayers = [];
        },
    },
});

export const { addSelectedPlayer, removeSelectedPlayer, clearSelectedPlayers } = playersSlice.actions;

export default playersSlice.reducer;