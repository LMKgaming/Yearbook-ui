import classNames from 'classnames/bind';
import styles from './VideoGrid.module.scss';
import VideoItemGrid from './VideoItemGrid';
import { useEffect, useRef, useState } from 'react';
import { useViewport } from '~/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faShare } from '@fortawesome/free-solid-svg-icons';
import ContextMenu from '~/components/ContextMenu/ContextMenu';
import { useSelector } from 'react-redux';
import { videoOption } from '~/redux/selector';

const cx = classNames.bind(styles);

const contextMenu = [
    {
        title: 'Download',
        icon: <FontAwesomeIcon icon={faDownload} />,
        onClick: () => {
            alert('Bạn đã click download nhưng đéo cho download OKK');
        },
    },
    {
        title: 'See on drive',
        icon: <FontAwesomeIcon icon={faShare} />,
        split: true,
    },
];

const VideoGrid = ({ contentHeight = '100%' }) => {
    const [openContextMenu, setOpenContextMenu] = useState(false);
    const contextRef = useRef();
    const viewport = useViewport();
    const {dataServer: data} = useSelector(videoOption)

    const handleClickOnContextMenu = (item) => {
        if (typeof item.onClick !== 'function') return;
        item.onClick();
    };

    const handleContextMenu = (e) => {
        e.preventDefault();
        let x = e.clientX,
            y = e.clientY,
            contextWidth = contextRef.current.offsetWidth,
            contextHeight = contextRef.current.offsetHeight;

        // let x = e.screenX, y = e.screenY
        x = x > viewport.width * 16 - contextWidth ? x - contextWidth : x;
        y = y > viewport.height * 16 - contextHeight ? y - contextHeight * 2 : y - contextHeight;
        contextRef.current.style.left = `${x}px`;
        contextRef.current.style.top = `${y}px`;
        setOpenContextMenu(true);
    };

    useEffect(() => {
        const listener = () => {
            setOpenContextMenu(false);
        };
        document.addEventListener('click', listener);
        document.addEventListener('scroll', listener);
        return () => {
            document.removeEventListener('click', listener);
            document.removeEventListener('scroll', listener);
        };
    }, []);

    return (
        <>
            <ContextMenu
                data={contextMenu}
                ref={contextRef}
                show={openContextMenu}
                onChange={handleClickOnContextMenu}
            />
            <div
                className={cx('content')}
                style={{
                    height: contentHeight,
                }}
            >
                {data.map((data, index) => (
                    <VideoItemGrid
                        key={data.Id || index}
                        name={data.Name}
                        video={data.Id || data.video}
                        id={data.Id}
                        handleContextMenu={handleContextMenu}
                    />
                ))}
            </div>
        </>
    );
};

export default VideoGrid;
