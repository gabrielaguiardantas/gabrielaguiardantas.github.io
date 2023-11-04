import { useDispatch } from "react-redux";
import { actionCreator } from "../../redux/actions";

type LanguageImgProps = {
  languageImgProps: {
    img: string;
    alt: string;
  };
};

function LanguageButton(props: LanguageImgProps) {
  const {
    languageImgProps: { img, alt },
  } = props;
  const dispatch = useDispatch();
  return (
    <button onClick={() => dispatch(actionCreator(alt))}>
      <img src={img} alt={alt} height="35px" width="60px" />
    </button>
  );
}

export default LanguageButton;
