import classNames from 'classnames/bind';
import styles from './Search.module.scss';
import Button from '~/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const cx = classNames.bind(styles);

const Search = ({ model }) => {
    const [searchState, setSearchState] = useState(false);

    const handleClickSearchIcon = () => {
        console.log(searchState)
        setSearchState((prev) => !prev);
    };

    if (model === 'mobile' || model === 'mini-tablet') {
        return (
            <div className={cx('search-box')}>
                <Button
                    className={cx('search-icon')}
                    name={<FontAwesomeIcon icon={faSearch} />}
                    onClick={handleClickSearchIcon}
                />
                {searchState && <input className={cx('search-input')} placeholder="Input here" />}
            </div>
        );
    }
    return (
        <div className={cx('search-box')}>
            <input className={cx('search-input')} placeholder="Input here" />
        </div>
    );
};

export default Search;
