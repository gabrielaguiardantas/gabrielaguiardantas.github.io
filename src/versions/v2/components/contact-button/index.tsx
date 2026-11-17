type contactImgProps = {
  contactImgProps: {
    img: string;
    alt: string;
    href: string;
  };
};

function Contact_button(props: contactImgProps) {
  const {
    contactImgProps: { img, alt, href },
  } = props;
  return (
    <button>
      <a href={href} target="_blank" rel="noreferrer">
        <img src={img} alt={alt} height="35px" />
      </a>
    </button>
  );
}

export default Contact_button;
