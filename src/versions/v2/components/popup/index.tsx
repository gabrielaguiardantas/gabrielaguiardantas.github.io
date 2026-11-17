import { useEffect } from "react";
import family_img from "../../assets/family_img.jpg";

function PopUp(props: { props: () => void }) {
  useEffect(() => {
    document.querySelector(".family_img")?.addEventListener("click", () => {
      document
        .querySelector(".family_img")
        ?.classList.add("family_img_animation");
      setTimeout(() => {
        document
          .querySelector(".family_img")
          ?.classList.remove("family_img_animation");
      }, 4000);
    });
    setTimeout(() => {
      props.props();
    }, 10000);
  }, [props]);

  return (
    <img
      className="family_img"
      src={family_img}
      alt="Family Picture"
      width="30%"
      height="30%"
    />
  );
}

export default PopUp;
