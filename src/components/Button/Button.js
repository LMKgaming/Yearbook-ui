import classNames from 'classnames/bind';
import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Button.module.scss';

const cx = classNames.bind(styles);
const defaultFn = () => {};

const Button = forwardRef(
    (
        {
            small,
            medium,
            large,
            name,
            leftIcon,
            rightIcon,
            leftIconCss,
            rightIconCss,
            contentCss,
            to,
            href,
            status,
            rounded,
            border,
            className,
            rightIconOnClickOnly = defaultFn,
            leftIconOnClickOnly = defaultFn,
            ...props
        },
        ref,
    ) => {
        let Type = 'button';

        const prop = {
            ...props,
        };

        if (status === 'disabled') {
            Object.keys(prop).forEach((key) => {
                if (key.startsWith('on') && typeof prop[key] === 'function') {
                    delete prop[key];
                }
            });
        }

        if (to) {
            Type = Link;
            prop.to = to;
        } else if (href) {
            Type = 'a';
            prop.href = href;
        }

        const classes = cx('wrapper', {
            large,
            medium,
            small,
            rounded,
            border,
            [status]: status,
            [className]: className,
        });

        const leftIconClasses = cx('left-icon', {
            [leftIconCss]: leftIconCss,
        });

        const rightIconClasses = cx('right-icon', {
            [rightIconCss]: rightIconCss,
        });

        const contentClasses = cx('name', {
            [contentCss]: contentCss,
        });

        return (
            <Type ref={ref} className={classes} {...prop}>
                {leftIcon && (
                    <span
                        className={leftIconClasses}
                        onClick={(e) => {
                            e.stopPropagation();
                            leftIconOnClickOnly(e);
                        }}
                    >
                        {leftIcon}
                    </span>
                )}
                <span className={contentClasses}>{name}</span>
                {rightIcon && (
                    <span
                        className={rightIconClasses}
                        onClick={(e) => {
                            e.stopPropagation();
                            rightIconOnClickOnly(e);
                        }}
                    >
                        {rightIcon}
                    </span>
                )}
            </Type>
        );
    },
);

export default Button;
