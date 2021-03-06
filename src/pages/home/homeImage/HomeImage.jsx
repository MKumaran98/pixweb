import classes from "./HomeImage.module.css";
import Logo from "../../../assets/mk logo finD.png";

export const HomeImage = () => {
  return (
    <div className={classes["home-image-container"]}>
      <div className={classes["pixweb-title"]}>
        <img src={Logo} className={classes["logo"]} alt="logo" />
        <h1>Pixweb</h1>
      </div>
      <h1 className={classes["tagline"]}>
        Learn from the <span>Best</span> about the art of{" "}
        <span>Photography!</span>
      </h1>
    </div>
  );
};
