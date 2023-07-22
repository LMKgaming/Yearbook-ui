import { useRef, useState } from 'react';
import classNames from 'classnames/bind';
import Text from '~/components/Text';

import styles from './FormInput.module.scss';

const cx = classNames.bind(styles);

const defaultFn = () => {}

function FormInput({
    title,
    name,
    disable = false,
    disableDefaultValue = "",
    type = 'text',
    error = 'Please fill this range',
    show = false,
    classNameInput,
    className,
    callback = defaultFn,
    ...rest
}) {
    const [content, setContent] = useState(disableDefaultValue || "");
    const [appear, setAppear] = useState('');
    const inputRef = useRef();

    const handleInputUsername = (e) => {
        setContent(e.target.value);
        callback({
            content: e.target.value,
            name,
            file: e.target.files ? e.target.files[0] : null
        });
    };
    const handleFocus = (e) => {
        setAppear(appear !== '' ? '' : e.target.name);
    };

    const handleClickText = () => {
        setTimeout(() => inputRef.current.focus(), 0);
    };
    return (
        <div className={cx('input-group',{
            disable: disable,
            [className]: className
        })}>
            <Text
                className={cx('text', 'content-input', {
                    appear: appear === name || content,
                    'error-content': show,
                })}
                onClick={handleClickText}
                content={title}
            />
            <input
                ref={inputRef}
                name={name}
                type={type}
                autoComplete="on"
                value={content}
                onFocus={handleFocus}
                onBlur={handleFocus}
                onChange={disable ? () => {} : handleInputUsername}
                // onKeyDown={(e) => {
                //     if (e.key === "Enter") {
                //         e.preventDefault()
                //     }
                // }}
                className={cx({
                    error: show,
                    file: type === 'file',
                    disable: disable,
                    [classNameInput]: classNameInput,
                })}
                {...rest}
            />
            {type === 'file' && <label className={cx('label')} htmlFor={name}>{content}</label>}
            <Text
                className={cx('text', 'error-input', {
                    show: show,
                })}
                content={error}
            />
        </div>
    );
}

export default FormInput;
