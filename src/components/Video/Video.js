import { useState, useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Video.module.scss';
import Button from '~/components/Button';
import Text from '~/components/Text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowRotateLeft,
    faClosedCaptioning,
    faCompress,
    faExpand,
    faGear,
    faObjectGroup,
    faPause,
    faPlay,
    faVolumeHigh,
    faVolumeLow,
    faVolumeXmark,
} from '@fortawesome/free-solid-svg-icons';
import { formatTime } from '~/functions';
import Loader from '../Loader/Loader';
import MultiLevelMenu from '../MultiLevelMenu/MultiLevelMenu';

const cx = classNames.bind(styles);

const Video = ({
    src,
    alt = 'video',
    className,
    customFallback,
    callbackResolution = () => {},
    customControl = false,
    ...props
}) => {
    const [fallback, setFallback] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSeeking, setIsSeeking] = useState(false);
    const [showController, setShowController] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [volumeValue, setVolumeValue] = useState(100);
    const [chooseTimeWidth, setChooseTimeWidth] = useState(0);
    const [showVolumeBar, setShowVolumeBar] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const videoRef = useRef();
    const data = useRef(
        (() => {
            const handleClickRateChange = (rate) => {
                if (videoRef.current) {
                    videoRef.current.playbackRate = rate;
                }
            };
            return [
                {
                    content: 'Tốc độ phát',
                    icon: <FontAwesomeIcon icon={faArrowRotateLeft} />,
                    multiChoice: true,
                    children: [
                        {
                            content: 'Tốc độ phát',
                            type: 'header',
                            format: 'title',
                        },
                        {
                            content: 0.25,
                            choose: videoRef.current?.playbackRate === 0.25,
                            onClick: handleClickRateChange(0.25),
                        },
                        {
                            content: 0.5,
                            choose: videoRef.current?.playbackRate === 0.5,
                            onClick: handleClickRateChange(0.5),
                        },
                        {
                            content: 0.75,
                            choose: videoRef.current?.playbackRate === 0.75,
                            onClick: handleClickRateChange(0.75),
                        },
                        {
                            content: 'Chuẩn',
                            choose: videoRef.current?.playbackRate === 1,
                            onClick: handleClickRateChange(1),
                        },
                        {
                            content: 1.25,
                            choose: videoRef.current?.playbackRate === 1.25,
                            onClick: handleClickRateChange(1.25),
                        },
                        {
                            content: 1.5,
                            choose: videoRef.current?.playbackRate === 1.5,
                            onClick: handleClickRateChange(1.5),
                        },
                        {
                            content: 1.75,
                            choose: videoRef.current?.playbackRate === 1.75,
                            onClick: handleClickRateChange(1.75),
                        },
                        {
                            content: 2,
                            choose: videoRef.current?.playbackRate === 2,
                            onClick: handleClickRateChange(2),
                        },
                    ],
                },
            ];
        })(),
    );
    const prevVolumeVal = useRef(100);
    const showControllerTimeId = useRef();
    const timeLinesRef = useRef();
    const videoContainerRef = useRef();
    const controlsGroupRef = useRef();
    const menuId = useRef();

    // console.log(videoRef.current?.playbackRate)

    const handleError = () => {
        setFallback(customFallback);
    };

    const handleClickPlay = () => {
        if (videoRef.current.paused || videoRef.current.ended) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleHoverVolume = (show) => {
        setShowVolumeBar(show);
    };

    const handleClickVolume = () => {
        if (videoRef.current.volume === 0) {
            videoRef.current.volume = prevVolumeVal.current / 100;
            prevVolumeVal.current = 0;
        } else {
            prevVolumeVal.current = videoRef.current.volume * 100;
            videoRef.current.volume = 0;
        }
        setVolumeValue(videoRef.current.volume * 100);
    };

    const handleChangeVolume = (vol, e) => {
        if (vol) {
            let num = Math.round((videoRef.current.volume + vol / 100) * 100) / 100;
            if (num < 0 || num > 1) return;
            videoRef.current.volume = num;
            setVolumeValue(videoRef.current.volume * 100);
            return;
        }
        prevVolumeVal.current = volumeValue;
        videoRef.current.volume = +e.target.value / 100;
        setVolumeValue(+e.target.value);
    };

    const handleTimeUpdate = (e) => {
        setCurrentTime(e.target.currentTime);
    };

    const handleSeekTime = (time, e) => {
        if (time) return (videoRef.current.currentTime += time);
        let rect = timeLinesRef.current.getBoundingClientRect();
        let chooseTime = (((e.clientX - rect.left) / rect.width) * videoRef.current?.duration).toFixed(2);
        videoRef.current.currentTime = chooseTime;
    };

    const handleSeekingTime = (seeking) => setIsSeeking(seeking);

    const handleChooseTime = (e) => {
        let rect = timeLinesRef.current.getBoundingClientRect();
        setChooseTimeWidth((((e.clientX - rect.left) / rect.width) * 100).toFixed(2));
        // console.log(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    };

    const handleUnChooseTime = () => {
        setChooseTimeWidth(0);
    };

    const handleClickSettings = (val) => {
        setShowSettings(!!val);
    };

    const handleClickFullScreen = () => {
        if (
            document.fullscreenElement ||
            document.msFullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullscreenElement
        ) {
            document.fullscreenElement && document.exitFullscreen();
            document.msFullscreenElement && document.msExitFullscreen();
            document.webkitFullscreenElement && document.webkitExitFullscreen();
            document.mozFullscreenElement && document.mozExitFullscreen();
        } else {
            videoContainerRef.current.requestFullscreen && videoContainerRef.current.requestFullscreen();
            videoContainerRef.current.webkitRequestFullscreen && videoContainerRef.current.webkitRequestFullscreen();
            videoContainerRef.current.msRequestFullscreen && videoContainerRef.current.msRequestFullscreen();
            videoContainerRef.current.mozRequestFullscreen && videoContainerRef.current.mozRequestFullscreen();
        }
    };

    const handleClickPIP = async () => {
        if (videoRef.current !== document.pictureInPictureElement) {
            await videoRef.current.requestPictureInPicture();
        } else {
            await document.exitPictureInPicture();
        }
    };

    const handleShowController = () => {
        if (showControllerTimeId.current) {
            clearTimeout(showControllerTimeId.current);
        }
        setShowController(true);
        showControllerTimeId.current = setTimeout(() => {
            setShowController(false);
        }, 5000);
    };

    const callbackGetMenuId = (id) => (menuId.current = id);

    useEffect(() => {
        const listener = (e) => {
            if (!e.target.closest(`#${menuId.current}`) && !e.target.closest('#controls-btn-settings'))
                handleClickSettings(false);
        };
        document.addEventListener('click', listener);
        return () => document.removeEventListener('click', listener);
    }, []);

    useEffect(() => {
        const listener = (e) => {
            switch (e.code) {
                case 'Space':
                    handleClickPlay();
                    break;
                case 'ArrowUp':
                    handleChangeVolume(5);
                    break;
                case 'ArrowDown':
                    handleChangeVolume(-5);
                    break;
                case 'ArrowLeft':
                    handleSeekTime(-5);
                    break;
                case 'ArrowRight':
                    handleSeekTime(5);
                    break;
                case 'KeyM':
                    handleClickVolume();
                    break;
                case 'KeyF':
                    handleClickFullScreen();
                    break;
                case 'KeyP':
                    handleClickPIP();
                    break;
                default:
                    break;
            }
        };

        if (customControl) document.addEventListener('keyup', listener);
        return () => {
            if (customControl) document.removeEventListener('keyup', listener);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={cx('video-box')} ref={videoContainerRef}>
            <video
                className={cx('wrapper', {
                    seeking: isSeeking,
                    [className]: className,
                })}
                ref={videoRef}
                src={fallback || src}
                crossOrigin="true"
                onClick={handleClickPlay}
                onCanPlay={(e) => callbackResolution(e.target.videoWidth, e.target.videoHeight)}
                onEnded={handleClickPlay}
                onTimeUpdate={handleTimeUpdate}
                onSeeking={() => handleSeekingTime(true)}
                onSeeked={() => handleSeekingTime(false)}
                onWaiting={() => handleSeekingTime(true)}
                onPlaying={() => handleSeekingTime(false)}
                onMouseMove={handleShowController}
                onMouseOut={() => setShowController(false)}
                {...props}
                onError={handleError}
            />
            {isSeeking && (
                <div className={cx('popup-loader')}>
                    <Loader />
                </div>
            )}
            {customControl && (
                <>
                    <div
                        ref={controlsGroupRef}
                        className={cx('controls-group', {
                            show: isPlaying ? showController : true,
                        })}
                        onMouseMove={handleShowController}
                        onMouseOut={() => setShowController(false)}
                    >
                        <div
                            ref={timeLinesRef}
                            className={cx('time-lines')}
                            style={{
                                '--width-choose': `${chooseTimeWidth}%`,
                                '--width-current': `${(currentTime / videoRef.current?.duration) * 100}%`,
                            }}
                            onClick={(e) => handleSeekTime(null, e)}
                            onMouseMove={handleChooseTime}
                            onMouseOut={handleUnChooseTime}
                        />
                        {/* <Text
                            content={'8:20'}
                            className={cx('time-line-info', {
                                show: chooseTimeWidth !== 0,
                            })}
                            style={{
                                left: `${
                                    Math.floor(chooseTimeWidth * videoRef.current?.offsetWidth / 100)
                                }px`,
                            }}
                        /> */}
                        <div className={cx('controls-btn-box')}>
                            <div className={cx('controls-left')}>
                                <Button
                                    name={<FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />}
                                    className={cx('controls-btn', 'controls-play')}
                                    contentCss={cx('controls-btn-content')}
                                    onClick={handleClickPlay}
                                />
                                <Button
                                    name={
                                        <FontAwesomeIcon
                                            icon={
                                                volumeValue === 0
                                                    ? faVolumeXmark
                                                    : volumeValue <= 40
                                                    ? faVolumeLow
                                                    : faVolumeHigh
                                            }
                                        />
                                    }
                                    className={cx('controls-btn', 'controls-volume')}
                                    contentCss={cx('controls-btn-content')}
                                    onClick={handleClickVolume}
                                    onMouseEnter={() => handleHoverVolume(true)}
                                    onMouseLeave={() => handleHoverVolume(false)}
                                />
                                <input
                                    className={cx('controls-volume-bar', {
                                        show: showVolumeBar,
                                    })}
                                    type="range"
                                    max={100}
                                    min={0}
                                    step={1}
                                    value={volumeValue}
                                    onChange={(e) => handleChangeVolume(null, e)}
                                    onMouseEnter={() => handleHoverVolume(true)}
                                />
                                <Text
                                    content={`${formatTime(currentTime)} / ${formatTime(videoRef.current?.duration)}`}
                                    className={cx('controls-time-content')}
                                    onMouseLeave={() => handleHoverVolume(false)}
                                />
                            </div>
                            <div className={cx('controls-right')}>
                                <Button
                                    name={<FontAwesomeIcon icon={faClosedCaptioning} />}
                                    className={cx('controls-btn')}
                                    contentCss={cx('controls-btn-content')}
                                />
                                <Button
                                    id="controls-btn-settings"
                                    name={<FontAwesomeIcon icon={faGear} />}
                                    className={cx('controls-btn')}
                                    contentCss={cx('controls-btn-content')}
                                    onClick={() => handleClickSettings(!showSettings)}
                                />
                                <Button
                                    name={<FontAwesomeIcon icon={faObjectGroup} />}
                                    className={cx('controls-btn')}
                                    contentCss={cx('controls-btn-content')}
                                    onClick={handleClickPIP}
                                />
                                <Button
                                    name={
                                        <FontAwesomeIcon
                                            icon={
                                                document.fullscreenElement ||
                                                document.msFullscreenElement ||
                                                document.webkitFullscreenElement ||
                                                document.mozFullscreenElement
                                                    ? faCompress
                                                    : faExpand
                                            }
                                        />
                                    }
                                    className={cx('controls-btn')}
                                    contentCss={cx('controls-btn-content')}
                                    onClick={handleClickFullScreen}
                                />
                            </div>
                        </div>
                    </div>
                    <MultiLevelMenu
                        data={data.current}
                        right={5}
                        bottom={controlsGroupRef.current?.offsetHeight + 5}
                        show={showSettings}
                        callbackGetId={callbackGetMenuId}
                        corner={10}
                    />
                </>
            )}
        </div>
    );
};

export default Video;
