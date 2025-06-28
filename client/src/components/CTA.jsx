import styles from "../style";
import Button from "./Button";

const CTA = () => (
  <section
    className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col bg-black-gradient-2 rounded-[20px] box-shadow`}
  >
    <div className="flex-1 flex flex-col">
      <h2 className={styles.heading2}>Join CoinTrustBank Today!</h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        Ready to step into the future of finance? Create your account now and
        start managing your digital assets with the security and ease you
        deserve.
      </p>
    </div>

    <div className={`${styles.flexCenter} sm:ml-10 ml-0 sm:mt-0 mt-10`}>
      <Button>Create Account</Button>
    </div>
  </section>
);

export default CTA;
