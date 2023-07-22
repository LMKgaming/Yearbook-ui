import classNames from 'classnames/bind';
import styles from './VideoList.module.scss';
import Text from '~/components/Text';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFilm } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import config from '~/config';

const cx = classNames.bind(styles);

const VideoItemList = ({ image, name, id = '', size }) => {
    const navigate = useNavigate();
    const handleClickItem = () => {
        navigate(config.routes.videoItem.replace(':id', id));
    };

    return (
        <>
            <div className={cx('content-item-wrapper', 'split')} onClick={handleClickItem}>
                <FontAwesomeIcon className={cx('content-item-icon')} icon={faFilm} />
                <Text className={cx('content-item-content')} content={name} />
                <Text className={cx('content-item-size')} content={`${Math.round(size * 100) / 100} MB`} />
                <div className={cx('content-item-action')}>
                    <Button className={cx('content-action-item')} name={<FontAwesomeIcon icon={faDownload} />} />
                </div>
            </div>
        </>
    );
};

export default VideoItemList;
