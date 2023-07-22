import styles from './Menu.module.scss';
import classNames from 'classnames/bind';
import Image from '~/components/Image';
import { Link } from 'react-router-dom';
import config from '~/config';
const cx = classNames.bind(styles);

function UserHeader({ avt, name }) {
    return (
        <div className={cx('user-header-wrapper')}>
            <div className={cx('user-avt')}>
                <Image className={cx('img')} src={avt} alt={name} />
            </div>

            <div className={cx('group')}>
                <span className={cx('username')}>{name}</span>
                <Link to={config.routes.update} >Quản lý tài khoản của bạn</Link>
            </div>
        </div>
    );
}

export default UserHeader;
