import classNames from 'classnames/bind';
import styles from './Search.module.scss';
import Button from '~/components/Button';
import Text from '~/components/Text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faClockRotateLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from '~/hooks';
import { useDispatch, useSelector } from 'react-redux';
import {
    changeSearchType,
    setSearchTagGallery,
    setSearchValueGallery,
    updateDataTag,
    updateHistory,
} from '~/redux/defaultSettingsSlice';
import { useLocation } from 'react-router-dom';
import { searchHistory, searchOptions, tagSearch } from '~/redux/selector';
import { getServerData } from '~/services/service';
import config from '~/config';

const cx = classNames.bind(styles);

const Input = ({ isDisplaying = true }) => {
    const inputRef = useRef();
    const [showSearchInfo, setShowSearchInfo] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [searchTag, setSearchTag] = useState([]);
    const { searchValue: historyValue, searchTag: historyTag } = useSelector(searchHistory);
    const { dataServer: tagServer } = useSelector(tagSearch);
    const { searchType } = useSelector(searchOptions);
    const debounceValue = useDebounce(searchValue, 750);
    const dispatch = useDispatch();
    const location = useLocation();

    const handleClickInfoTag = () => inputRef.current.focus();

    const handleClickChangeSearchType = () => {
        let currentIndex = config.defaultSettings.searchType.indexOf(searchType);
        let nextSearchType =
            config.defaultSettings.searchType[
                currentIndex < config.defaultSettings.searchType.length - 1 ? currentIndex + 1 : 0
            ];
        dispatch(changeSearchType(nextSearchType));
    };

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

    const handleClickClose = (tag) => setSearchTag((prev) => prev.filter((p) => p !== tag));

    const handleClickHisVal = (val) => setSearchValue(val);

    const handleClickDelHisVal = (val) => dispatch(updateHistory({ type: 'valDel', value: val }));

    const handleClickHisTag = (tag) => !searchTag.includes(tag) && setSearchTag((prev) => [...prev, tag]);

    const handleClickDelHisTag = (tag) => dispatch(updateHistory({ type: 'tagDel', value: tag }));

    const handleFocus = () => setShowSearchInfo(true);

    useEffect(() => {
        if (isDisplaying === false) setShowSearchInfo(false);
    }, [isDisplaying]);

    useEffect(() => {
        const getData = async () => {
            const response = await getServerData(process.env.REACT_APP_SHEET_TAGS_ID);
            if (response) dispatch(updateDataTag(response));
        };

        if (!tagServer.length) getData();
        else return;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const listener = (e) => {
            setSearchTag((prev) =>
                e.detail.insert
                    ? [...prev.filter((p) => !e.detail.value.includes(p)), ...e.detail.value]
                    : e.detail.value,
            );
        };

        location.pathname === config.routes.gallery && document.addEventListener('tag', listener);
        return () => {
            document.removeEventListener('tag', listener);
        };
    }, [location.pathname]);

    useEffect(() => {
        dispatch(updateHistory({ type: 'tagSave', value: searchTag }));
        dispatch(setSearchValueGallery(''));
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
                ref={inputRef}
                className={cx('search-input')}
                placeholder="Input here"
                value={searchValue}
                onChange={handleInput}
                onFocus={handleFocus}
                style={{
                    display: isDisplaying ? 'unset' : 'none',
                }}
            />
            {!!searchTag.length && (
                <Text
                    content={`${searchTag.length} Tag${searchTag.length > 1 ? 's' : ''} Added`}
                    className={cx('search-info-tag')}
                    onClick={handleClickInfoTag}
                    style={{
                        display: isDisplaying ? 'unset' : 'none',
                    }}
                />
            )}
            {showSearchInfo && (
                <div
                    className={cx('search-info')}
                    style={{
                        '--best-color': `${
                            searchType === 'AND' ? '#2f86eb' : searchType === 'OR' ? '#ffc021' : '#ff623d'
                        }`,
                    }}
                >
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
                            onClick={() => handleClickHisVal(val)}
                            rightIconCss={cx('search-recent-del')}
                            rightIconOnClickOnly={(e) => {
                                e.stopPropagation();
                                handleClickDelHisVal(val);
                            }}
                        />
                    ))}
                    {!!searchTag.length && (
                        <div className={cx('search-tag-wrapper')}>
                            <Text
                                content={`${searchTag.length || 'No'} Tag${searchTag.length > 1 ? 's' : ''} Added`}
                                className={cx('search-tag-title')}
                            />
                            <Button
                                name={searchType}
                                className={cx('search-tag-switch')}
                                contentCss={cx('search-tag-switch-content')}
                                onClick={handleClickChangeSearchType}
                            />
                        </div>
                    )}
                    {searchTag.map((tag, index) => (
                        <Button
                            key={index}
                            name={tag}
                            rightIcon={<FontAwesomeIcon icon={faCircleXmark} />}
                            className={cx('search-tag-btn')}
                            contentCss={cx('search-tag-content')}
                            rightIconCss={cx('search-tag-close')}
                            rightIconOnClickOnly={(e) => {
                                e.stopPropagation();
                                handleClickClose(tag);
                            }}
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
                            onClick={() => handleClickHisTag(tag)}
                            rightIconCss={cx('search-tag-close')}
                            rightIconOnClickOnly={(e) => {
                                e.stopPropagation();
                                handleClickDelHisTag(tag);
                            }}
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
                <Input isDisplaying={searchState} />
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
