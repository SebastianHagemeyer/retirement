import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";
import MobileMenu from "./MobileMenu";
import { useEffect, useState } from "react";

const Layout = ({ children }) => {


  const [isDarkMode, setIsDarkMode] = useState(false);

  // Function to toggle dark mode
  const toggleDarkMode = (isDarkMode) => {
    if (isDarkMode) {
      document.documentElement.classList.add("uk-dark");
      localStorage.setItem("darkMode", "1");
    } else {
      document.documentElement.classList.remove("uk-dark");
      localStorage.setItem("darkMode", "0");
    }
  };

  // Sync the initial state with localStorage
  useEffect(() => {
    //console.log("POTENTIAL")

    const darkModeToggle = document.getElementById("darkModeToggle");
    

    // Schema toggle via URL
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const getSchema = urlParams.get("schema");

    var storedSchema = localStorage.getItem("darkMode");

    // Handle schema from URL
    if (getSchema === "dark") {
      document.documentElement.classList.add("uk-dark");
      localStorage.setItem("darkMode", "1");
      storedSchema = 1
      
    } else if (getSchema === "light") {
      document.documentElement.classList.remove("uk-dark");
      localStorage.setItem("darkMode", "0");
      storedSchema = 0
    } else {
      // Apply previously stored schema
      
      if (storedSchema === "1") {
        document.documentElement.classList.add("uk-dark");
      } else {
        document.documentElement.classList.remove("uk-dark");
      }
    }

    if (storedSchema === "1") {
      darkModeToggle.checked = storedSchema
    }else{
      darkModeToggle.checked = 0
    }

  }, []);

  return (
    <>

      <Head>
        <title>Retirement</title>
        <meta name="description" content="Retirement Coin Token" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#741ff5" />

        <meta property="og:image" content="https://retirementcoin.io/assets/images/artwork/nftlow.PNG" />
        <meta name="twitter:image" content="https://retirementcoin.io/assets/images/artwork/nftlow.PNG" />

      </Head>






    <MobileMenu/>



      <div className="darkmode-trigger uk-position-bottom-right uk-position-small uk-position-fixed uk-box-shadow-large uk-radius-circle"
        data-darkmode-toggle="">
        <label className="switch">
          <span className="sr-only">Dark mode toggle</span>
          <input id="darkModeToggle" type="checkbox" onChange={(e) => toggleDarkMode(e.target.checked)} />
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