import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
    info: {},
    isUnderMaintance: false
};

export const utilSlice = createSlice({
    name: 'utils',
    initialState,
    reducers: {
        setInfo(state, action) {
            state.info = action.payload;
        },
        extraReducers: {
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.auth,
                };
            },
        },
    },
});

export const { setInfo } = utilSlice.actions;
export const getInfo = (state) => state.utils.info;
export default utilSlice.reducer;