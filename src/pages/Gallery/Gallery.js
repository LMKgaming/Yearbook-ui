import classNames from 'classnames/bind';
import styles from './Gallery.module.scss';
import Text from '~/components/Text';
import Button from '~/components/Button';
import Loader from '~/components/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faTableCells, faTableList } from '@fortawesome/free-solid-svg-icons';
import GalleryGrid from './Layouts/Grid';
import GalleryList from './Layouts/List';
import PopupImage from './PopupImage';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useViewport } from '~/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { galleryOption } from '~/redux/selector';
import { changeTypeGallery, updateDataGallery } from '~/redux/defaultSettingsSlice';
import { getServerData } from '~/services/service';
const cx = classNames.bind(styles);

const Gallery = () => {
    const { dataServer, list: isList } = useSelector(galleryOption);
    const [isLoading, setIsLoading] = useState(true);
    const [contentHeight, setContentHeight] = useState(0);
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const viewport = useViewport();
    const wrapperRef = useRef();
    const actionRef = useRef();

    const handleClickChangeShow = () => {
        dispatch(changeTypeGallery(!isList));
    };

    useEffect(() => {
        const getData = async () => {
            const response = await getServerData(process.env.REACT_APP_SHEET_IMAGE_ID);
            if (response) {
                setIsLoading(false);
                dispatch(updateDataGallery(response));
            }
        };
        if (dataServer.length !== 0) setIsLoading(false);
        else getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <PopupImage
                    index={
                        +searchParams.get('index') < 1
                            ? 1
                            : +searchParams.get('index') > dataServer.length
                            ? dataServer.length
                            : +searchParams.get('index')
                    }
                    id={searchParams.get('id')}
                    dataServer={dataServer}
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
                {isLoading ? (
                    <div className={cx('loader')}>
                        <Loader />
                    </div>
                ) : isList ? (
                    <GalleryList contentHeight={contentHeight} />
                ) : (
                    <GalleryGrid contentHeight={contentHeight} />
                )}
            </div>
        </>
    );
};

export default Gallery;
