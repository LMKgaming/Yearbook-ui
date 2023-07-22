import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import styles from './Menu.module.scss';
import classNames from 'classnames/bind';
import Button from '~/components/Button';
const cx = classNames.bind(styles);

function MenuItem({ data, onClick, contentCss, iconCss }) {
    const leftIcon = data.icon ? data.icon : data.ticked ? <FontAwesomeIcon icon={faCheck} /> : false;

    return (
        <Button
            to={data.to}
            onClick={onClick}
            className={cx('item', {
                split: data.split,
                push: data.children ? false : leftIcon ? false : true,
            })}
            name={data.title}
            contentCss={cx('title', {
                [contentCss]: contentCss,
            })}
            leftIcon={leftIcon}
            leftIconCss={cx('icon', {
                [iconCss]: iconCss,
            })}
            rightIcon={data.children && <FontAwesomeIcon className={cx('more')} icon={faChevronRight} />}
            rightIconCss={cx('more')}
        />
    );
}

export default MenuItem;
