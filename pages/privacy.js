import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Contact() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Karo.Vision</title>
        <meta name="description" content="Next gen app experiences." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <p className={styles.description}>
          We don't collect any personal data about you :)
        </p>
      </main>
    </div>
  );
}
