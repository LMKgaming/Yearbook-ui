import classNames from 'classnames/bind';
import styles from './VideoGrid.module.scss';
import Text from '~/components/Text';
import { useNavigate } from 'react-router-dom';
import config from '~/config';
import Video from '~/components/Video';

const cx = classNames.bind(styles);

const VideoItemGrid = ({name, video, id = '', handleContextMenu}) => {
    const navigate = useNavigate()
    const handleClickItem = () => {
        navigate(config.routes.videoItem.replace(':id', id))
    }

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
