import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <footer>
      <div className={styles.footer_logo}>
        <img src="https://lorecioni.github.io/fifteen-puzzle-game/img/15teenlogo.png" />
        <p>15teen Puzzle Game</p>
      </div>
      <div className={styles.copyright_text}>
        Developed by <strong>Ayushi Porwal</strong>
      </div>
    </footer>
  );
};

export default Footer;
