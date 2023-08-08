import classNames from 'classnames/bind';
import styles from './GalleryList.module.scss';
import GalleryItemList from './GalleryItemList';
import { memo, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { galleryOption } from '~/redux/selector';
import { updateScrollListPosGallery } from '~/redux/defaultSettingsSlice';
import { useDebounce } from '~/hooks';

const cx = classNames.bind(styles);

const GalleryList = ({ contentHeight = '100%' }) => {
    const { dataServer: data, scrollListPos, searchValue } = useSelector(galleryOption);
    const [pressP, setPressP] = useState(false);
    const [scrollTop, setScrollTop] = useState(0);
    const debounceScrollTop = useDebounce(scrollTop, 500);
    const contentRef = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        const keydownListener = (e) => {
            if (e.key === 'p') {
                setPressP(true);
            }
        };

        const keyupListener = (e) => {
            if (e.key === 'p') {
                setPressP(false);
            }
        };

        document.addEventListener('keydown', keydownListener);
        document.addEventListener('keyup', keyupListener);

        return () => {
            document.removeEventListener('keydown', keydownListener);
            document.removeEventListener('keyup', keyupListener);
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
        dispatch(updateScrollListPosGallery(debounceScrollTop));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounceScrollTop]);

    useEffect(() => {
        contentRef.current.scrollTo({
            top: scrollListPos,
            behavior: 'smooth',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const render = () => {
        if (searchValue.length !== 0) {
            const newData = data.filter(p => p.Name.includes(searchValue))
            return newData.map((data) => (
                <GalleryItemList
                    key={data.Id}
                    index={data.Index}
                    name={data.Name}
                    image={data.URLWebp || data.URL}
                    id={data.Id}
                    size={data.Size / 1024 ** 2}
                    pressP={pressP}
                />
            ))
        }
        return data.map((data) => (
            <GalleryItemList
                key={data.Id}
                index={data.Index}
                name={data.Name}
                image={data.URLWebp || data.URL}
                id={data.Id}
                size={data.Size / 1024 ** 2}
                pressP={pressP}
            />
        ))
    }

    return (
        <div
            ref={contentRef}
            className={cx('content')}
            style={{
                height: contentHeight,
            }}
        >
            {render()}
        </div>
    );
};

export default memo(GalleryList);
