import Image from '~/components/Image/Image';
import styles from './Contact.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets/images';
import Text from '~/components/Text/Text';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faGoogleDrive } from '@fortawesome/free-brands-svg-icons';
import Button from '~/components/Button';
import { faAt } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

const teamData = [
    { image: images.sang, name: 'Trần Phước Sang', role: 'Owner' },
    { image: images.khoa, name: 'Lê Minh Khoa', role: 'Tester' },
    { image: images.minh, name: 'Trịnh Lê Minh', role: 'Tester' },
];

const contactData = [
    {
        icon: faAt,
        name: 'Email: sangdza7@gmail.com',
        href: '',
        onClick: () => {
            navigator.clipboard.writeText('sangdza7@gmail.com');
            alert('Copy msg : "sangdza7@gmail.com"');
        },
    },
    {
        icon: faFacebookF,
        name: 'Fb: Le Minh Khoa',
        href: 'https://www.facebook.com/leminh.khoa.3511/',
        onClick: () => {
            navigator.clipboard.writeText('https://www.facebook.com/leminh.khoa.3511/');
            alert('Copy msg : "https://www.facebook.com/leminh.khoa.3511/"');
        },
    },
    {
        icon: faFacebookF,
        name: 'Fb: Phuoc Sang',
        href: 'https://www.facebook.com/lee.hook.7503',
        onClick: () => {
            navigator.clipboard.writeText('https://www.facebook.com/lee.hook.7503');
            alert('Copy msg : "https://www.facebook.com/lee.hook.7503"');
        },
    },
];

const Contact = () => {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('left')}>
                <Text className={cx('member-title')} content={'Cảm ơn các cộng tác viên đã hỗ trợ dự án'} />
                {teamData.map((data, index) => (
                    <div key={index} className={cx('member-info')}>
                        <div className={cx('member-image-box')}>
                            <Image className={cx('member-image')} src={data.image} />
                        </div>
                        <Text className={cx('member-name')} content={data.name} />
                        <Text className={cx('member-role')} content={data.role} />
                    </div>
                ))}
            </div>
            <div className={cx('right')}>
                <Text className={cx('text', 'summary')} content={'Thống kê'} />
                <Text className={cx('text', 'gap')} content={''} />
                <Text className={cx('text', 'summary')} content={'Publish: 03/07/2023'} />
                <Text className={cx('text', 'gap')} content={''} />
                <Text className={cx('text', 'summary', 'gg-drive')} content={'Nguồn: Google Drive'} />
                <FontAwesomeIcon icon={faGoogleDrive} color="#ccc" />
            </div>
            <div className={cx('group-contact-info')}>
                <Text className={cx('contact-text')} content={'Mọi thắc mắc xin liên hệ về địa chi:'} />
                {contactData.map((data, index) => (
                    <Button
                        key={index}
                        className={cx('contact-btn')}
                        leftIcon={<FontAwesomeIcon icon={data.icon} />}
                        name={data.name}
                        href={data.href}
                        onClick={data.onClick}
                    />
                ))}
                <Text className={cx('contact-text')} content={'© Bản quyền thuộc về 12A7 ❤️ Inc ☞ Do not Reup'} />
                <Text
                    className={cx('contact-text')}
                    content={'© Nghiêm cấm sử dụng hình ảnh & video nhằm mục đích thương mại dưới mọi hình thức'}
                />
            </div>
            <Image className={cx('logo')} src={images.kysg} />
        </div>
    );
};

export default Contact;
