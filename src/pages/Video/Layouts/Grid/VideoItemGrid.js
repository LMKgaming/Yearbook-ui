import classNames from 'classnames/bind';
import styles from './VideoGrid.module.scss';
import Text from '~/components/Text';
import { useSearchParams } from 'react-router-dom';
import Video from '~/components/Video';

const cx = classNames.bind(styles);

const VideoItemGrid = ({name, video, id = '', handleContextMenu}) => {
    const [, setSearchParams] = useSearchParams()
    const handleClickItem = () => setSearchParams({id})

    return (
        <div className={cx('content-video-wrapper')} onContextMenu={handleContextMenu} onClick={handleClickItem}>
            <div className={cx('content-video-box')}>
                <Video src={video} className={cx('content-video')}/>
            </div>
            <Text className={cx('content-video-info')} content={name} />
        </div>
    );
};

export default VideoItemGrid;
