import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";
import MobileMenu from "./MobileMenu";


const Layout = ({ children }) => {
  return (
    <>
    
      <Head>
        <title>Retirement</title>
        <meta name="description" content="Retirement Coin Token" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/assets/images/artwork/OG_RETIREMAN.png" />
        <meta name="theme-color" content="#741ff5" />
      </Head>

    


      





      <div className="darkmode-trigger uk-position-bottom-right uk-position-small uk-position-fixed uk-box-shadow-large uk-radius-circle"
        data-darkmode-toggle="">
        <label className="switch">
            <span className="sr-only">Dark mode toggle</span>
            <input type="checkbox"/>
            <span className="slider"></span>
        </label>
    </div>




      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;