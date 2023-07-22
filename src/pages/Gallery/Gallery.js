import classNames from 'classnames/bind';
import styles from './Gallery.module.scss';
import Text from '~/components/Text';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faTableCells, faTableList } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { useViewport } from '~/hooks';
import GalleryGrid from './Layouts/Grid';
import GalleryList from './Layouts/List';
import { useParams } from 'react-router-dom';
import PopupImage from './PopupImage';
import { useDispatch, useSelector } from 'react-redux';
import { dataServerGallery, typeShowGallery } from '~/redux/selector';
import { changeTypeGallery, updateDataGallery } from '~/redux/defaultSettingsSlice';
import { getServerData } from '~/services/service';

const cx = classNames.bind(styles);

// const data = [
//     {
//         name: 'image-name',
//         image: images.image_6,
//         size: 89239776,
//         id: 123,
//     },
//     {
//         name: 'image-name',
//         image: images.image_2,
//         size: 800012303,
//     },
//     {
//         name: 'image-name',
//         image: images.image_3,
//         size: 800012303,
//     },
//     {
//         name: 'image-name',
//         image: images.image_4,
//         size: 800012303,
//     },
//     {
//         name: 'image-name',
//         image: images.image_5,
//         size: 800012303,
//     },
//     {
//         name: 'image-name',
//         image: images.image_1,
//         size: 800012303,
//     },
//     {
//         name: 'image-name',
//         image: images.image_2,
//         size: 800012303,
//     },
//     {
//         name: 'image-name',
//         image: images.image_3,
//         size: 800012303,
//     },
//     {
//         name: 'image-name',
//         image: images.image_4,
//         size: 800012303,
//     },
//     {
//         name: 'image-name',
//         image: images.image_5,
//         size: 80001230,
//     },
//     {
//         name: 'image-name',
//         image: images.image_5,
//         size: 80001230,
//     },
//     {
//         name: 'image-name',
//         image: images.image_5,
//         size: 80001230,
//     },
// ];

const Gallery = () => {
   const dataServer = useSelector(dataServerGallery)
   const isList = useSelector(typeShowGallery);
    const [contentHeight, setContentHeight] = useState(0);
    const { id } = useParams();
    const dispatch = useDispatch();
    const viewport = useViewport();
    const wrapperRef = useRef();
    const actionRef = useRef();

    const handleClickChangeShow = () => {
        dispatch(changeTypeGallery(!isList));
    };

    useEffect(() => {
        const getData = async () => {
            const response = await getServerData()
            if (response) return dispatch(updateDataGallery(response))
        }
        getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
                <PopupImage
                    index={id.split('&')[1]}
                    id={id.split('&')[0]}
                />
            )}
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
                    <GalleryList contentHeight={contentHeight} data={dataServer} />
                ) : (
                    <GalleryGrid contentHeight={contentHeight} data={dataServer} />
                )}
            </div>
        </>
    );
};

export default Gallery;
