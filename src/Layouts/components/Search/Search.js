import classNames from 'classnames/bind';
import styles from './Search.module.scss';
import Button from '~/components/Button';
import Text from '~/components/Text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faClockRotateLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useDebounce } from '~/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTagGallery, setSearchValueGallery, updateHistory } from '~/redux/defaultSettingsSlice';
import { useLocation } from 'react-router-dom';
import { searchHistory } from '~/redux/selector';

const cx = classNames.bind(styles);

const Input = ({ isDisplaying = true }) => {
    const [showSearchInfo, setShowSearchInfo] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [searchTag, setSearchTag] = useState([]);
    const { searchValue: historyValue, searchTag: historyTag } = useSelector(searchHistory);
    const debounceValue = useDebounce(searchValue, 500);
    const dispatch = useDispatch();
    const location = useLocation();

    const handleInput = (event) => {
        let value = event.target.value;
        setSearchValue(value);
        const listener = (e) => {
            if (value.startsWith('#') && e.key === 'Enter') {
                setSearchTag((prev) => {
                    let arrNotInclude = value
                        .split('#')
                        .filter((item) => item.length !== 0 && !prev.includes(item.trim()));
                    return [...prev, ...arrNotInclude];
                });
                setSearchValue('');
            }
            document.removeEventListener('keydown', listener);
        };
        document.addEventListener('keydown', listener);
    };

    const handleClickClose = (tag) => {
        setSearchTag((prev) => prev.filter((p) => p !== tag));
    };

    const handleClickDelHisVal = (tag) => {
        dispatch(updateHistory({ type: 'valDel', value: tag }));
    };

    const handleClickDelHisTag = (tag) => {
        dispatch(updateHistory({ type: 'tagDel', value: tag }));
    };

    const handleFocus = () => setShowSearchInfo(true);

    useEffect(() => {
        dispatch(setSearchValueGallery(''));
        dispatch(updateHistory({ type: 'tagSave', value: searchTag }));
        dispatch(setSearchTagGallery({ type: 'renewTag' }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    useEffect(() => {
        if (debounceValue.startsWith('#')) return;
        dispatch(setSearchValueGallery(debounceValue.trim()));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounceValue]);

    useEffect(() => {
        dispatch(setSearchTagGallery({ type: 'setTag', value: searchTag }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTag]);

    useEffect(() => {
        const listener = (e) => {
            if (e.target.closest('#search-box')) return;
            setShowSearchInfo(false);
        };

        document.addEventListener('mousedown', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
        };
    }, []);

    return (
        <>
            <input
                className={cx('search-input')}
                placeholder="Input here"
                value={searchValue}
                onChange={handleInput}
                onFocus={handleFocus}
                style={{
                    display: isDisplaying ? 'unset' : 'none'
                }}
            />
            {showSearchInfo && (
                <div className={cx('search-info')}>
                    {!historyValue.length && !searchTag.length && !historyTag.length && (
                        <Text content={'No Search Recent'} className={cx('search-tag-title')} />
                    )}
                    {historyValue.map((val, index) => (
                        <Button
                            key={index}
                            name={val}
                            leftIcon={<FontAwesomeIcon icon={faClockRotateLeft} />}
                            rightIcon={<FontAwesomeIcon icon={faCircleXmark} />}
                            className={cx('search-recent-btn', {
                                last: index === historyValue.length - 1 && (!!searchTag.length || !!historyTag.length),
                            })}
                            leftIconCss={cx('search-recent-icon')}
                            contentCss={cx('search-recent-content')}
                            rightIconCss={cx('search-recent-del')}
                            rightIconOnClickOnly={() => handleClickDelHisVal(val)}
                        />
                    ))}
                    {!!searchTag.length && (
                        <Text
                            content={`${searchTag.length || 'No'} Tag${searchTag.length > 1 ? 's' : ''} Added`}
                            className={cx('search-tag-title')}
                        />
                    )}
                    {searchTag.map((tag, index) => (
                        <Button
                            key={index}
                            name={tag}
                            rightIcon={<FontAwesomeIcon icon={faCircleXmark} />}
                            className={cx('search-tag-btn')}
                            contentCss={cx('search-tag-content')}
                            rightIconCss={cx('search-tag-close')}
                            rightIconOnClickOnly={() => handleClickClose(tag)}
                        />
                    ))}
                    {!!historyTag.length && (
                        <Text
                            content={'Recent Tags'}
                            className={cx('search-tag-title', {
                                recent: !!searchTag.length,
                            })}
                        />
                    )}
                    {historyTag.map((tag, index) => (
                        <Button
                            key={index}
                            name={tag}
                            rightIcon={<FontAwesomeIcon icon={faCircleXmark} />}
                            className={cx('search-tag-btn', 'recent')}
                            contentCss={cx('search-tag-content')}
                            rightIconCss={cx('search-tag-close')}
                            rightIconOnClickOnly={() => handleClickDelHisTag(tag)}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

const Search = ({ model }) => {
    const [searchState, setSearchState] = useState(false);
    const handleClickSearchIcon = () => {
        setSearchState((prev) => !prev);
    };

    if (model === 'mobile' || model === 'mini-tablet') {
        return (
            <div id="search-box" className={cx('search-box')}>
                <Button
                    className={cx('search-icon')}
                    name={<FontAwesomeIcon icon={faSearch} />}
                    onClick={handleClickSearchIcon}
                />
                <Input isDisplaying={searchState}/>
            </div>
        );
    }
    return (
        <div id="search-box" className={cx('search-box')}>
            <Input />
        </div>
    );
};

export default Search;
