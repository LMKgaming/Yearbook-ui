import classNames from 'classnames/bind';
import styles from './Video.module.scss';
import Text from '~/components/Text';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faTableCells, faTableList } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { useViewport } from '~/hooks';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { typeShowVideo } from '~/redux/selector';
import videos from '~/assets/videos';
import PopupVideo from './PopupVideo';
import VideoList from './Layouts/List';
import VideoGrid from './Layouts/Grid';
import { changeTypeVideo } from '~/redux/defaultSettingsSlice';
import { motion } from 'framer-motion';
import { toastConfig } from '~/components/Toast';

const cx = classNames.bind(styles);

const dataServer = [
    { Name: 'video-name', video: videos.video_1, Size: 10909088, Id: 123 },
    { Name: 'video-name', video: videos.video_1, Size: 21382332 },
    { Name: 'video-name', video: videos.video_1, Size: 109094242 },
    { Name: 'video-name', video: videos.video_1, Size: 6729393 },
    { Name: 'video-name', video: videos.video_1, Size: 101628793 },
];

const Video = () => {
    const [contentHeight, setContentHeight] = useState(0);
    const { id } = useParams();
    const isList = useSelector(typeShowVideo);
    const dispatch = useDispatch();
    const viewport = useViewport();
    const wrapperRef = useRef();
    const actionRef = useRef();

    const handleClickChangeShow = () => {
        dispatch(changeTypeVideo(!isList));
    };

    useEffect(() => {
        // toastConfig.successToast('Test','test', 5000)
        // let percent = 0
        // let id = toastConfig.percentToast('Downloading...', 'Waiting for export data from server...', percent, true);
        // let intervalId = setInterval(() => {
        //     if (percent > 100) {
        //         clearInterval(intervalId)
        //         percent = 0
        //     } else {
        //         // console.log(percent)
        //         toastConfig.setPercentToast(id, percent)
        //         percent++
        //     }
        // }, 50);
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
            {id && (
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
                {isList ? (
                    <VideoList contentHeight={contentHeight} data={dataServer} />
                ) : (
                    <VideoGrid contentHeight={contentHeight} data={dataServer} />
                )}
            </motion.div>
        </>
    );
};

export default Video;
