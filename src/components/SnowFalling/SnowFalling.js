import { useEffect, useState } from 'react';
import styles from './SnowFalling.module.scss';
import classNames from 'classnames/bind';
import { useSelector } from 'react-redux';
import { snowSelector } from '~/redux/selector';

const cx = classNames.bind(styles);

const SnowFalling = (
    count = 40,
    borderArr = ['5px', '99999px'],
    blurArr = ['5px', '10px', '15px', '2px'],
    colorArr = ['#185bc7', '#26c718', '#c72f18', '#c76c18', '#c7c418', '#18c7b5', '#a418c7', '#c718a7', '#fff', '#ccc'],
    ...props
) => {
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight - 60;
    const snowActive = useSelector(snowSelector);
    const [elementRandom, setElementRandom] = useState([]);

    const createElementRandom = () => {
        const data = [];
        for (let i = 0; i < count.count; i++) {
            let randomLeft = Math.floor(Math.random() * width - 15);
            let randomTop = Math.floor(Math.random() * height - 15);
            if (randomTop + (50 / 100) * height > height) {
                let overVh = Math.ceil((randomTop + (50 / 100) * height - height) / height * 100)
                randomTop = randomTop - height / 100 * Math.floor(Math.random() * overVh + overVh)
            }
            let color = Math.floor(Math.random() * colorArr.length);
            let border = Math.floor(Math.random() * borderArr.length);
            let blur = Math.floor(Math.random() * blurArr.length);
            let widthElement = Math.floor(Math.random() * 5) + 5;
            let timeAnimation = Math.floor(Math.random() * 8) + 5;
            data.push({ randomLeft, randomTop, color, border, blur, widthElement, timeAnimation });
        }
        setElementRandom(data);
    };

    useEffect(() => {
        snowActive && createElementRandom();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snowActive]);

    return (
        <div className={cx('container')}>
            {elementRandom.map((data, index) => (
                <div
                    key={index}
                    style={{
                        position: 'absolute',
                        backgroundColor: colorArr[data.color],
                        width: data.widthElement + 'px',
                        height: data.widthElement + 'px',
                        top: data.randomTop + 'px',
                        left: data.randomLeft + 'px',
                        borderRadius: borderArr[data.border],
                        filter: `blur(${blurArr[data.blur]})`,
                        animation: `move ${data.timeAnimation}s ease-out infinite`,
                        zIndex: -999
                    }}
                ></div>
            ))}
        </div>
    );
};

export default SnowFalling;
