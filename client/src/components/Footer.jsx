import styles from "../style";
import { logo } from "../assets";
import { Link } from "react-router-dom";

const footerLinks = [
  {
    title: "Services",
    links: [
      { name: "Crypto Trading", link: "/crypto-tracker" },
      { name: "Flash Loans", link: "/flash-loans" },
      { name: "Stock Market", link: "/stock-market" },
      { name: "UPI Payments", link: "/send-and-request" },
      { name: "Bank Transfer", link: "/bank-detail" },
    ],
  },
  {
    title: "Community",
    links: [
      { name: "Help Center", link: "/help" },
      { name: "Partners", link: "/partners" },
      { name: "Blog", link: "/blog" },
      { name: "Newsletters", link: "/newsletters" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", link: "/about" },
      { name: "Careers", link: "/careers" },
      { name: "Contact Us", link: "/contact" },
      { name: "Terms of Service", link: "/terms" },
      { name: "Privacy Policy", link: "/privacy" },
    ],
  },
];

const socialMedia = [
  { id: "social-media-1", icon: "fab fa-facebook-f", link: "https://facebook.com" },
  { id: "social-media-2", icon: "fab fa-twitter", link: "https://twitter.com" },
  { id: "social-media-3", icon: "fab fa-instagram", link: "https://instagram.com" },
  { id: "social-media-4", icon: "fab fa-linkedin-in", link: "https://linkedin.com" },
];

const Footer = () => (
  <>
    <footer className="bg-primary pt-16 pb-8">
      <div className={`${styles.flexCenter} ${styles.paddingY} flex-col`}>
        <div className={`${styles.flexStart} md:flex-row flex-col mb-8 w-full`}>
          <div className="flex-[1] flex flex-col justify-start mr-10">
            <Link to="/">
              <img src={logo} alt="CryptoConnect" className="w-[266px] h-[72px] object-contain" />
            </Link>
            <p className={`${styles.paragraph} mt-4 max-w-[312px]`}>
              A new way to make payments easy, reliable and secure.
            </p>
          </div>

          <div className="flex-[1.5] w-full flex flex-row justify-between flex-wrap md:mt-0 mt-10">
            {footerLinks.map((footerLink) => (
              <div key={footerLink.title} className="flex flex-col ss:my-0 my-4 min-w-[150px]">
                <h4 className="font-poppins font-medium text-[18px] leading-[27px] text-white">
                  {footerLink.title}
                </h4>
                <ul className="list-none mt-4">
                  {footerLink.links.map((link, index) => (
                    <li
                      key={link.name}
                      className={`font-poppins font-normal text-[16px] leading-[24px] text-dimWhite hover:text-secondary cursor-pointer ${index !== footerLink.links.length - 1 ? "mb-4" : "mb-0"}`}
                    >
                      <Link to={link.link}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full flex justify-between items-center md:flex-row flex-col pt-6 border-t-[1px] border-t-[#3F3E45]">
          <p className="font-poppins font-normal text-center text-[18px] leading-[27px] text-white">
            Copyright Ⓒ {new Date().getFullYear()} CryptoConnect. All Rights Reserved.
          </p>

          <div className="flex flex-row md:mt-0 mt-6">
            {socialMedia.map((social, index) => (
              <a
                key={social.id}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-[21px] h-[21px] object-contain cursor-pointer ${index !== socialMedia.length - 1 ? "mr-6" : "mr-0"}`}
              >
                <i className={`${social.icon} text-white hover:text-secondary transition-colors duration-300`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  </>
);

export default Footer;
