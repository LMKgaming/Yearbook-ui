import classNames from 'classnames/bind';
import styles from './GalleryGrid.module.scss';
import GalleryItemGrid from './GalleryItemGrid';
import { memo, useEffect, useRef, useState } from 'react';
import { useDebounce, useViewport } from '~/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faShare } from '@fortawesome/free-solid-svg-icons';
import ContextMenu from '~/components/ContextMenu/ContextMenu';
import { useDispatch, useSelector } from 'react-redux';
import { galleryOption } from '~/redux/selector';
import { updateScrollGridPosGallery } from '~/redux/defaultSettingsSlice';

const cx = classNames.bind(styles);

const contextMenu = [
    {
        title: 'Download',
        icon: <FontAwesomeIcon icon={faDownload} />,
        onClick: () => {
            alert('Bạn đã click download nhưng đéo cho download OKK');
        },
    },
    {
        title: 'See on drive',
        icon: <FontAwesomeIcon icon={faShare} />,
        split: true,
    },
];

const GalleryGrid = ({ contentHeight = '100%' }) => {
    const { dataServer: data, scrollGridPos } = useSelector(galleryOption);
    const [openContextMenu, setOpenContextMenu] = useState(false);
    const contextRef = useRef();
    const viewport = useViewport();
    const [scrollTop, setScrollTop] = useState(0);
    const debounceScrollTop = useDebounce(scrollTop, 500);
    const contentRef = useRef();
    const dispatch = useDispatch();

    const handleClickOnContextMenu = (item) => {
        if (typeof item.onClick !== 'function') return;
        item.onClick();
    };

    const handleContextMenu = (e) => {
        e.preventDefault();
        let x = e.clientX,
            y = e.clientY,
            contextWidth = contextRef.current.offsetWidth,
            contextHeight = contextRef.current.offsetHeight;

        // let x = e.screenX, y = e.screenY
        x = x > viewport.width * 16 - contextWidth ? x - contextWidth : x;
        y = y > viewport.height * 16 - contextHeight ? y - contextHeight * 2 : y - contextHeight;
        contextRef.current.style.left = `${x}px`;
        contextRef.current.style.top = `${y}px`;
        setOpenContextMenu(true);
    };

    useEffect(() => {
        const listener = () => {
            setOpenContextMenu(false);
        };
        document.addEventListener('click', listener);
        document.addEventListener('scroll', listener);
        return () => {
            document.removeEventListener('click', listener);
            document.removeEventListener('scroll', listener);
        };
    }, []);

    useEffect(() => {
        const elem = contentRef.current;
        let isAwaiting = false;
        let timeoutId = undefined;
        const listener = () => {
            if (isAwaiting) {
                clearTimeout(timeoutId);
            } else {
                isAwaiting = true;
            }
            timeoutId = setTimeout(() => {
                // console.log(elem.scrollTop);
                isAwaiting = false;
                timeoutId = undefined;
                setScrollTop(elem.scrollTop);
            }, 800);
        };

        elem?.addEventListener('scroll', listener);
        return () => {
            elem?.removeEventListener('scroll', listener);
        };
    }, []);

    useEffect(() => {
        dispatch(updateScrollGridPosGallery(debounceScrollTop));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounceScrollTop]);

    useEffect(() => {
        contentRef.current.scrollTo({
            top: scrollGridPos,
            behavior: 'smooth',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        console.log(contentRef)
    }, [])

    return (
        <>
            <ContextMenu
                data={contextMenu}
                ref={contextRef}
                show={openContextMenu}
                onChange={handleClickOnContextMenu}
            />
            <div
                ref={contentRef}
                className={cx('content')}
                style={{
                    height: contentHeight,
                }}
            >
                {data.slice(0, 20).map((data) => (
                    <GalleryItemGrid
                        key={data.Id}
                        index={data.Index}
                        name={data.Name}
                        image={data.URLWebp || data.URL}
                        id={data.Id}
                        handleContextMenu={handleContextMenu}
                    />
                ))}
            </div>
        </>
    );
};

export default memo(GalleryGrid);
