import classNames from 'classnames/bind';
import styles from './HiddenData.module.scss';
import data from '~/data';
import Text from '~/components/Text';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartColumn, faList, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { useViewport } from '~/hooks';
import { useSearchParams } from 'react-router-dom';
import List from './Layouts/List';
import PopupData from './PopupData';

const cx = classNames.bind(styles);

const actionBtnData = [
    {
        value: 'list',
        icon: faList,
        view: 'List view',
    },
    {
        value: 'group',
        icon: faList,
        view: 'Group view',
    },
    {
        value: 'chart',
        icon: faChartColumn,
        view: 'Chart view',
    },
];

const HiddenData = () => {
    const [contentHeight, setContentHeight] = useState(0);
    const [showCustomGroupAction, setShowCustomGroupAction] = useState(false);
    const [viewType, setViewType] = useState(actionBtnData[0].value);
    const [showDeleteBtn, setShowDeleteBtn] = useState();
    const [groupData, setGroupData] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const ListRef = useRef();
    const wrapperRef = useRef();
    const timeoutIdRef = useRef();
    const titleIdRef = useRef();
    const { width, height } = useViewport();

    // console.log(searchParams.get('id'));

    const handleClickViewType = (type) => setViewType(type);

    const handleClickDelete = () => ListRef.current?.deleteSort();

    const handleHoverViewType = (type) => {
        timeoutIdRef.current = setTimeout(() => {
            setShowDeleteBtn(type);
        }, 1000);
    };

    const handleLeaveViewType = () => {
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
            timeoutIdRef.current = undefined;
        }
        setShowDeleteBtn(undefined);
    };

    const handleHoverTitle = () => {
        if (viewType !== 'group') return;
        titleIdRef.current = setTimeout(() => {
            setShowCustomGroupAction(true);
        }, 500);
    };

    const handleLeaveTitle = () => {
        if (viewType !== 'group') return;
        if (titleIdRef.current) {
            clearTimeout(titleIdRef.current);
            titleIdRef.current = undefined;
        }
        setShowCustomGroupAction(false);
    };

    const handleClickTitle = () => showCustomGroupAction && ListRef.current.showCustomGroup();

    useEffect(() => {
        let newData = [];
        for (const { id, name, ...person } of data.resultUni) {
            let obj = { id, name };
            for (const item of data.groupUni) {
                obj[item.group] =
                    person[item.content[0]] === '--'
                        ? '--'
                        : person[item.content[1]] === '--'
                        ? '--'
                        : person[item.content[2]] === '--'
                        ? '--'
                        : (+person[item.content[0]] + +person[item.content[1]] + +person[item.content[2]]).toFixed(2);
            }
            newData.push(obj);
        }
        setGroupData(newData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        let fitHeight =
            wrapperRef.current.offsetHeight -
            document.querySelector('#title').offsetHeight -
            document.querySelector('#view-type').offsetHeight -
            document.querySelector('#action-group').offsetHeight;
        setContentHeight(fitHeight);
    }, [width, height, showCustomGroupAction]);

    return (
        <>
            {searchParams.get('id') && (
                <PopupData id={searchParams.get('id')} scoreData={[...data.resultUni]} groupData={groupData} />
            )}
            <div ref={wrapperRef} className={cx('wrapper')}>
                <Text
                    id={'title'}
                    content={'Tổng hợp kết quả thi THPTQG'}
                    className={cx('heading-title', {
                        rainbow: showCustomGroupAction,
                    })}
                    onMouseEnter={handleHoverTitle}
                    onMouseLeave={handleLeaveTitle}
                    onClick={handleClickTitle}
                />
                <div id="view-type" className={cx('view-type')}>
                    {actionBtnData.map((btn) => (
                        <Button
                            name={
                                !!ListRef.current?.getSortLength() && viewType === btn.value && showDeleteBtn === btn.value
                                    ? 'Delete sorts'
                                    : btn.view
                            }
                            rightIcon={
                                <FontAwesomeIcon
                                    icon={
                                        !!ListRef.current?.getSortLength() &&
                                        viewType === btn.value &&
                                        showDeleteBtn === btn.value
                                            ? faTrash
                                            : btn.icon
                                    }
                                />
                            }
                            className={cx('view-type-btn', {
                                active: viewType === btn.value,
                            })}
                            contentCss={cx('view-type-content')}
                            rightIconCss={cx('view-type-icon')}
                            onClick={() =>
                                !!ListRef.current?.getSortLength() && viewType === btn.value && showDeleteBtn === btn.value
                                    ? handleClickDelete()
                                    : handleClickViewType(btn.value)
                            }
                            onMouseEnter={() => handleHoverViewType(btn.value)}
                            onMouseLeave={handleLeaveViewType}
                        />
                    ))}
                </div>
                {viewType === 'list' && (
                    <List ref={ListRef} contentHeight={contentHeight} prevData={[...data.resultUni]} />
                )}
                {viewType === 'group' && (
                    <List ref={ListRef} contentHeight={contentHeight} prevData={groupData} customType />
                )}
            </div>
        </>
    );
};

export default HiddenData;
