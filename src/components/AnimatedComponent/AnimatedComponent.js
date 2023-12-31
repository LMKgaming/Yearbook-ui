import { Route, Routes, useLocation } from 'react-router-dom';
import { privateRoutes, publicRoutes } from '~/routes';
import { Fragment } from 'react';
import { AnimatePresence } from 'framer-motion';

const AnimatedComponent = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes key={location.pathname} location={location}>
                {privateRoutes.map((route, index) => {
                    const includeSearch = route.includeSearch || false;
                    const Page = route.component;
                    let Layout = Fragment;
                    if (route.layout && route.layout !== null) {
                        Layout = route.layout;
                    }
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <Layout includeSearch={includeSearch}>
                                    <Page />
                                </Layout>
                            }
                        />
                    );
                })}
                {publicRoutes.map((route, index) => {
                    const includeSearch = route.includeSearch || false;
                    const Page = route.component;
                    let Layout = Fragment;
                    if (route.layout && route.layout !== null) {
                        Layout = route.layout;
                    }
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <Layout includeSearch={includeSearch}>
                                    <Page />
                                </Layout>
                            }
                        />
                    );
                })}
            </Routes>
        </AnimatePresence>
    );
};

export default AnimatedComponent;
