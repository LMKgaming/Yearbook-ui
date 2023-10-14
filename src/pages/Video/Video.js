import classNames from 'classnames/bind';
import styles from './Video.module.scss';
import Text from '~/components/Text';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faTableCells, faTableList } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { useViewport } from '~/hooks';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { videoOption } from '~/redux/selector';
import PopupVideo from './PopupVideo';
import VideoList from './Layouts/List';
import VideoGrid from './Layouts/Grid';
import { changeTypeVideo, updateDataVideo } from '~/redux/defaultSettingsSlice';
import { motion } from 'framer-motion';
import { toastConfig } from '~/components/Toast';
import { getServerData } from '~/services/service';
import Loader from '~/components/Loader/Loader';

const cx = classNames.bind(styles);

// const dataServer = [
//     { Name: 'video-name', video: videos.video_1, Size: 10909088, Id: 123 },
//     { Name: 'video-name', video: videos.video_1, Size: 21382332 },
//     { Name: 'video-name', video: videos.video_1, Size: 109094242 },
//     { Name: 'video-name', video: videos.video_1, Size: 6729393 },
//     { Name: 'video-name', video: videos.video_1, Size: 101628793 },
// ];

const Video = () => {
    const [contentHeight, setContentHeight] = useState(0);
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const { dataServer, list: isList } = useSelector(videoOption);
    const dispatch = useDispatch();
    const viewport = useViewport();
    const wrapperRef = useRef();
    const actionRef = useRef();

    const handleClickChangeShow = () => {
        dispatch(changeTypeVideo(!isList));
    };

    useEffect(() => {
        const getData = async () => {
            const response = await getServerData(process.env.REACT_APP_SHEET_VIDEO_ID);
            if (response) {
                setIsLoading(false);
                dispatch(updateDataVideo(response));
            }
        };
        if (dataServer.length !== 0) setIsLoading(false);
        else getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // toastConfig.percentToast('Test', 'test', 50, true)
    }, []);

    useEffect(() => {
        // console.log(wrapperRef);
        let fitHeight =
            wrapperRef.current.offsetHeight -
            wrapperRef.current.firstChild.offsetHeight -
            actionRef.current.offsetHeight;
        // console.log(fitHeight);
        setContentHeight(fitHeight);
    }, [viewport.width, viewport.height]);

    return (
        <>
            {(searchParams.get('id') || searchParams.get('index')) && (
                <PopupVideo
                    name={'video-name'}
                    video={'https://drive.google.com/file/d/1cjfiH1pkUj6sPrn8HPm7D72idaCpKlnq/view?usp=drive_link'}
                />
            )}
            <motion.div
                className={cx('wrapper')}
                ref={wrapperRef}
                initial={{ opacity: 0.5, x: '100vw' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0.5, x: '100vw' }}
                transition={{ duration: 0.25 }}
            >
                <Text className={cx('content-title')} content={'For 12A7-Er'} />
                <div ref={actionRef} className={cx('action-group')}>
                    <div className={cx('sort-action')}>
                        <Button
                            name={'Name'}
                            rightIcon={<FontAwesomeIcon icon={faAngleUp} />}
                            contentCss={cx('action-btn-content')}
                            rightIconCss={cx('action-r-icon')}
                        />
                    </div>
                    <div className={cx('layout-action')}>
                        <Button
                            name={<FontAwesomeIcon icon={isList ? faTableList : faTableCells} />}
                            contentCss={cx('action-btn-content')}
                            onClick={handleClickChangeShow}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className={cx('loader')}>
                        <Loader />
                    </div>
                ) : isList ? (
                    <VideoList contentHeight={contentHeight} />
                ) : (
                    <VideoGrid contentHeight={contentHeight} />
                )}
            </motion.div>
        </>
    );
};

export default Video;
