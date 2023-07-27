import classNames from 'classnames/bind';
import styles from './Text.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function Text({ content, to, className, disabled, ...rest }) {
    let Type = 'p';

    const props = {
        ...rest,
    };

    if (to) {
        Type = Link;
        props.to = to;
    }

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
        <Type className={classes} {...props}>
            {content}
        </Type>
    );
}

export default Text;
