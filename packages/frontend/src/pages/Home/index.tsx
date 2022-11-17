import css from "./index.module.less";
import img1 from "@images/homeImg1.jpg";
import img2 from "@images/homeImg2.jpg";
import img3 from "@images/homeImg3.jpg";
import img4 from "@images/homeImg4.jpg";
import img5 from "@images/homeImg5.jpg";
import img6 from "@images/homeImg6.jpg";

// import img from "../../images/homeImg1.jpg";

const Home = () => {
  return (
    <div className={css.wrapper}>
      <img src={img1} alt="img1" className={css.imgStyle} />
      <img src={img2} alt="img2" className={css.imgStyle} />
      <img src={img3} alt="img3" className={css.imgStyle} />
      <img src={img4} alt="img4" className={css.imgStyle} />
      <img src={img5} alt="img5" className={css.imgStyle} />
      <img src={img6} alt="img6" className={css.imgStyle} />
    </div>
  );
};

export default Home;
