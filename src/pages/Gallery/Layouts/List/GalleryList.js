import classNames from 'classnames/bind';
import styles from './GalleryList.module.scss';
import GalleryItemList from './GalleryItemList';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

const GalleryList = ({ data = [], contentHeight = '100%' }) => {
    const [pressP, setPressP] = useState(false);

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

    return (
        <div
            className={cx('content')}
            style={{
                height: contentHeight,
            }}
        >
            {data.map((data) => (
                <GalleryItemList
                    key={data.Id}
                    index={data.Index}
                    name={data.Name}
                    image={data.URLWebp || data.URL}
                    id={data.Id}
                    size={data.Size / 1024 ** 2}
                    pressP={pressP}
                />
            ))}
        </div>
    );
};

export default GalleryList;
