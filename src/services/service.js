import { formatSheetData } from '~/functions';
import * as request from '~/utils/httpRequest';

export const getServerData = async (id ,range = 'Sheet1') => {
    try {
        // console.log(process.env.REACT_APP_SHEET_IMAGE_ID)
        const response = await request.get(`${id}/values/${range}`, {
            params: {
                key: process.env.REACT_APP_API_KEY,
            }
        })
        // console.log(response)
        return formatSheetData(response.values) || []
    } catch (error) {
        console.log(error)
    }
}

export const getImageData = async (url, options = {}) => {
    try {
        const response = await request.freeGet(url, options)
        return response
    } catch (error) {
        console.log(error)
    }
}