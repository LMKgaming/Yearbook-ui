import classNames from 'classnames/bind';
import styles from './List.module.scss';
import ListItem from './ListItem';
import { useSearchParams } from 'react-router-dom';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { compareNames } from '~/functions';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

const processIdAndName = (key, arr, length, maxItem) => {
    if (key === 'id') {
        if (length < maxItem) return [key, ...arr];
        return arr[0] === 'name' ? [key, arr[0], ...arr.slice(2)] : [key, ...arr.slice(1)];
    } else {
        if (length < maxItem) return arr[0] === 'id' ? [arr[0], key, ...arr.slice(1)] : [key, ...arr];
        return arr[0] === 'id' ? [arr[0], key, ...arr.slice(2)] : [key, ...arr.slice(1)];
    }
};

const List = ({ contentHeight, prevData = [], customType = false, maxItem = 14 }, ref) => {
    const [showCustomGroup, setShowCustomGroup] = useState(false);
    const [sortList, setSortList] = useState([]);
    const [dataSorted, setDataSorted] = useState(prevData);
    const [sortValue] = useState(() => {
        let obj = {};
        for (const val of prevData) {
            for (const key in val) {
                if (Object.hasOwnProperty.call(val, key)) {
                    obj[key] = key;
                }
            }
        }
        return obj;
    });
    const [showSortValueList, setShowSortValueList] = useState(Object.keys(sortValue).slice(0, maxItem));

    const [, setSearchParams] = useSearchParams();

    const handleClickData = (data) => {
        if (data.canSort) return;
        setSearchParams({
            id: data.id,
        });
    };

    const handleClickAction = (canSort, current) => {
        if (!canSort) return;
        setSortList((prev) => {
            let found = prev.find((p) => p.key === current);
            let prevFilter = prev.filter((p) => p !== found);
            if (found) {
                found.type = found.type === 'upper' ? 'lower' : 'upper';
                return [...prevFilter, found];
            } else {
                return [...prev, { key: current, type: 'upper' }];
            }
        });
    };

    const handleClickCustomShow = (key) => {
        setShowSortValueList((prev) => {
            if (prev.includes(key)) return prev.filter((p) => p !== key);
            else if (key === 'id' || key === 'name') return processIdAndName(key, prev, prev.length, maxItem);
            else if (prev.length < maxItem) return [...prev, key];
            return prev.includes('id') && prev.includes('name')
                ? [prev[0], prev[1], ...prev.slice(3), key]
                : prev.includes('id') || prev.includes('name')
                ? [prev[0], ...prev.slice(2), key]
                : [...prev.slice(1), key];
        });
    };

    useEffect(() => {
        console.log(showSortValueList);
    }, [showSortValueList]);

    useImperativeHandle(ref, () => ({
        getSortLength: () => sortList.length,
        deleteSort() {
            setSortList([]);
        },
        showCustomGroup() {
            setShowCustomGroup(prev => !prev)
        }
    }));

    useEffect(() => {
        // let newData = []
        for (const item of dataSorted) {
            for (const [, value] of Object.entries(sortValue)) {
                if (item[value] === undefined) item[value] = '--';
            }
        }
        setDataSorted([...dataSorted]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!sortList.length) {
            setDataSorted(prevData);
            return;
        }
        setDataSorted((prev) => [
            ...prev.sort((a, b) => {
                let i = sortList.length - 1;
                if (!a[sortList[i].key]) return 1;
                if (!b[sortList[i].key]) return -1;
                while (i >= 0) {
                    let val;
                    if (sortList[i].key === 'name') val = compareNames(a.name, b.name);
                    else val = a[sortList[i].key]?.localeCompare(b[sortList[i].key]);
                    if (sortList[i].type === 'upper') {
                        if (val === 0) {
                            i++;
                        }
                        return +val;
                    } else {
                        if (val === 0) {
                            i++;
                        }
                        return -val;
                    }
                }
                return 0;
            }),
        ]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortList]);

    return (
        <>
            <div id="action-group" className={cx('action-group')}>
                {customType && (
                    <div className={cx('action-custom-group')} style={{
                        height: !showCustomGroup && 0,
                    }}>
                        {Object.keys(sortValue).map((key) => (
                            <Button
                                key={key}
                                name={key}
                                rightIcon={
                                    showSortValueList.includes(key) ? (
                                        <FontAwesomeIcon icon={faMinusCircle} />
                                    ) : (
                                        <FontAwesomeIcon icon={faPlusCircle} />
                                    )
                                }
                                className={cx('action-custom-btn', {
                                    show: showSortValueList.includes(key),
                                })}
                                onClick={() => handleClickCustomShow(key)}
                                rightIconOnClickOnly={() => handleClickCustomShow(key)}
                            />
                        ))}
                    </div>
                )}
                <ListItem
                    canSort
                    sortList={sortList}
                    {...sortValue}
                    handleClickEachData={handleClickAction}
                    maxItem={maxItem}
                    orderList={showSortValueList}
                />
            </div>
            <div className={cx('content')} style={{ height: contentHeight }}>
                {dataSorted.map((value) => (
                    <ListItem
                        key={value.id}
                        {...value}
                        handleClickData={handleClickData}
                        maxItem={maxItem}
                        orderList={showSortValueList}
                    />
                ))}
            </div>
        </>
    );
};

export default forwardRef(List);
