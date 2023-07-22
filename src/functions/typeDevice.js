import unitViewport from '~/config/unitViewport';

const typeDevice = (width) => {
    if (width < unitViewport.mobile) return 'mobile'
    else if (width < unitViewport.tablet) return 'mini-tablet'
    else if (width < unitViewport.pc) return 'tablet'
    return 'pc'
}

export default typeDevice
