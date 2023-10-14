import classNames from 'classnames/bind';
import styles from './HiddenData.module.scss';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Image from '~/components/Image';
import images from '~/assets/images';
import { useEffect, useRef, useState } from 'react';
import { useViewport } from '~/hooks';
import Text from '~/components/Text';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { galleryOption, tagSearch } from '~/redux/selector';
import { getServerData } from '~/services/service';
import { updateDataGallery } from '~/redux/defaultSettingsSlice';
import { createRandomArray } from '~/functions';

const cx = classNames.bind(styles);

const InfoLine = ({ title, content, capitalize = false }) => {
    return (
        <div className={cx('info-line')}>
            <Text content={title} className={cx('text', 'info-title', 'capitalize')} />
            <Text
                content={content || 'Unknown'}
                className={cx('text', 'info-content', {
                    capitalize,
                })}
            />
        </div>
    );
};

// const slideImage = [
//     { image: images.image_6 },
//     { image: images.image_6 },
//     { image: images.image_6 },
//     { image: images.image_6 },
//     { image: images.image_6 },
//     { image: images.image_6 },
// ];

const PopupData = ({ id, scoreData = [], groupData = [] }) => {
    const { dataServer } = useSelector(galleryOption);
    const { dataServer: tagServer } = useSelector(tagSearch);
    const [slideImage, setSlideImage] = useState([]);
    const [userData, setUserData] = useState(() => ({
        ...scoreData.find((p) => p.id === id),
    }));
    console.log(userData);
    const [naturalSize, setNaturalSize] = useState({
        width: 0,
        height: 0,
    });
    const [imageSize, setImageSize] = useState({
        width: 0,
        height: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [currentView, setCurrentView] = useState('information');
    const [currentSlide, setCurrentSlide] = useState(0);
    const { width, height, isHorizontal } = useViewport();
    const [, setSearchParams] = useSearchParams();
    const mainContentRef = useRef();
    const popupActionRef = useRef();
    const dispatch = useDispatch();

    const callbackNaturalSize = (width, height) => {
        setNaturalSize({ width, height });
        setIsLoading(false);
    };

    const handleClickActionClose = () => setSearchParams({});
    const handleClickImageBar = (index) => setCurrentSlide(index);
    const handleClickSubInfo = (type) => setCurrentView(type);

    useEffect(() => {
        const getData = async () => {
            const response = await getServerData(process.env.REACT_APP_SHEET_IMAGE_ID);
            if (response) {
                dispatch(updateDataGallery(response));
            }
        };
        if (dataServer.length !== 0) setIsLoading(false);
        else getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        let findIndex = tagServer.find((p) => p.Tags.split(',').includes(userData.name)).Id;
        let arrImage = createRandomArray(
            dataServer.filter((p) => p.Tags.split(',').length === 1 && p.Tags.split(',').includes(findIndex)),
            5,
        );
        if (!arrImage.length)
            arrImage = createRandomArray(dataServer.filter((p) => p.Tags.split(',').includes(findIndex)), 5);
        let customSlideImage = arrImage.map((p) => ({ image: p.URLWebp }));
        setSlideImage(customSlideImage);
        console.log('customSlideImage', customSlideImage);
    }, []);

    useEffect(() => {
        if (naturalSize.width === 0 || naturalSize.height === 0) return;

        if (isHorizontal) {
            let imageHeight = mainContentRef.current.offsetHeight;
            let imageWidth = (imageHeight * naturalSize.width) / naturalSize.height;
            if (imageWidth > mainContentRef.current.offsetWidth - 25 * 2) {
                imageHeight = imageHeight - 20 * 2;
                imageWidth = (imageHeight * naturalSize.width) / naturalSize.height;
            }
            if (imageWidth > width * 16 - 25 * 2) {
                imageWidth = mainContentRef.current.offsetWidth - 25 * 2;
                imageHeight = (imageWidth * naturalSize.height) / naturalSize.width;
            }
            setImageSize((prev) => ({ ...prev, height: imageHeight, width: imageWidth }));
        } else {
            let imageWidth = mainContentRef.current.offsetWidth - 25 * 2;
            let imageHeight = (imageWidth * naturalSize.height) / naturalSize.width;
            setImageSize((prev) => ({ ...prev, height: imageHeight, width: imageWidth }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [width, naturalSize.width, naturalSize.height]);

    useEffect(() => {
        if (!slideImage.length) return;
        let timeoutId = setInterval(
            () => setCurrentSlide((prev) => (prev + 1 < slideImage.length ? prev + 1 : 0)),
            3000,
        );

        return () => {
            timeoutId && clearInterval(timeoutId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSlide, slideImage.length]);

    return (
        <div className={cx('popup-wrapper')}>
            <div className={cx('popup-action')} ref={popupActionRef}>
                <Button
                    name={<FontAwesomeIcon icon={faXmark} />}
                    className={cx('button', 'popup-action-btn')}
                    onClick={handleClickActionClose}
                />
            </div>
            <div
                className={cx('popup-content')}
                style={{
                    maxHeight: height * 16 - popupActionRef.current?.offsetHeight || '100%',
                }}
            >
                <div className={cx('content-image-wrapper')} ref={mainContentRef}>
                    <div
                        className={cx('content-image-box')}
                        style={{
                            width: imageSize.width,
                            height: imageSize.height,
                        }}
                    >
                        {slideImage.map((p) => (
                            <Image
                                src={p?.image}
                                className={cx('content-image')}
                                callbackNaturalSize={callbackNaturalSize}
                                style={{
                                    transition: `all 1s ease`,
                                    transform: `translate(-${imageSize.width * currentSlide}px)`,
                                }}
                            />
                        ))}
                    </div>
                    <div className={cx('content-image-bar-wrapper')}>
                        {slideImage.map((p, index) => (
                            <span
                                className={cx('content-image-bar', {
                                    current: currentSlide === index,
                                })}
                                style={{
                                    width: (imageSize.width * 2) / 3 / slideImage.length,
                                    maxWidth: 80,
                                }}
                                onClick={() => handleClickImageBar(index, p)}
                            />
                        ))}
                    </div>
                </div>
                <div className={cx('content-data-wrapper')}>
                    <div className={cx('data-sub-info')}>
                        {['information', 'summary', 'contact'].map((data) => (
                            <Button
                                key={data}
                                name={data}
                                className={cx('button', 'data-sub-btn')}
                                contentCss={cx('data-sub-content')}
                                onClick={() => handleClickSubInfo(data)}
                            />
                        ))}
                    </div>
                    <div className={cx('data-main-info')}>
                        {currentView === 'information' ? (
                            <>
                                <InfoLine title={'Name'} content={userData.name} />
                                <InfoLine title={'Date of birth'} content={userData.birth} />
                                <InfoLine title={'University'} content={userData.uni} />
                                {Object.keys(userData)
                                    .filter((p) => p !== 'name' && p !== 'id' && p !== 'birth' && p !== 'uni')
                                    .map((key) => (
                                        <InfoLine
                                            title={key}
                                            content={
                                                !!userData[key] && userData[key] !== '--' ? userData[key] : 'Hidden'
                                            }
                                        />
                                    ))}
                            </>
                        ) : currentView === 'summary' ? (
                            <></>
                        ) : (
                            <>
                                <InfoLine title={'Email'} content={'Email.sth123@gmail.com'} />
                                <InfoLine title={'FB'} content={'https://facebook.com/u/1289239'} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopupData;
