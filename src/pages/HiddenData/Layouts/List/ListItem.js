import classNames from 'classnames/bind';
import styles from './List.module.scss';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

const ListItem = ({
    canSort = false,
    sortList = [],
    handleClickData = () => {},
    handleClickEachData = () => {},
    maxItem = 6,
    orderList = [],
    ...props
}) => {
    const renderOther = () => {
        return orderList.slice(0, maxItem).map((key, index) => (
            <Button
                key={index}
                name={!isNaN(+props[key]) && +props[key] < 2 ? '***' : props[key]}
                className={cx('list-item', {
                    'item-id': key === 'id',
                    'item-name': key === 'name',
                    upper: canSort && sortList.find((p) => p.key === props[key])?.type === 'upper',
                    lower: canSort && sortList.find((p) => p.key === props[key])?.type === 'lower',
                    sort: canSort,
                })}
                contentCss={cx('list-item-content')}
                onClick={() => handleClickEachData(canSort, props[key])}
            />
        ));
    };

    return (
        <div
            className={cx('list-item-wrapper')}
            onClick={() =>
                handleClickData({
                    ...props,
                    canSort,
                })
            }
        >
            {renderOther()}
        </div>
    );
};

export default ListItem;
