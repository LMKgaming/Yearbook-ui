import classNames from 'classnames/bind';
import styles from './SnowButton.module.scss';
import { useState } from 'react';
import Text from '~/components/Text';
import Button from '~/components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSnowflake } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { snowSelector } from '~/redux/selector';
import { snowUpdate } from '~/redux/defaultSettingsSlice';

const cx = classNames.bind(styles);

const SnowButton = () => {
    const [countSnow, setCountSnow] = useState(200);

    const dispatch = useDispatch();
    const snowActive = useSelector(snowSelector);

    const handleClickSnowBtn = () => {
        dispatch(snowUpdate(!snowActive));
    };

    return (
        <div className={cx('group-snow')}>
            <Button
                name={<FontAwesomeIcon icon={faSnowflake} />}
                className={cx('snow-btn', {
                    active: snowActive,
                })}
                contentCss={cx('snow-icon')}
                onClick={handleClickSnowBtn}
            />
            {snowActive && (
                <div
                    style={{
                        display: 'none',
                    }}
                >
                    <Text content={countSnow === 200 ? 'Low' : countSnow === 500 ? 'Medium' : 'Extreme'} />
                    <input
                        type="range"
                        defaultValue={countSnow}
                        min={200}
                        max={800}
                        step={300}
                        className={cx('snow-limit')}
                        onChange={(e) => setCountSnow(+e.target.value)}
                    />
                </div>
            )}
        </div>
    );
};

export default SnowButton;
