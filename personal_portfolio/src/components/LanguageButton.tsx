import styles from '../styles/LanguageButton.module.css';

type LanguageImgProps = {
    languageImgProps: {
      img: string;
      alt: string;
    }
  }


function LanguageButton(props: LanguageImgProps) {
const { languageImgProps: { img, alt } } = props;
  return (
    <button className={styles.languageButton}>
        <img src={img} alt={alt} height="35px" width="60px"/>
    </button>
  )
}

export default LanguageButton;
