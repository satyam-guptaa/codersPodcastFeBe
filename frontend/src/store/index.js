import { configureStore } from '@reduxjs/toolkit'
import auth from './authSlice';
import activation from './activationSlice'

export const store = configureStore({
    reducer: {
        auth,
        activation
    },
})
