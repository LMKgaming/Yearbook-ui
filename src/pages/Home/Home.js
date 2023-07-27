import Text from '~/components/Text';
import styles from './Home.module.scss';
import classNames from 'classnames/bind';
import Image from '~/components/Image';
import images from '~/assets/images';
import config from '~/config';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useViewport } from '~/hooks';
import { motion } from 'framer-motion';

const cx = classNames.bind(styles);

const slideImageData = [
    {
        id: 1,
        src: images.image_1,
    },
    {
        id: 2,
        src: images.image_2,
    },
    {
        id: 3,
        src: images.image_3,
    },
    {
        id: 4,
        src: images.image_4,
    },
    {
        id: 5,
        src: images.image_5,
    },
];

const Home = () => {
    const viewport = useViewport();
    const navigate = useNavigate();
    const autoSlide = useRef();
    const [imageSize, setImageSize] = useState(0);

    useEffect(() => {
        const listener = (e) => {
            if (e.key === 'Enter') navigate(config.routes.gallery);
        };

        window.addEventListener('keyup', listener);
        return () => {
            window.removeEventListener('keyup', listener);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    console.log(imageSize);

    useEffect(() => {
        setImageSize(autoSlide.current.scrollWidth / autoSlide.current.childNodes.length);
    }, [viewport.width]);

    useEffect(() => {
        let element = autoSlide.current;

        const listener = () => {
            setImageSize(autoSlide.current.scrollWidth / autoSlide.current.childNodes.length);
        };
        element.childNodes[element.childNodes.length - 1].addEventListener('load', listener);
        element.addEventListener('load', listener);

        // Remove the event listener when component unmounts
        return () => {
            element.childNodes[element.childNodes.length - 1].removeEventListener('load', listener);
            element.removeEventListener('load', listener);
        };
    }, []);

    useEffect(() => {
        let position = 0;
        let toRight = true;
        const slideInterval = setInterval(() => {
            // alert(position)
            autoSlide.current.style.transform = `translate(-${position}px, 0)`;
            if (toRight) {
                position += imageSize;
                if (position >= imageSize * (slideImageData.length - 1)) {
                    position = imageSize * (slideImageData.length - 1);
                    toRight = !toRight;
                }
            } else {
                position -= imageSize;
                if (position <= 0) {
                    position = 0;
                    toRight = !toRight;
                }
            }
        }, 2000);

        return () => clearInterval(slideInterval);
    }, [imageSize]);

    return (
        <motion.div
            className={cx('wrapper')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className={cx('auto-slide-image')}>
                <div ref={autoSlide} className={cx('slide-container')}>
                    {slideImageData.map((data) => (
                        <Image key={data.id} src={data.src} className={cx('slide-image')} />
                    ))}
                </div>
            </div>
            <Text content={'Welcome to gallery'} className={cx('slide-intro')} />
            <Text content={'>>> Press Enter <<<'} className={cx('slide-enter')} to={config.routes.gallery} />
        </motion.div>
    );
};

export default Home;
