import styles from "./Footer.module.scss";
import Image from "next/image";

const Footer = () => {
  return (
    <footer>
      <div className={styles.footer_logo}>
        <Image src="/logo.png" alt="logo" width={120} height={100} />
        <p>15teen Puzzle Game</p>
      </div>
      <div className={styles.copyright_text}>
        Developed by{" "}
        <strong>
          <a href="https://github.com/ayushiporwal1333/15puzzle">
            Ayushi Porwal
          </a>
        </strong>
      </div>
    </footer>
  );
};

export default Footer;
