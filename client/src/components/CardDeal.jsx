import { card } from "../assets";
import styles, { layout } from "../style";
import Button from "./Button";

const CardDeal = () => (
  <section className={layout.section}>
    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>
        Manage & Trade Your Digital <br className="sm:block hidden" /> Assets
        With Ease.
      </h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        With CoinTrustBank, you have full control over your portfolio.
        Seamlessly swap between assets like USDC and DAI, track their
        performance, and manage your finances all within one secure platform.
      </p>

      <Button styles={`mt-10`}>Explore Asset Management</Button>
    </div>

    <div className={layout.sectionImg}>
      <img src={card} alt="asset_management" className="w-[100%] h-[100%]" />
    </div>
  </section>
);

export default CardDeal;
