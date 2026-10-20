import { Language, useLanguage } from "../../context/language";

type LanguageImgProps = {
  languageImgProps: {
    img: string;
    alt: Language;
  };
};

function LanguageButton(props: LanguageImgProps) {
  const {
    languageImgProps: { img, alt },
  } = props;
  const { setLanguage } = useLanguage();
  return (
    <button onClick={() => setLanguage(alt)}>
      <img src={img} alt={alt} height="35px" width="60px" />
    </button>
  );
}

export default LanguageButton;
