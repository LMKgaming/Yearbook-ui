import classNames from 'classnames/bind';
import styles from './Loader.module.scss';

const cx = classNames.bind(styles);

function Loader() {
    return (
        <>
            <div className={cx('loader-top')}></div>
            <div className={cx('loader-bottom')}></div>
        </>
    );
}

export default Loader;
