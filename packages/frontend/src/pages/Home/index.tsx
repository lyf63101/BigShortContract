import css from "./index.module.less";
import img1 from "@images/homeImg1.png";
import img2 from "@images/homeImg2.png";
import img3 from "@images/homeImg3.png";
import img4 from "@images/homeImg4.png";
import img5 from "@images/homeImg5.png";
import img6 from "@images/homeImg6.png";
import img7 from "@images/homeImg7.png";
import img8 from "@images/homeImg8.png";

const Home = () => {
  return (
    <div className={css.wrapper}>
      <img src={img1} alt="img1" className={css.imgStyle} />
      <img src={img2} alt="img2" className={css.imgStyle} />
      <img src={img3} alt="img3" className={css.imgStyle} />
      <img src={img4} alt="img4" className={css.imgStyle} />
      <img src={img5} alt="img5" className={css.imgStyle} />
      <img src={img6} alt="img6" className={css.imgStyle} />
      <img src={img7} alt="img7" className={css.imgStyle} />
      <img src={img8} alt="img8" className={css.imgStyle} />
    </div>
  );
};

export default Home;
