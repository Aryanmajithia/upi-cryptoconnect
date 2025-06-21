import { clients } from "../constants";
import styles from "../style";

const Clients = () => (
  <section className={`${styles.flexCenter} my-16 flex-col`}>
    <h2 className={`${styles.heading2} text-center mb-12`}>
      Trusted by the Best
    </h2>
    <div className={`${styles.flexCenter} flex-wrap w-full`}>
      {clients.map((client) => (
        <div
          key={client.id}
          className={`flex-1 ${styles.flexCenter} sm:min-w-[192px] min-w-[120px] m-5`}
        >
          <img
            src={client.logo}
            alt="client_logo"
            className="sm:w-[192px] w-[100px] object-contain hover:opacity-80 transition-opacity duration-300"
          />
        </div>
      ))}
    </div>
  </section>
);

export default Clients;
