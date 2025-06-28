import React from "react";
import styles from "../style";
import {
  Billing,
  Business,
  CardDeal,
  Partners,
  CTA,
  Stats,
  Testimonials,
  Hero,
} from "../components";

const Home = () => (
  <div className="w-full">
    <div className={`${styles.flexStart}`}>
      <div className={`${styles.boxWidth}`}>
        <Hero />
      </div>
    </div>

    <div className={`${styles.paddingX} ${styles.flexCenter}`}>
      <div className={`${styles.boxWidth}`}>
        <Stats />
        <Business />
        <Billing />
        <CardDeal />
        <Testimonials />
        <Partners />
        <CTA />
      </div>
    </div>
  </div>
);

export default Home;
