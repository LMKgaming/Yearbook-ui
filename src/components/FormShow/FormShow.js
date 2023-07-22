import classNames from 'classnames/bind';
import Text from '~/components/Text';
import styles from './FormShow.module.scss';

const cx = classNames.bind(styles);

function FormShow({ title, content, formOutside, formInside, titleCss, contentCss, onClick = () => {} }) {
    return (
        <div
            className={cx('form-wrapper', {
                [formOutside]: formOutside,
            })}
            onClick={onClick}
        >
            <div
                className={cx('form-layout-content', {
                    [formInside]: formInside,
                })}
                onClick={onClick}
            >
                <Text
                    className={cx('text', 'type', {
                        [titleCss]: titleCss,
                    })}
                    content={title || 'Missing title'}
                />
                <Text
                    className={cx('text', 'data-type', {
                        [contentCss]: contentCss,
                    })}
                    content={content || 'Missing content'}
                />
            </div>
        </div>
    );
}

export default FormShow;
