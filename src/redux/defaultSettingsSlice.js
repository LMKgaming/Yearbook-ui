import { createSlice } from '@reduxjs/toolkit';
import config from '~/config';

const defaultSettingsSlice = createSlice({
    name: 'defaultSettings',
    initialState: {
        snow: false,
        countSnow: config.defaultSettings.defaultCountSnow,
        history: {
            searchValue: [],
            searchTag: []
        },
        searchOptions: {
            searchType: config.defaultSettings.searchType[0]
        },
        gallery: {
            dataServer: [],
            list: true,
            scrollListPos: 0,
            scrollGridPos: 0,
            searchValue: '',
            searchTag: [],
        },
        video: {
            dataServer: [],
            list: true,
        },
        tags: {
            dataServer: []
        }
    },
    reducers: {
        snowUpdate: (state, action) => {
            state.snow = !!action.payload;
        },
        snowCountUpdate: (state, action) => {
            state.countSnow = +action.payload;
        },
        changeSearchType: (state, action) => {
            if (!config.defaultSettings.searchType.includes(action.payload)) return
            state.searchOptions.searchType = action.payload
        },
        changeTypeGallery: (state, action) => {
            state.gallery.list = !!action.payload;
        },
        updateDataGallery: (state, action) => {
            state.gallery.dataServer = action.payload;
        },
        updateScrollListPosGallery: (state, action) => {
            state.gallery.scrollListPos = +action.payload;
        },
        updateScrollGridPosGallery: (state, action) => {
            state.gallery.scrollGridPos = +action.payload;
        },
        setSearchValueGallery: (state, action) => {
            state.gallery.searchValue = String(action.payload)
            if (action.payload.length === 0) return
            if (state.history.searchValue.length > config.defaultSettings.maxSearchHistorySaving - 1) state.history.searchValue.shift()
            let index = state.history.searchValue.indexOf(String(action.payload))
            if (index !== -1) state.history.searchValue.splice(index, 1)
            state.history.searchValue.push(String(action.payload))
        },
        setSearchTagGallery: (state, action) => {
            switch (action.payload.type) {
                case 'setTag': {
                    state.gallery.searchTag = action.payload.value
                    break;
                }
                case 'renewTag': {
                    state.gallery.searchTag = []
                    break
                }
                default:
                    break;
            }
        },
        updateHistory: (state, action) => {
            switch (action.payload.type) {
                case 'valClear':
                    state.history.searchValue = []
                    break;
                case 'valDel':
                    state.history.searchValue = state.history.searchValue.filter(p => p !== String(action.payload.value))
                    break;
                case 'tagSave':
                    let filterArr = action.payload.value.filter((tag) => !state.history.searchTag.includes(tag))
                    state.history.searchTag.push(...filterArr)
                    break
                case 'tagClear':
                    state.history.searchTag = []
                    break;
                case 'tagDel':
                    state.history.searchTag = state.history.searchTag.filter(p => p !== String(action.payload.value))
                    break
                default:
                    break;
            }
        },
        changeTypeVideo: (state, action) => {
            state.video.list = !!action.payload;
        },
        updateDataVideo: (state, action) => {
            state.video.dataServer = action.payload;
        },
        updateDataTag: (state, action) => {
            state.tags.dataServer = action.payload
        }
    },
});

export const {
    snowUpdate,
    snowCountUpdate,
    changeSearchType,
    changeTypeGallery,
    changeTypeVideo,
    updateDataGallery,
    updateScrollGridPosGallery,
    updateScrollListPosGallery,
    setSearchValueGallery,
    setSearchTagGallery,
    updateHistory,
    updateDataVideo,
    updateDataTag
} = defaultSettingsSlice.actions;
export default defaultSettingsSlice;
