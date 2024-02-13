import styles from "../../theme/placeholder.module.css";

function Placeholder() {
  return (
    <div className={styles.placeholder}>
      <div className={styles.spinner}>
        <div className={styles.rect1}></div>
        <div className={styles.rect2}></div>
        <div className={styles.rect3}></div>
        <div className={styles.rect4}></div>
        <div className={styles.rect5}></div>
      </div>
    </div>
  );
}

export default Placeholder;
