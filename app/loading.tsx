import styles from "./loading.module.css"; // Importar el CSS

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
      <p className={styles.text}>Cargando UDO Social...</p>
    </div>
  );
}