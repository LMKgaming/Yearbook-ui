import classNames from 'classnames/bind';
import styles from './VideoList.module.scss';
import VideoItemList from './VideoItemList';
import { useSelector } from 'react-redux';
import { videoOption } from '~/redux/selector';

const cx = classNames.bind(styles);

const VideoList = ({ contentHeight = '100%' }) => {
    const {dataServer: data} = useSelector(videoOption)

    return (
        <div
            className={cx('content')}
            style={{
                height: contentHeight,
            }}
        >
            {data.map((data, index) => (
                <VideoItemList
                    key={data.Id || index}
                    name={data.Name}
                    image={data.Id || data.video}
                    id={data.Id}
                    size={data.Size / 1024 ** 2}
                />
            ))}
        </div>
    );
};

export default VideoList;
