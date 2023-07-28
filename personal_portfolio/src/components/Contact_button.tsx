import styles from '../styles/Contact_button.module.css';

type ImgProps = {
  imgProps: {
    img: string;
    alt: string;
    href: string;
  }
}

function Contact_button (props: ImgProps) {
  const { imgProps: { img, alt, href } } = props;
  return (
    <button className={styles.contacts_button}>
      <a href={href} target='_blank' rel='noreferrer'>
        <img src={img} alt={alt} height="35px"/>
      </a>
    </button>
  )
}

export default Contact_button