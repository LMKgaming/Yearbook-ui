import classNames from 'classnames/bind';
import styles from './Navbar.module.scss';
import Button from '~/components/Button';
import config from '~/config';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { convertToSentenceCase } from '~/functions';

const cx = classNames.bind(styles);

const navData = (() => {
    let arr = [];
    for (const key in config.routes) {
        if (Object.hasOwnProperty.call(config.routes, key)) {
            let name = convertToSentenceCase(key);
            arr.push({
                name,
                to: config.routes[key],
            });
        }
    }
    return arr;
})();

const returnCurrentNav = (nav, to) => {
    let foundNav = nav.findIndex((data) => data.to === to);
    foundNav = foundNav === -1 ? 0 : foundNav
    let prevNav = foundNav - 1 >= 0 ? foundNav - 1 : 0;
    let nextNav = foundNav + 1 <= nav.length - 1 ? foundNav + 1 : nav.length - 1;
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
            }}
        >
            {to !== config.routes.home && (
                <Button
                    className={cx('nav-arrow', 'left')}
                    name={<FontAwesomeIcon icon={faAngleLeft} />}
                    to={foundNav !== 0 ? nav[prevNav].to : to}
                />
            )}
            <Button
                name={nav[foundNav].name}
                to={nav[foundNav].to}
                className={cx('nav-btn')}
                contentCss={cx('nav-content')}
            />
            {to !== config.routes.contact && (
                <Button
                    className={cx('nav-arrow', 'right')}
                    name={<FontAwesomeIcon icon={faAngleRight} />}
                    to={foundNav !== nav.length - 1 ? nav[nextNav].to : to}
                />
            )}
        </div>
    );
};

const Navbar = ({ model }) => {
    const location = useLocation();
    return (
        <div className={cx('middle-nav-group')}>
            {model === 'mobile' || model === 'mini-tablet'
                ? returnCurrentNav(navData, location.pathname)
                : navData.map((nav, index) => (
                      <Button
                          key={index}
                          name={nav.name}
                          to={nav.to}
                          className={cx('nav-btn', {
                              active: nav.to === location.pathname,
                          })}
                          contentCss={cx('nav-content')}
                      />
                  ))}
        </div>
    );
};

export default Navbar;
