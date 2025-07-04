import styles from "../style";
import { discount, robot } from "../assets";
import { Link } from "react-router-dom";
import Button from "./Button";

const Hero = () => {
  return (
    <section
      id="home"
      className={`flex md:flex-row flex-col ${styles.paddingY}`}
    >
      <div
        className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6`}
      >
        <div className="flex flex-row items-center py-[6px] px-4 bg-discount-gradient rounded-[10px] mb-2">
          <p className={`${styles.paragraph} ml-2`}>
            <span className="text-white">Next-Gen</span> Crypto{" "}
            <span className="text-white">Payments</span>
          </p>
        </div>

        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="flex-1 font-poppins font-semibold ss:text-[72px] text-[52px] text-white ss:leading-[100.8px] leading-[75px]">
            The Future of <br className="sm:block hidden" />{" "}
            <span className="text-gradient">Decentralized</span>{" "}
          </h1>
        </div>

        <h1 className="font-poppins font-semibold ss:text-[68px] text-[52px] text-white ss:leading-[100.8px] leading-[75px] w-full">
          Finance is Here.
        </h1>
        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
          Welcome to CoinTrustBank. We bridge the gap between traditional
          finance and the crypto world, offering secure, transparent, and
          efficient payment solutions powered by blockchain technology.
        </p>
        <div className="flex space-x-4 mt-8">
          <Link to="/register">
            <Button>Create Account</Button>
          </Link>
          <Link to="/dashboard">
            <Button styles="bg-transparent border border-blue-500 text-blue-500">
              Explore Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div
        className={`flex-1 flex ${styles.flexCenter} md:my-0 my-10 relative`}
      >
        <img
          src={robot}
          alt="billing"
          className="w-[100%] h-[100%] relative z-[5]"
        />

        <div className="absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient" />
        <div className="absolute z-[1] w-[80%] h-[80%] rounded-full white__gradient bottom-40" />
        <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient" />
      </div>
    </section>
  );
};

export default Hero;
