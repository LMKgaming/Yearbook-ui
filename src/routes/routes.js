import config from '~/config';

import { DefaultLayout } from '~/Layouts';
import { Home, Contact, Video, Gallery } from '~/pages';

const publicRoutes = [
    { path: config.routes.home, component: Home, layout: DefaultLayout },
    { path: config.routes.gallery, component: Gallery, layout: DefaultLayout, includeSearch: true },
    { path: config.routes.galleryItem, component: Gallery, layout: DefaultLayout, includeSearch: true },
    { path: config.routes.video, component: Video, layout: DefaultLayout, includeSearch: true },
    { path: config.routes.videoItem, component: Video, layout: DefaultLayout, includeSearch: true },
    { path: config.routes.contact, component: Contact, layout: DefaultLayout },
];

export { publicRoutes };
