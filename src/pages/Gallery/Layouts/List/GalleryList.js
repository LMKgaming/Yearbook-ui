import classNames from 'classnames/bind';
import styles from './GalleryList.module.scss';
import GalleryItemList from './GalleryItemList';
import { memo, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { galleryOption, searchOptions, tagSearch } from '~/redux/selector';
import { updateScrollListPosGallery } from '~/redux/defaultSettingsSlice';
import { useDebounce } from '~/hooks';
import { toastConfig } from '~/components/Toast';

const cx = classNames.bind(styles);

const GalleryList = ({ contentHeight = '100%' }) => {
    const { dataServer: data, scrollListPos, searchValue, searchTag } = useSelector(galleryOption);
    const { dataServer: tagServer } = useSelector(tagSearch);
    const { searchType } = useSelector(searchOptions);
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
        (!!searchValue.length || !!searchTag.length) &&
            contentRef.current.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
    }, [searchValue, searchTag, searchType]);

    useEffect(() => {
        dispatch(updateScrollListPosGallery(debounceScrollTop));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounceScrollTop]);

    useEffect(() => {
        toastConfig.infoToast('Auto Scroll Message', 'Auto scroll will work after 5s', 4000);

        let timoutId = setTimeout(() => {
            contentRef.current.scrollTo({
                top: scrollListPos,
                behavior: 'smooth',
            });
        }, 5000);

        const listener = (e) => {
            console.log(e);
            clearTimeout(timoutId);
        };

        document.addEventListener('toast', listener);

        return () => {
            document.removeEventListener('toast', listener);
            clearTimeout(timoutId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderUI = (dataReceive, showTag = false) => {
        return dataReceive.map((data) => (
            <GalleryItemList
                key={data.Id}
                index={data.Index}
                name={data.Name}
                image={data.URLWebp || data.URL}
                tags={data.Tags}
                tagsData={tagServer}
                sortedTags={searchTag}
                id={data.Id}
                size={data.Size / 1024 ** 2}
                showTag={showTag}
                pressP={pressP}
            />
        ));
    };

    const render = () => {
        if (!searchTag.length && !searchValue.length) return renderUI(data, false);
        let renderData = [];
        if (!!searchTag.length) {
            renderData = data.filter((p) => {
                let tagSplitted = p.Tags.split(',')
                if (searchType === "AND") {
                    //AND
                    for (const tag of searchTag) {
                        let findIndex = tagServer.find((p) => p.Tags.split(',').includes(tag))?.Id;
                        if (tag === 'All' && !findIndex) findIndex = '0';
                        if (!tagSplitted.includes(findIndex)) return false
                    }
                    return true
                } else if (searchType === "OR") {
                    //OR
                    for (const tag of searchTag) {
                        let findIndex = tagServer.find((p) => p.Tags.split(',').includes(tag))?.Id;
                        if (tag === 'All' && !findIndex) findIndex = '0';
                        if (tagSplitted.includes(findIndex)) return true;
                    }
                    return false;
                } else {
                    //NOT
                    for (const tag of searchTag) {
                        let findIndex = tagServer.find((p) => p.Tags.split(',').includes(tag))?.Id;
                        if (tag === 'All' && !findIndex) findIndex = '0';
                        if (findIndex && tagSplitted.includes('0')) return false;
                        if (tagSplitted.includes(findIndex)) return false;
                    }
                    return true;
                }
            });
            // renderData = renderData.concat(data.filter(p => p.Tags.includes('0')))
        }
        if (!!searchValue.length) {
            renderData = !!renderData.length
                ? renderData.filter((p) => p.Name.includes(searchValue))
                : data.filter((p) => p.Name.includes(searchValue));
        }
        return renderUI(renderData, true);
    };

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
