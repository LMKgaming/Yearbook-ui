import classNames from 'classnames/bind';
import styles from './DefaultLayout.module.scss';
import Image from '~/components/Image';
import images from '~/assets/images';
import Button from '~/components/Button';
import config from '~/config';
import Text from '~/components/Text';
import { useSelector } from 'react-redux';
import { snowCountSelector, snowSelector } from '~/redux/selector';
import SnowFalling from '~/components/SnowFalling';
import { Navbar, Search } from '../components';
import { useViewport } from '~/hooks';
import { typeDevice } from '~/functions';
import SnowButton from '~/components/SnowButton/SnowButton';

const cx = classNames.bind(styles);

const DefaultLayout = ({ includeSearch = false, children }) => {
    const viewport = useViewport();
    const snowActive = useSelector(snowSelector);
    const countSnow = useSelector(snowCountSelector);

    return (
        <div
            className={cx('default-layout')}
            style={{
                height: `${viewport.height}em`,
            }}
        >
            <div className={cx('header')}>
                <Button
                    name={<Image src={images.logo} className={cx('logo')} />}
                    to={config.routes.home}
                    className={cx('logo-btn')}
                    contentCss={cx('logo-content')}
                />
                <div className={cx('header-middle-group')}>
                    {includeSearch && <Search model={typeDevice(viewport.width)} />}
                    <Navbar model={typeDevice(viewport.width)} />
                </div>
                <Text
                    content={
                        typeDevice(viewport.width) === 'mobile'
                            ? '12A7'
                            : typeDevice(viewport.width) !== 'pc'
                            ? '❤️ 12A7'
                            : '12A7 ❤️ 2022-2023'
                    }
                    className={cx('header-right-info')}
                />
                <SnowButton />
            </div>
            {snowActive && <SnowFalling count={countSnow} />}
            <div className={cx('main')}>{children}</div>
        </div>
    );
};

export default DefaultLayout;
