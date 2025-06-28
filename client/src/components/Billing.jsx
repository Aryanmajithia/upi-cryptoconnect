import { bill } from "../assets";
import styles, { layout } from "../style";
import Button from "./Button";

const Billing = () => (
  <section id="product" className={layout.sectionReverse}>
    <div className={layout.sectionImgReverse}>
      <img
        src={bill}
        alt="transaction_transparency"
        className="w-[100%] h-[100%] relative z-[5]"
      />

      {/* gradient start */}
      <div className="absolute z-[3] -left-1/2 top-0 w-[50%] h-[50%] rounded-full white__gradient" />
      <div className="absolute z-[0] w-[50%] h-[50%] -left-1/2 bottom-0 rounded-full pink__gradient" />
      {/* gradient end */}
    </div>

    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>
        Complete Transparency <br className="sm:block hidden" /> on Every
        Transaction.
      </h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        Every transaction is recorded on an immutable public ledger. With
        CoinTrustBank, you can easily track your payments and verify fund
        transfers using blockchain explorers for Polygon, ensuring full
        transparency and trust.
      </p>

      <div className="flex flex-row flex-wrap sm:mt-10 mt-6">
        <Button>Check Polygon Scan</Button>
      </div>
    </div>
  </section>
);

export default Billing;
