import * as request from '~/utils/httpRequest';

export const getServerData = async () => {
    try {
        console.log(process.env.REACT_APP_SHEET_ID_SHEET_BEST)
        const response = await request.get(`/${process.env.REACT_APP_SHEET_ID_SHEET_BEST}`)
        console.log(response)
        return response || []
    } catch (error) {
        console.log(error)
    }
}
