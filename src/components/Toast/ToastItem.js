import classNames from 'classnames/bind';
import styles from './Toast.module.scss';
import Text from '~/components/Text';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCircleCheck,
    faCircleInfo,
    faCircleExclamation,
    faTriangleExclamation,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { convertToSentenceCase } from '~/functions';
import { useEffect, useRef } from 'react';
import Loader from '~/components/Loader';

const cx = classNames.bind(styles);

const icons = {
    success: faCircleCheck,
    info: faCircleInfo,
    warning: faCircleExclamation,
    error: faTriangleExclamation,
};

const ToastItem = ({
    id,
    type = 'info',
    title = type,
    msg = 'Missing msg',
    duration,
    animationTime = 0.5,
    decrease = true,
    percent,
    subTitle = false,
    callbackAnimationEnd = () => {},
}) => {
    const timeoutRef = useRef();

    const handleClickClose = (timeoutId) => {
        clearTimeout(timeoutId);
        callbackAnimationEnd(id, false);
    };

    useEffect(() => {
        if (percent === 100) {
            setTimeout(() => {
                callbackAnimationEnd(id);
            }, animationTime * 3 * 1000);
            return;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [percent]);

    useEffect(() => {
        if (percent !== undefined) return;
        const timeoutId = setTimeout(() => {
            callbackAnimationEnd(id);
        }, duration * 1000 + animationTime * 1000);
        timeoutRef.current = timeoutId;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (percent !== undefined) {
        return (
            <div
                className={cx('toast', type)}
                style={{
                    animation:
                        percent === 100
                            ? `slideOutRight ease ${animationTime}s ${animationTime * 2}s forwards`
                            : `slideInLeft ease ${animationTime}s forwards`,
                }}
            >
                <Button
                    name={<FontAwesomeIcon icon={icons[type]} />}
                    className={cx('toast-icon', {
                        waiting: percent < 100,
                    })}
                    contentCss={cx('toast-icon-content')}
                />
                {percent !== 100 && (
                    <div className={cx('toast-icon-loading')}>
                        <Loader type="times" />
                    </div>
                )}
                <div className={cx('toast-body')}>
                    <Text
                        className={cx('toast-body-title')}
                        content={convertToSentenceCase(title).concat(subTitle ? ` ${percent}%` : '')}
                    />
                    <Text className={cx('toast-body-msg')} content={msg} />
                </div>
                <Button
                    name={<FontAwesomeIcon icon={faXmark} />}
                    className={cx('toast-close')}
                    contentCss={cx('toast-close-content')}
                    onClick={() => {
                        handleClickClose(timeoutRef.current);
                    }}
                />
                <div
                    className={cx('toast-progress-bar', type)}
                    style={{
                        transition: `all ${animationTime}s linear`,
                        width: percent + '%',
                    }}
                />
            </div>
        );
    } else
        return (
            <div
                className={cx('toast', type)}
                style={{
                    animation: `slideInLeft ease ${animationTime}s, slideOutRight ease ${animationTime}s ${duration}s forwards`,
                }}
                onClick={() => {
                    handleClickClose(timeoutRef.current);
                }}
            >
                <Button
                    name={<FontAwesomeIcon icon={icons[type]} />}
                    className={cx('toast-icon')}
                    contentCss={cx('toast-icon-content')}
                />
                <div className={cx('toast-body')}>
                    <Text className={cx('toast-body-title')} content={convertToSentenceCase(title)} />
                    <Text className={cx('toast-body-msg')} content={msg} />
                </div>
                <Button
                    name={<FontAwesomeIcon icon={faXmark} />}
                    className={cx('toast-close')}
                    contentCss={cx('toast-close-content')}
                    onClick={() => {
                        handleClickClose(timeoutRef.current);
                    }}
                />
                <div
                    className={cx('toast-progress-bar', type)}
                    style={{
                        animation: `${
                            decrease ? 'progressDecrease' : 'progressIncrease'
                        } cubic-bezier(0.79, 0.46, 0.14, 0.55) ${duration}s forwards`,
                    }}
                />
            </div>
        );
};

export default ToastItem;
