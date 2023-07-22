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

const cx = classNames.bind(styles);

const dataServer = [
    {Name: 'video-name', video: videos.video_1, Size: 10909088, Id: 123},
    {Name: 'video-name', video: videos.video_1, Size: 21382332},
    {Name: 'video-name', video: videos.video_1, Size: 109094242},
    {Name: 'video-name', video: videos.video_1, Size: 6729393},
    {Name: 'video-name', video: videos.video_1, Size: 101628793},
]

const Video = () => {
    // const [dataServer, setDataServer] = useState([]);
    const [contentHeight, setContentHeight] = useState(0);
    const { id } = useParams();
    const isList = useSelector(typeShowVideo);
    const dispatch = useDispatch();
    const viewport = useViewport();
    const wrapperRef = useRef();
    const actionRef = useRef();
    
    const handleClickChangeShow = () => {
        dispatch(changeTypeVideo(!isList))
    };

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
            {id && <PopupVideo name={'video-name'} video={videos.video_1}/>}
            <div className={cx('wrapper')} ref={wrapperRef}>
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
            </div>
        </>
    );
};

export default Video;
