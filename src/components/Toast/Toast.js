import classNames from 'classnames/bind';
import styles from './Toast.module.scss';
import ToastItem from './ToastItem';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const cx = classNames.bind(styles);

const defaultObjectType = ({ id, type, title, msg, duration, decrease, percent, subTitle = false }) => ({
    id,
    type,
    title,
    msg,
    duration,
    decrease,
    percent,
    subTitle,
});

const toastConfig = {};

const closeEvent = new CustomEvent('toast', { detail: { isClosed: true } });

const Toast = ({ stackToast = false, ...props }) => {
    const [toastData, setToastData] = useState([]);
    const containerRef = useRef();

    const handleCallbackAnimationEnd = (id) => {
        document.dispatchEvent(closeEvent)
        setToastData((prev) => prev.filter((p) => p.id !== id));
    };

    const renderItem = () => {
        return toastData.map((item) => {
            return (
                <ToastItem
                    key={item.id}
                    id={item.id}
                    type={item.type}
                    title={item.title}
                    msg={item.msg}
                    duration={item.duration}
                    decrease={item.decrease}
                    percent={item.percent}
                    subTitle={item.subTitle}
                    callbackAnimationEnd={handleCallbackAnimationEnd}
                />
            );
        });
    };

    useEffect(() => {
        Object.assign(toastConfig, {
            successToast: (title, msg, duration, decrease) => {
                setToastData((prev) => [
                    ...prev,
                    defaultObjectType({
                        id: uuidv4(),
                        type: 'success',
                        title,
                        msg,
                        duration: +(duration / 1000).toFixed(2),
                        decrease,
                    }),
                ]);
            },
            infoToast: (title, msg, duration, decrease) => {
                setToastData((prev) => [
                    ...prev,
                    defaultObjectType({
                        id: uuidv4(),
                        type: 'info',
                        title,
                        msg,
                        duration: +(duration / 1000).toFixed(2),
                        decrease,
                    }),
                ]);
            },
            warningToast: (title, msg, duration, decrease) => {
                setToastData((prev) => [
                    ...prev,
                    defaultObjectType({
                        id: uuidv4(),
                        type: 'warning',
                        title,
                        msg,
                        duration: +(duration / 1000).toFixed(2),
                        decrease,
                    }),
                ]);
            },
            errorToast: (title, msg, duration, decrease) => {
                setToastData((prev) => [
                    ...prev,
                    defaultObjectType({
                        id: uuidv4(),
                        type: 'error',
                        title,
                        msg,
                        duration: +(duration / 1000).toFixed(2),
                        decrease,
                    }),
                ]);
            },
            percentToast: (title, msg, percent, subTitle) => {
                let obj = defaultObjectType({ id: uuidv4(), type: 'error', title, msg, percent, subTitle });
                setToastData((prev) => [...prev, obj]);
                return obj.id;
            },
            setPercentToast: (id, newPercent) => {
                setToastData((prev) => {
                    let index = prev.findIndex((p) => p.id === id);
                    if (index === -1) return prev;
                    return [
                        ...prev.slice(0, index),
                        defaultObjectType({
                            ...prev[index],
                            percent: newPercent,
                            type:
                                newPercent < 25
                                    ? 'error'
                                    : newPercent < 50
                                    ? 'warning'
                                    : newPercent < 90
                                    ? 'info'
                                    : 'success',
                        }),
                        ...prev.slice(index + 1),
                    ];
                });
            },
        });
    }, []);

    return (
        <div ref={containerRef} className={cx('container')}>
            {renderItem()}
        </div>
    );
};

export { toastConfig };

export default Toast;
