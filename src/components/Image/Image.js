import { useState, forwardRef } from 'react';
import images from '~/assets/images';
import classNames from 'classnames';
import styles from './Image.module.scss';

const cx = classNames.bind(styles);

const Image = forwardRef(
    (
        {
            src,
            alt = 'image',
            className,
            customFallback = images.noImage,
            callbackNaturalSize = () => {},
            ...props
        },
        ref,
    ) => {
        const [fallback, setFallback] = useState('');

        const handleError = () => {
            setFallback(customFallback);
        };

        return (
            <img
                className={cx('wrapper', {
                    [className]: className,
                })}
                ref={ref}
                src={fallback || src}
                alt={alt}
                onLoad={(e) => {
                    callbackNaturalSize(e.target.naturalWidth, e.target.naturalHeight)
                }}
                {...props}
                onError={handleError}
            />
        );
    },
);

export default Image;
