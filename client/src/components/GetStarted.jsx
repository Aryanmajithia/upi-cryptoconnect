import styles from "../style";
import { arrowUp } from "../assets";

const GetStartedV2 = () => (
  <div
    className={`${styles.flexCenter} w-[140px] h-[140px] rounded-full bg-blue-gradient p-[2px] cursor-pointer group hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300`}
  >
    <div
      className={`${styles.flexCenter} flex-col bg-primary w-[100%] h-[100%] rounded-full`}
    >
      <div className={`${styles.flexStart} flex-row items-center`}>
        <p className="font-poppins font-medium text-[18px] leading-[23.4px] mr-2">
          <span className="text-gradient">Get Started</span>
        </p>
        <img
          src={arrowUp}
          alt="arrow-up"
          className="w-[23px] h-[23px] object-contain group-hover:translate-x-1 transition-transform duration-300"
        />
      </div>
    </div>
  </div>
);

export default GetStartedV2;
