import classNames from 'classnames/bind';
import styles from './GalleryGrid.module.scss';
import Image from '~/components/Image';
import Text from '~/components/Text';
import { useNavigate } from 'react-router-dom';
import config from '~/config';

const cx = classNames.bind(styles);

const GalleryItemGrid = ({index, name, image, id = '', handleContextMenu}) => {
    const navigate = useNavigate()
    const handleClickItem = () => {
        navigate(config.routes.galleryItem.replace(':id', `${id}&${index}`))
    }

    return (
        <div className={cx('content-image-wrapper')} onContextMenu={handleContextMenu} onClick={handleClickItem}>
            <div className={cx('content-image-box')}>
                <Image src={image} className={cx('content-image')} loading={'lazy'}/>
            </div>
            <Text className={cx('content-image-info')} content={name} />
        </div>
    );
};

export default GalleryItemGrid;
