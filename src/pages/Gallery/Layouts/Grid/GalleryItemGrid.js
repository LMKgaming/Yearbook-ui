import classNames from 'classnames/bind';
import styles from './GalleryGrid.module.scss';
import Image from '~/components/Image';
import Text from '~/components/Text';
import Loader from '~/components/Loader';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const cx = classNames.bind(styles);

const GalleryItemGrid = ({ index, name, image, id = '', handleContextMenu }) => {
    const [isLoading, setIsLoading] = useState(true);
    const itemRef = useRef()
    const [, setSearchParams] = useSearchParams()
    const callbackNaturalSize = () => {
        console.log(itemRef.current.offsetTop)
        setIsLoading(false)
    };
    const handleClickItem = () => {
        setSearchParams({id, index})
    };

    useEffect(() => {
        console.log(itemRef.current.offsetTop)
    }, [])

    return (
        <div ref={itemRef} className={cx('content-image-wrapper')} onContextMenu={handleContextMenu} onClick={handleClickItem}>
            {isLoading && (
                <div className={cx('loader-each-img')}>
                    <Loader />
                </div>
            )}
            <div
                className={cx('content-image-box')}
                style={{
                    visibility: !isLoading ? 'visible' : 'hidden',
                }}
            >
                <Image
                    src={image}
                    className={cx('content-image')}
                    loading={'lazy'}
                    callbackNaturalSize={callbackNaturalSize}
                />
            </div>
            <Text className={cx('content-image-info')} content={name} />
        </div>
    );
};

export default GalleryItemGrid;
