import classNames from 'classnames/bind';
import styles from './Video.module.scss';
import Button from '~/components/Button';
import Text from '~/components/Text';
import Video from '~/components/Video';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faCheck,
    faChevronLeft,
    faChevronRight,
    faDownload,
    faEllipsisVertical,
    faFilm,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { useViewport } from '~/hooks';
import config from '~/config';
import Loader from '~/components/Loader/Loader';
import videos from '~/assets/videos';
// import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const PopupVideo = ({ id, name, video }) => {
    const [showInfoVideo, setShowInfoVideo] = useState(false);
    const [naturalSize, setNaturalSize] = useState({
        width: 0,
        height: 0,
    });
    const [videoSize, setVideoSize] = useState({
        width: 0,
        height: 0,
    });
    const mainContentRef = useRef();
    const { width, height, isHorizontal } = useViewport();
    const [isLoading, setIsLoading] = useState(true);

    const handleClickMoreOption = () => setShowInfoVideo(true);
    const handleClickXMark = () => setShowInfoVideo(false);

    const callbackResolution = (width, height) => {
        setNaturalSize({ width, height });
        setIsLoading(false);
    };

    useEffect(() => {
        if (naturalSize.width === 0 || naturalSize.height === 0) return;

        if (isHorizontal) {
            let videoHeight = mainContentRef.current.offsetHeight;
            let videoWidth = (videoHeight * naturalSize.width) / naturalSize.height;
            if (videoWidth > mainContentRef.current.offsetWidth - 25 * 2) {
                videoHeight = videoHeight - 20 * 2;
                videoWidth = (videoHeight * naturalSize.width) / naturalSize.height;
            }
            if (videoWidth > width * 16 - 25 * 2) {
                videoWidth = mainContentRef.current.offsetWidth - 25 * 2;
                videoHeight = (videoWidth * naturalSize.height) / naturalSize.width;
            }
            setVideoSize((prev) => ({ ...prev, height: videoHeight, width: videoWidth }));
        } else {
            let videoWidth = mainContentRef.current.offsetWidth - 25 * 2;
            let videoHeight = (videoWidth * naturalSize.height) / naturalSize.width;
            setVideoSize((prev) => ({ ...prev, height: videoHeight, width: videoWidth }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [width, naturalSize.width, naturalSize.height]);

    return (
        <div
            className={cx('popup-video')}
            style={{
                width: width * 16,
                height: height * 16,
            }}
        >
            <div className={cx('top-action')}>
                <div className={cx('group-left')}>
                    {[{ icon: faArrowLeft }, { icon: faFilm }].map((data, index) => (
                        <Button
                            key={index}
                            className={cx('button')}
                            name={<FontAwesomeIcon icon={data.icon} />}
                            to={config.routes.video}
                        />
                    ))}
                    <Text className={cx('text')} content={name} />
                </div>
                <div className={cx('group-right')}>
                    <Button
                        className={cx('button')}
                        name={<FontAwesomeIcon icon={faDownload} />}
                        // onClick={}
                    />
                    <Button
                        className={cx('button')}
                        name={<FontAwesomeIcon icon={faEllipsisVertical} />}
                        onClick={handleClickMoreOption}
                    />
                </div>
            </div>
            <div className={cx('main-content')} ref={mainContentRef}>
                <Button className={cx('button', 'content-btn-l')} name={<FontAwesomeIcon icon={faChevronLeft} />} />
                {isLoading && (
                    <div className={cx('popup-loader')}>
                        <Loader />
                    </div>
                )}
                <div
                    className={cx('main-content-video-box')}
                    style={{
                        width: videoSize.width,
                        height: videoSize.height,
                        visibility: !isLoading ? 'visible' : 'hidden',
                    }}
                >
                    <Video
                        className={cx('main-content-video')}
                        src={
                            // 'https://www.googleapis.com/drive/v3/files/1cjfiH1pkUj6sPrn8HPm7D72idaCpKlnq?key=AIzaSyC84ctq7PNv-_G6ca6kFL4IIIA0ESab6I0&alt=media'
                            videos.video_1
                        }
                        width={600}
                        height={400}
                        callbackResolution={callbackResolution}
                        customControl
                    />
                </div>
                {showInfoVideo && (
                    <div className={cx('content-info-contain')}>
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
                            <Text className={cx('text', 'content-info')} content={'Video'} />
                            <Text className={cx('text', 'content-info-title')} content={'Length:'} />
                            <Text className={cx('text', 'content-info')} content={'8:20'} />
                            <Text className={cx('text', 'content-info-title')} content={'Resolution:'} />
                            <Text
                                className={cx('text', 'content-info')}
                                content={`${naturalSize.width} x ${naturalSize.height}`}
                            />
                            <Text className={cx('text', 'content-info-title')} content={'Size:'} />
                            <Text className={cx('text', 'content-info')} content={'4 MB'} />
                            <Text className={cx('text', 'content-info-title')} content={'Download:'} />
                            <Button
                                className={cx('button', 'content-available-download')}
                                name={<FontAwesomeIcon icon={faCheck} />}
                            />
                        </div>
                    </div>
                )}
                <Button className={cx('button', 'content-btn-r')} name={<FontAwesomeIcon icon={faChevronRight} />} />
            </div>
        </div>
    );
};

export default PopupVideo;
