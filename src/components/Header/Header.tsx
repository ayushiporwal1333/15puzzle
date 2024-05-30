import React from "react";
import styles from "./Header.module.scss";

interface HeaderProps {
  onStartPause: () => void;
  onReset: () => void;
  onShuffle: () => void;
  onHelp: () => void;
  moves: number;
  time: string;
  isGameActive: boolean;
  isGamePaused: boolean;
  solvable: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onStartPause,
  onReset,
  onShuffle,
  onHelp,
  moves,
  time,
  isGameActive,
  isGamePaused,
  solvable,
}) => {
  return (
    <header>
      <div className="container">
        <div className={`row ${styles.header_row}`}>
          <div className={`col-md-6 ${styles.info_box}`}>
            <div className="row">
              <div className="col-6">
                <div className={styles.score_point}>
                  <span className={styles.text}>MOVES</span>
                  <span className={styles.num}>{moves}</span>
                </div>
              </div>
              <div className="col-6">
                <div className={styles.timepoint}>
                  <span className={styles.text}>TIME</span>
                  <span className={styles.num}>{time}</span>
                </div>
              </div>
              <div className="col-6">
                <div
                  className={`start-button ${styles.start_button} ${
                    !solvable ? "disabled" : "active"
                  }`}
                  onClick={onStartPause}
                >
                  {isGameActive && !isGamePaused ? "PAUSE" : "START"}
                </div>
              </div>
              <div className="col-6">
                <div className={styles.reset_button} onClick={onReset}>
                  RESET
                </div>
              </div>
              <div className="col-6">
                <div className={styles.shuffle_button} onClick={onShuffle}>
                  SHUFFLE
                </div>
              </div>
              <div className="col-6">
                <div className={styles.help_button} onClick={onHelp}>
                  HELP ME
                </div>
              </div>
            </div>
          </div>
          <div className={`col-md-6 ${styles.title}`}>
            <a href="/">
              <h1>Fifteen puzzle game</h1>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
