import classNames from 'classnames/bind';
import styles from './MultiLevelMenu.module.scss';
import { useEffect, useState } from 'react';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';

const cx = classNames.bind(styles);
const defaultFn = () => {};

const MultiLevelMenuItem = ({ data, multiLevel, onClick = defaultFn, backFn = defaultFn, ...props }) => {
    const leftIcon = (() => {
        if (data.type === 'header') return <FontAwesomeIcon icon={faChevronLeft} />;
        if (data.choose) return <FontAwesomeIcon icon={faCheck} />;
        return data.icon
    })();

    return (
        <Button
            name={
                data.multiChoice
                    ? `${data.content}: ${data.children.find((p) => p.choose)?.content || 'Unknown'}`
                    : data.content
            }
            leftIcon={leftIcon}
            rightIcon={multiLevel && (data.customIconMore || <FontAwesomeIcon icon={faChevronRight} />)}
            className={cx('menu-item', {
                split: data.split || data.type === 'header',
                header: data.type === 'header',
            })}
            contentCss={cx('menu-item-content', {
                header: data.type === 'header',
                spacing: !leftIcon,
            })}
            leftIconCss={cx('menu-item-icon-left', {
                header: data.type === 'header',
            })}
            rightIconCss={cx('menu-item-icon-right')}
            onClick={data.type ? defaultFn : onClick}
            leftIconOnClickOnly={data.type === 'header' ? backFn : undefined}
            {...props}
        />
    );
};

const MultiLevelMenu = ({
    show = true,
    data = [],
    moveable = true,
    top,
    left,
    bottom,
    right,
    corner = 5,
    callbackGetId = defaultFn,
    onChange = defaultFn,
    ...props
}) => {
    const id = uuidv4();
    const [pages, setPages] = useState([{ data }]);
    const currentPage = pages[0];

    const backFn = () => setPages((prev) => prev.slice(1, prev.length));

    const renderItem = () => {
        return currentPage.data.map((item, index) => {
            const multiLevel = !!item.children;
            return (
                <MultiLevelMenuItem
                    key={index}
                    data={item}
                    multiLevel={multiLevel}
                    backFn={backFn}
                    onClick={() => {
                        if (multiLevel) {
                            setPages((prev) => [{ data: item.children }, ...prev]);
                        } else {
                            if (typeof item.onClick === 'function') item.onClick(item);
                            else onChange(item);
                        }
                    }}
                />
            );
        });
    };

    useEffect(() => {
        callbackGetId(`react${id}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return (
        <>
            {show && (
                <div
                    id={`react${id}`}
                    className={cx('menu-wrapper', {
                        moveable: moveable,
                    })}
                    style={{
                        top,
                        left,
                        bottom,
                        right,
                        borderRadius: corner,
                    }}
                >
                    {renderItem()}
                </div>
            )}
        </>
    );
};

export default MultiLevelMenu;
