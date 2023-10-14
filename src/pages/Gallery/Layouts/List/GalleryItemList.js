import classNames from 'classnames/bind';
import styles from './GalleryList.module.scss';
import { useEffect, useState } from 'react';
import { useDebounce, useViewport } from '~/hooks';
import Image from '~/components/Image';
import Text from '~/components/Text';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faImage } from '@fortawesome/free-solid-svg-icons';
import { useSearchParams } from 'react-router-dom';
import { downloadImage } from '~/functions';

const cx = classNames.bind(styles);

const GalleryItemList = ({
    index,
    image,
    name,
    id = '',
    tags = '',
    tagsData = [],
    sortedTags = [],
    showTag = false,
    size,
    pressP = false,
}) => {
    const [, setSearchParams] = useSearchParams();
    const { width, height, isHorizontal } = useViewport();
    const [naturalSize, setNaturalSize] = useState({
        width: 0,
        height: 0,
    });
    const [imageSizeCurrent, setImageSizeCurrent] = useState({
        width: 0,
        height: 0,
    });
    const [hovered, setHovered] = useState(false);
    const [sortedTagsIndex, setSortedTagsIndex] = useState([]);
    const debouncedHovered = useDebounce(hovered, 500);

    const handleMouseEnter = () => setHovered(true);
    const handleMouseLeave = () => setHovered(false);
    const handleClickItem = () => setSearchParams({ id, index });
    const handleClickTagItem = (tag, isSorted) => {
        const tagEvent = new CustomEvent('tag', {
            detail: {
                value: isSorted ? [] : [tag || 'All'],
                insert: !isSorted && Math.floor(Math.random() * 100) < 50
            },
        });
        document.dispatchEvent(tagEvent);
    };

    useEffect(() => {
        let result = sortedTags.map((tag) => {
            if (tag === 'All') return '0';
            return tagsData.find((p) => p.Tags.split(',').includes(tag)).Id;
        });
        setSortedTagsIndex(result);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortedTags]);

    const callbackNaturalSize = (width, height) => setNaturalSize((prev) => ({ ...prev, width, height }));

    useEffect(() => {
        if (naturalSize.width === 0 || naturalSize.height === 0) return;
        if (isHorizontal) {
            let imageHeight = (height * 16 * 60) / 100;
            let imageWidth = (imageHeight * naturalSize.width) / naturalSize.height;
            setImageSizeCurrent((prev) => ({ ...prev, width: imageWidth, height: imageHeight }));
        } else {
            let imageWidth = (width * 16 * 60) / 100;
            let imageHeight = (imageWidth * naturalSize.height) / naturalSize.width;
            setImageSizeCurrent((prev) => ({ ...prev, width: imageWidth, height: imageHeight }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [width, height, naturalSize.width, naturalSize.height]);

    const renderTagItem = () => {
        let tagArr = tags.split(',');
        let customTagArr = [
            ...tagArr.filter((p) => sortedTagsIndex.includes(p)),
            ...tagArr.filter((p) => !sortedTagsIndex.includes(p)),
        ].slice(0, 5);
        return customTagArr.map((p, index) => {
            let name = tagsData.find((q) => q.Id === p)?.Name;
            let isIncluded = sortedTagsIndex.includes(p);
            return (
                <Text
                    key={index}
                    content={name || (+p < 0 ? 'No one' : 'All')}
                    className={cx('content-item-tag', {
                        last: index === customTagArr.length - 1,
                        sorted: isIncluded,
                    })}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClickTagItem(name, isIncluded);
                    }}
                />
            );
        });
    };

    return (
        <>
            {pressP && debouncedHovered && (
                <div className={cx('content-item-image-box')}>
                    <Image
                        src={image}
                        width={imageSizeCurrent.width}
                        height={imageSizeCurrent.height}
                        callbackNaturalSize={callbackNaturalSize}
                    />
                </div>
            )}
            <div
                className={cx('content-item-wrapper', 'split')}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClickItem}
            >
                <FontAwesomeIcon className={cx('content-item-icon')} icon={faImage} />
                <Text className={cx('content-item-content')} content={name} />
                {showTag && <div className={cx('content-item-tags')}>{renderTagItem()}</div>}
                <Text className={cx('content-item-size')} content={`${(Math.round(size * 100) / 100).toFixed(2)} MB`} />
                <div className={cx('content-item-action')}>
                    <Button
                        className={cx('content-action-item')}
                        name={<FontAwesomeIcon icon={faDownload} />}
                        onClick={(e) => {
                            e.stopPropagation();
                            downloadImage({ dataCurrent: { Id: id, Name: name }, usingSubtitle: true });
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default GalleryItemList;
