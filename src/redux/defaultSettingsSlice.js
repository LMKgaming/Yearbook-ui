import { createSlice } from '@reduxjs/toolkit';

const defaultSettingsSlice = createSlice({
    name: 'defaultSettings',
    initialState: {
        snow: false,
        countSnow: 200,
        gallery: {
            dataServer: [],
            list: true,
        },
        video: {
            list: true,
        },
    },
    reducers: {
        snowUpdate: (state, action) => {
            state.snow = !!action.payload;
        },
        snowCountUpdate: (state, action) => {
            state.countSnow = +action.payload;
        },
        changeTypeGallery: (state, action) => {
            state.gallery.list = !!action.payload;
        },
        changeTypeVideo: (state, action) => {
            state.video.list = !!action.payload;
        },
        updateDataGallery: (state, action) => {
            state.gallery.dataServer = action.payload;
        },
    },
});

export const { snowUpdate, snowCountUpdate, changeTypeGallery, changeTypeVideo, updateDataGallery } =
    defaultSettingsSlice.actions;
export default defaultSettingsSlice;
