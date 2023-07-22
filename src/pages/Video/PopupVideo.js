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
    faClosedCaptioning,
    faDownload,
    faEllipsisVertical,
    faExpand,
    faFilm,
    faGear,
    faObjectGroup,
    faPlay,
    faVolumeHigh,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { useViewport } from '~/hooks';
import config from '~/config';
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

    console.log(naturalSize, videoSize)

    const handleClickMoreOption = () => setShowInfoVideo(true);
    const handleClickXMark = () => setShowInfoVideo(false);

    const callbackResolution = (width, height) => setNaturalSize({ width, height });

    useEffect(() => {
        if (naturalSize.width === 0 || naturalSize.height === 0) return;

        if (isHorizontal) {
            let videoHeight = mainContentRef.current.offsetHeight;
            let videoWidth = (videoHeight * naturalSize.width) / naturalSize.height;
            if (videoWidth > mainContentRef.current.offsetWidth - 25 * 2) {
                videoHeight = videoHeight - 20 * 2;
                videoWidth = (videoHeight * naturalSize.width) / naturalSize.height;
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
                <div
                    className={cx('main-content-video-box')}
                    style={{ width: videoSize.width, height: videoSize.height }}
                >
                    <Video className={cx('main-content-video')} src={video} callbackResolution={callbackResolution}/>
                    <div className={cx('controls-group')}>
                        <div className={cx('time-line')}>

                        </div>
                        <div className={cx('controls-btn')}>
                            <div className={cx('controls-left')}>
                                <Button name={<FontAwesomeIcon icon={faPlay}/>}/>
                                <Button name={<FontAwesomeIcon icon={faVolumeHigh}/>}/>
                                <input type='range' max={100} min={0} step={1} defaultValue={100}/>
                                <Text content={'0:00 / 2:20'}/>
                            </div>
                            <div className={cx('controls-right')}>
                                <Button name={<FontAwesomeIcon icon={faClosedCaptioning}/>}/>
                                <Button name={<FontAwesomeIcon icon={faGear}/>}/>
                                <Button name={<FontAwesomeIcon icon={faObjectGroup}/>}/>
                                <Button name={<FontAwesomeIcon icon={faExpand}/>}/>
                            </div>
                        </div>
                    </div>
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
