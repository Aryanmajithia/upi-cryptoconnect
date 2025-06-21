import React from "react";
import styles from "../style";
import {
  Business,
  CardDeal,
  Clients,
  CTA,
  Stats,
  Testimonials,
  Hero,
} from "../components";
import Layout from "../components/Layout";

const Home = () => (
  <Layout>
    <div className={`bg-primary ${styles.flexStart}`}>
      <div className={`${styles.boxWidth}`}>
        <Hero />
      </div>
    </div>

    <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
      <div className={`${styles.boxWidth}`}>
        <Stats />
        <Business />
        <CardDeal />
        <Testimonials />
        <Clients />
        <CTA />
      </div>
    </div>
  </Layout>
);

export default Home;
