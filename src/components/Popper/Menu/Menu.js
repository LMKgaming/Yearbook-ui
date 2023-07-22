import Tippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import 'tippy.js/dist/tippy.css'; // optional

import styles from './Menu.module.scss';
import classNames from 'classnames/bind';
import MenuItem from './MenuItem';
import { useState } from 'react';
import Text from '~/components/Text';
import Header from './Header';
import UserHeader from './UserHeader';

const cx = classNames.bind(styles);
const defaultFn = () => {};

function Menu({
    children,
    data = [],
    onChange = defaultFn,
    show,
    placement,
    wrapperCss,
    iconCss,
    contentCss,
    special,
}) {
    const [page, setPage] = useState([{ value: data }]);
    const current = page[0];

    const renderItem = () => {
        return current.value.map((item, index) => {
            const isParent = !!item.children;

            return (
                <MenuItem
                    iconCss={iconCss}
                    contentCss={contentCss}
                    key={index}
                    data={item}
                    push={page.length > 1}
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
        <div>
            <Tippy
                visible={show}
                interactive
                offset={[12, 8]}
                delay={[0, 700]}
                placement={placement}
                render={(attrs) => (
                    <div
                        className={cx('wrapper', {
                            [wrapperCss]: wrapperCss,
                        })}
                        tabIndex="-1"
                        {...attrs}
                    >
                        <PopperWrapper>
                            {page.length <= 1 && special && <UserHeader avt={special.avt} name={special.name} />}
                            {page.length > 1 && current.description !== 'undefined' && (
                                <Header
                                    content={current.header}
                                    onBack={() => {
                                        setPage((prev) => [...prev.slice(1, prev.length)]);
                                    }}
                                />
                            )}
                            {page.length > 1 && current.description !== 'undefined' && (
                                <Text className={cx('item-desc')} content={current.description} />
                            )}
                            {renderItem()}
                        </PopperWrapper>
                    </div>
                )}
                onHide={() => {
                    setPage((prev) => [...prev.slice(prev.length - 1, prev.length)]);
                }}
            >
                {children}
            </Tippy>
        </div>
    );
}

export default Menu;
