import { bill } from "../assets";
import styles, { layout } from "../style";
import Button from "./Button";

const CardDeal = () => (
  <section className={layout.sectionReverse}>
    <div className={layout.sectionImg}>
      <img src={bill} alt="billing" className="w-[100%] h-[100%]" />
    </div>

    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>
        Easily control your <br className="sm:block hidden" /> billing &
        invoicing.
      </h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        Manage all your transactions, both crypto and fiat, in one place. Our
        intuitive dashboard gives you a clear overview of your financial
        activity, making billing and invoicing a breeze.
      </p>

      <Button className="mt-10">Get Started</Button>
    </div>
  </section>
);

export default CardDeal;
