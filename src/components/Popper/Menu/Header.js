import styles from './Menu.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Header({ content, onBack }) {
    return (
        <div className={cx('header')}>
            <FontAwesomeIcon className={cx('back')} icon={faChevronLeft} onClick={onBack}/>
            <p className={cx('text')}>{content}</p>
        </div>
    );
}

export default Header;
