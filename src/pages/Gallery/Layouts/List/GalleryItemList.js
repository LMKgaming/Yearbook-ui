import classNames from 'classnames/bind';
import styles from './GalleryList.module.scss';
import { useEffect, useState } from 'react';
import { useDebounce, useViewport } from '~/hooks';
import Image from '~/components/Image';
import Text from '~/components/Text';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faImage } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import { downloadImage } from '~/functions';

const cx = classNames.bind(styles);

const GalleryItemList = ({ index, image, name, id = '', size, pressP = false }) => {
    const navigate = useNavigate();
    const { width, height, isHorizontal } = useViewport();
    const [naturalSize, setNaturalSize] = useState({
        width: 0,
        height: 0,
    });
    const [imageSizeCurrent, setImageSizeCurrent] = useState({
        width: 0,
        height: 0,
    });
    const [hovered, setHovered] = useState(false);
    const debouncedHovered = useDebounce(hovered, 500);

    const handleMouseEnter = () => setHovered(true);
    const handleMouseLeave = () => setHovered(false);
    const handleClickItem = () => navigate(config.routes.galleryItem.replace(':id', `${id}&${index}`));

    const callbackNaturalSize = (width, height) => setNaturalSize((prev) => ({ ...prev, width, height }));

    useEffect(() => {
        if (naturalSize.width === 0 || naturalSize.height === 0) return;
        if (isHorizontal) {
            let imageHeight = (height * 16 * 60) / 100;
            let imageWidth = (imageHeight * naturalSize.width) / naturalSize.height;
            setImageSizeCurrent((prev) => ({ ...prev, width: imageWidth, height: imageHeight }));
        } else {
            let imageWidth = (width * 16 * 60) / 100;
            let imageHeight = (imageWidth * naturalSize.height) / naturalSize.width;
            setImageSizeCurrent((prev) => ({ ...prev, width: imageWidth, height: imageHeight }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [width, height, naturalSize.width, naturalSize.height]);

    return (
        <>
            {pressP && debouncedHovered && (
                <div className={cx('content-item-image-box')}>
                    <Image
                        src={image}
                        width={imageSizeCurrent.width}
                        height={imageSizeCurrent.height}
                        callbackNaturalSize={callbackNaturalSize}
                    />
                </div>
            )}
            <div
                className={cx('content-item-wrapper', 'split')}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClickItem}
            >
                <FontAwesomeIcon className={cx('content-item-icon')} icon={faImage} />
                <Text className={cx('content-item-content')} content={name} />
                <Text className={cx('content-item-size')} content={`${Math.round(size * 100) / 100} MB`} />
                <div className={cx('content-item-action')}>
                    <Button
                        className={cx('content-action-item')}
                        name={<FontAwesomeIcon icon={faDownload} />}
                        onClick={(e) => {
                            e.stopPropagation()
                            downloadImage({dataCurrent: {Id: id, Name: name}, usingSubtitle: true})
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default GalleryItemList;
