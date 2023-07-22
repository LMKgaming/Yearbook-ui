import { useState, forwardRef } from 'react';

import classNames from 'classnames/bind';
import styles from './Video.module.scss';

const cx = classNames.bind(styles);

const Video = forwardRef(({ src, alt = 'video', className, customFallback, callbackResolution = () => {}, ...props }, ref) => {
    const [fallback, setFallback] = useState('');

    const handleError = () => {
        setFallback(customFallback);
    };

    return (
        <video
            className={cx('wrapper', {
                [className]: className,
            })}
            ref={ref}
            src={fallback || src}
            onCanPlay={(e) => callbackResolution(e.target.videoWidth, e.target.videoHeight)}
            {...props}
            onError={handleError}
        />
    );
});

export default Video;
