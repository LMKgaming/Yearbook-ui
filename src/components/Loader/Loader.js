import classNames from 'classnames/bind';
import styles from './Loader.module.scss';

const cx = classNames.bind(styles);

function Loader({ type = 'default' }) {
    switch (type) {
        case 'times':
            return (
                <span className={cx('times-loader')}></span>
            )
        default:
            return (
                <div className={cx('loader')}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            );
    }
}

export default Loader;
