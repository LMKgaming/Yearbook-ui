import classNames from 'classnames/bind';
import styles from './GalleryGrid.module.scss';
import Image from '~/components/Image';
import Text from '~/components/Text';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import Loader from '~/components/Loader';
import { useEffect, useRef, useState } from 'react';

const cx = classNames.bind(styles);

const GalleryItemGrid = ({ index, name, image, id = '', handleContextMenu }) => {
    const [isLoading, setIsLoading] = useState(true);
    const itemRef = useRef()
    const navigate = useNavigate();
    const callbackNaturalSize = () => {
        console.log(itemRef.current.offsetTop)
        setIsLoading(false)
    };
    const handleClickItem = () => {
        navigate(config.routes.galleryItem.replace(':id', `${id}&${index}`));
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
