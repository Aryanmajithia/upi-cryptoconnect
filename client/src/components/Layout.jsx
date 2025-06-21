import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="bg-primary w-full overflow-hidden">
      <div className="flex justify-center items-center sm:px-16 px-6">
        <div className="xl:max-w-[1280px] w-full">
          <Navbar />
        </div>
      </div>

      <main>{children}</main>

      <div className="flex justify-center items-center sm:px-16 px-6">
        <div className="xl:max-w-[1280px] w-full">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
