import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: '',
    avatar: '/images/monkey-avatar.png'
}

export const activationSlice = createSlice({
    name: 'activation',
    initialState,
    reducers: {
        setNameAction: (state, action) => {
            state.name = action.payload;
        },
        setAvatarAction: (state, action) => {
            state.avatar = action.payload;
        },
    },
})

// Action creators are generated for each case reducer function
export const { setNameAction, setAvatarAction } = activationSlice.actions;

export default activationSlice.reducer;