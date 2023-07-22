import config from '~/config';

import { DefaultLayout, LessSearch } from '~/Layouts';
import { Home, Contact, Video, Gallery } from '~/pages';

const publicRoutes = [
    { path: config.routes.home, component: Home, layout: LessSearch },
    { path: config.routes.gallery, component: Gallery, layout: DefaultLayout },
    { path: config.routes.galleryItem, component: Gallery, layout: DefaultLayout },
    { path: config.routes.video, component: Video, layout: DefaultLayout },
    { path: config.routes.videoItem, component: Video, layout: DefaultLayout },
    { path: config.routes.contact, component: Contact, layout: LessSearch },
];

export { publicRoutes };
