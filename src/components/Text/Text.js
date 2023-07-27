import classNames from 'classnames/bind';
import styles from './Text.module.scss';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const cx = classNames.bind(styles);

function Text({ content, to, className, disabled, isMotional = false, ...rest }) {
    let Type = 'p';
    const props = {
        ...rest,
    };

    if (to) {
        Type = Link;
        props.to = to;
    }

    const MotionCustom = motion(Type);

    if (disabled) {
        Object.keys(props).forEach((key) => {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                delete props[key];
            }
        });
    }

    const classes = cx('wrapper', {
        [className]: className,
    });

    return (
        <>
            {isMotional ? (
                <MotionCustom className={classes} {...props}>
                    {content}
                </MotionCustom>
            ) : (
                <Type className={classes} {...props}>
                    {content}
                </Type>
            )}
        </>
    );
}

export default Text;
