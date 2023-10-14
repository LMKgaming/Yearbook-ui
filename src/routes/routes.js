import config from '~/config';

import { DefaultLayout } from '~/Layouts';
import { Home, Contact, Video, Gallery, HiddenData } from '~/pages';

const publicRoutes = [
    { path: config.routes.home, component: Home, layout: DefaultLayout },
    { path: config.routes.gallery, component: Gallery, layout: DefaultLayout, includeSearch: true },
    { path: config.routes.video, component: Video, layout: DefaultLayout, includeSearch: true },
    { path: config.routes.contact, component: Contact, layout: DefaultLayout },
    { path: '*', component: Home, layout: DefaultLayout },
];

const privateRoutes = [
    { path: config.hiddenRoutes.hiddenData, component: HiddenData, layout: DefaultLayout, includeSearch: true },
]

export { publicRoutes, privateRoutes };
