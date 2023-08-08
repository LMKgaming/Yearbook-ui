import classNames from 'classnames/bind';
import styles from './VideoList.module.scss';
import VideoItemList from './VideoItemList';

const cx = classNames.bind(styles);

const VideoList = ({ data = [], contentHeight = '100%' }) => {
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
                    image={data.URL}
                    id={data.Id}
                    size={data.Size / 1024 ** 2}
                />
            ))}
        </div>
    );
};

export default VideoList;
