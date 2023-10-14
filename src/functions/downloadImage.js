import { toastConfig } from '~/components/Toast';
import { getImageData } from '~/services/service';

const downloadImage = async ({
    dataCurrent,
    title = 'Downloading...',
    msg = 'Waiting for export data from server...',
    usingSubtitle = false,
}) => {
    let toastId = toastConfig.percentToast(title, msg, 0, usingSubtitle);
    const getImage = await getImageData(dataCurrent.Id, {
        baseURL: process.env.REACT_APP_BASE_DOWNLOAD_URL,
        params: {
            key: process.env.REACT_APP_API_KEY,
            alt: 'media',
        },
        responseType: 'blob',
        onDownloadProgress: function (progressEvent) {
            toastConfig.setPercentToast(toastId, +((progressEvent.loaded / progressEvent.total) * 100).toFixed(2));
        },
    });

    let blob = new Blob([getImage.data], { type: getImage.data.type });
    const href = URL.createObjectURL(blob);
    const anchorElement = document.createElement('a');
    anchorElement.href = href;
    anchorElement.download = dataCurrent.Name;

    document.body.appendChild(anchorElement);
    anchorElement.click();

    document.body.removeChild(anchorElement);
    window.URL.revokeObjectURL(href);
};

export default downloadImage;
