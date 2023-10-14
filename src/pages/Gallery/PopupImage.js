import classNames from 'classnames/bind';
import styles from './Gallery.module.scss';
import Button from '~/components/Button';
import Text from '~/components/Text';
import Image from '~/components/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faCheck,
    faChevronLeft,
    faChevronRight,
    faDownload,
    faEllipsisVertical,
    faImage,
    faMagnifyingGlassMinus,
    faMinus,
    faPlus,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { useViewport } from '~/hooks';
import config from '~/config';
import images from '~/assets/images';
import Loader from '~/components/Loader';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { downloadImage } from '~/functions';

const cx = classNames.bind(styles);

const PopupImage = ({ id, index, dataServer = [] }) => {
    const dataCurrent = index ? dataServer[index - 1] : dataServer.find((data) => data.Id === id);
    const [, setSearchParams] = useSearchParams()
    const navigate = useNavigate();
    const [showInfoImage, setShowInfoImage] = useState(false);
    const [naturalSize, setNaturalSize] = useState({
        width: 0,
        height: 0,
    });
    const [imageSize, setImageSize] = useState({
        width: 0,
        height: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const mainContentRef = useRef();
    const { width, height, isHorizontal } = useViewport();

    const handleClickMoreOption = () => setShowInfoImage(true);
    const handleClickXMark = () => setShowInfoImage(false);
    const handleClickNavBtn = (to) => {
        if (to === 'prev') {
            setSearchParams({id: dataServer[+dataCurrent?.Index].Id,index: +dataCurrent?.Index - 1})
        } else if (to === 'next') {
            setSearchParams({id: dataServer[+dataCurrent?.Index].Id, index: +dataCurrent?.Index + 1})
        }
        setIsLoading(true)
    };

    const callbackNaturalSize = (width, height) => {
        setNaturalSize({ width, height });
        setIsLoading(false);
    };

    useEffect(() => {
        const listener = (e) => {
            if (
                e.target.closest('#group-action') ||
                e.target.closest('#action-btn') ||
                e.target.closest('#image-box') ||
                e.target.closest('#bottom-action') ||
                e.target.closest('#info-box')
            )
                return;
            navigate(config.routes.gallery);
        };

        document.addEventListener('mousedown', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (naturalSize.width === 0 || naturalSize.height === 0) return;

        if (isHorizontal) {
            let imageHeight = mainContentRef.current.offsetHeight;
            let imageWidth = (imageHeight * naturalSize.width) / naturalSize.height;
            if (imageWidth > mainContentRef.current.offsetWidth - 25 * 2) {
                imageHeight = imageHeight - 20 * 2;
                imageWidth = (imageHeight * naturalSize.width) / naturalSize.height;
            }
            if (imageWidth > width * 16 - 25 * 2) {
                imageWidth = mainContentRef.current.offsetWidth - 25 * 2;
                imageHeight = (imageWidth * naturalSize.height) / naturalSize.width;
            }
            setImageSize((prev) => ({ ...prev, height: imageHeight, width: imageWidth }));
        } else {
            let imageWidth = mainContentRef.current.offsetWidth - 25 * 2;
            let imageHeight = (imageWidth * naturalSize.height) / naturalSize.width;
            setImageSize((prev) => ({ ...prev, height: imageHeight, width: imageWidth }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [width, naturalSize.width, naturalSize.height]);

    return (
        <div
            className={cx('popup-image')}
            style={{
                width: width * 16,
                height: height * 16,
            }}
        >
            <div className={cx('top-action')}>
                <div className={cx('group-left')} id="group-action">
                    {[{ icon: faArrowLeft }, { icon: faImage }].map((data, index) => (
                        <Button
                            key={index}
                            className={cx('button')}
                            name={<FontAwesomeIcon icon={data.icon} />}
                            to={config.routes.gallery}
                        />
                    ))}
                    <Text className={cx('text')} content={dataCurrent?.Name || 'Missing Name'} />
                </div>
                <div className={cx('group-right')} id="group-action">
                    <Button
                        className={cx('button')}
                        name={<FontAwesomeIcon icon={faDownload} />}
                        onClick={() => downloadImage(dataCurrent)}
                    />
                    <Button
                        className={cx('button')}
                        name={<FontAwesomeIcon icon={faEllipsisVertical} />}
                        onClick={handleClickMoreOption}
                    />
                </div>
            </div>
            <div className={cx('main-content')} ref={mainContentRef}>
                {+dataCurrent?.Index !== 1 && (
                    <Button
                        id="action-btn"
                        className={cx('button', 'content-btn-l')}
                        name={<FontAwesomeIcon icon={faChevronLeft} />}
                        onClick={() => handleClickNavBtn('prev')}
                    />
                )}
                {isLoading && (
                    <div className={cx('popup-loader')}>
                        <Loader />
                    </div>
                )}
                <div
                    id="image-box"
                    className={cx('main-content-image-box')}
                    style={{
                        width: imageSize.width,
                        height: imageSize.height,
                        visibility: !isLoading ? 'visible' : 'hidden',
                    }}
                >
                    <Image
                        className={cx('main-content-image')}
                        src={dataCurrent?.URLWebp || dataCurrent?.URL || images.noImage}
                        callbackNaturalSize={callbackNaturalSize}
                    />
                </div>
                {showInfoImage && (
                    <div className={cx('content-info-contain')} id="info-box">
                        <div className={cx('content-info-header')}>
                            <Text className={cx('text', 'info-title')} content={'More'} />
                            <Button
                                className={cx('button', 'content-info-x_mark')}
                                name={<FontAwesomeIcon icon={faXmark} />}
                                onClick={handleClickXMark}
                            />
                        </div>
                        <div className={cx('content-info-box')}>
                            <Text className={cx('text', 'content-info-title')} content={'Type:'} />
                            <Text className={cx('text', 'content-info')} content={'Image'} />
                            <Text className={cx('text', 'content-info-title')} content={'Ratio:'} />
                            <Text
                                className={cx('text', 'content-info')}
                                content={`${naturalSize.width} x ${naturalSize.height}`}
                            />
                            <Text className={cx('text', 'content-info-title')} content={'Size:'} />
                            <Text
                                className={cx('text', 'content-info')}
                                content={`${(+dataCurrent?.Size / 1024 ** 2)?.toFixed(2)} MB`}
                            />
                            <Text className={cx('text', 'content-info-title')} content={'Download:'} />
                            <Button
                                className={cx('button', 'content-available-download')}
                                name={<FontAwesomeIcon icon={faCheck} />}
                            />
                        </div>
                    </div>
                )}
                {+dataCurrent.Index !== dataServer.length && (
                    <Button
                        id="action-btn"
                        className={cx('button', 'content-btn-r')}
                        name={<FontAwesomeIcon icon={faChevronRight} />}
                        onClick={() => handleClickNavBtn('next')}
                    />
                )}
            </div>
            <div className={cx('bottom-action')} id="bottom-action">
                <Button className={cx('button')} name={<FontAwesomeIcon icon={faMinus} />} />
                <Button className={cx('button')} name={<FontAwesomeIcon icon={faMagnifyingGlassMinus} />} />
                <Button className={cx('button')} name={<FontAwesomeIcon icon={faPlus} />} />
            </div>
        </div>
    );
};

export default PopupImage;
