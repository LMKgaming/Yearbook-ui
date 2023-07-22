import { forwardRef, useState } from 'react';
import styles from './ContextMenu.module.scss';
import classNames from 'classnames/bind';
import Button from '../Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

const defaultFn = () => {}
const cx = classNames.bind(styles);

const ContextMenu = forwardRef(({show = false, data = [], wrapperCss, onChange = defaultFn, itemCss, iconCss, contentCss }, ref) => {
    const [page, setPage] = useState([{ data }]);
    const current = page[0];

    const renderItem = () => {
        return current.data.map((item, index) => {
            const isParent = !!item.children;
            return (
                <Button
                    key={index}
                    className={cx('menu-item', {
                        split: !!item.split,
                        [itemCss]: itemCss,
                    })}
                    leftIconCss={iconCss}
                    leftIcon={item.icon}
                    contentCss={cx('menu-item-content', {
                        [contentCss]: contentCss,
                    })}
                    name={item.title}
                    rightIcon={isParent && <FontAwesomeIcon icon={faChevronRight} />}
                    onClick={() => {
                        if (isParent) {
                            setPage((prev) => [item.children, ...prev]);
                        } else {
                            onChange(item);
                        }
                    }}
                />
            );
        });
    };

    return (
        <div
            className={cx('wrapper', {
                [wrapperCss]: wrapperCss,
                show
            })}
            ref={ref}
            onContextMenu={(e) => {
                e.preventDefault()
            }}
        >
            {renderItem()}
        </div>
    );
});

export default ContextMenu;
