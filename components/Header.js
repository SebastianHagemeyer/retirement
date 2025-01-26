import React from "react";
//import MobileMenu from "./MobileMenu";
import Link from "next/link";

const Header = () => {
  return (
    <>

      <header className="uni-header uk-position-top">
        <div
          className="uni-header-navbar"
          data-uk-sticky="top: 70; show-on-up: false; animation: uk-animation-slide-top"
        >
          <div className="uk-container">
            <nav
              className="uk-navbar uk-navbar-container uk-navbar-transparent"
              data-uk-navbar
            >
              <div className="uk-navbar-top">
                {/* Left Logo */}
                <div className="uk-navbar-left uk-flex-1@m">
                  <a
                    className="uk-logo uk-navbar-item uk-h4 uk-h3@m uk-margin-remove"
                    href="https://retirementcoin.io"
                  >
                    <img
                      className="uk-visible dark:uk-hidden"
                      width="120"
                      src="/assets/images/nerko-light.png"
                      alt="Nerko"
                      loading="lazy"
                    />
                    <img
                      className="uk-hidden dark:uk-visible"
                      width="120"
                      src="/assets/images/nerko-dark.png"
                      alt="Nerko"
                      loading="lazy"
                    />
                  </a>
                </div>

                {/* Center Navigation */}
                <div className="uk-navbar-center">
                  <ul
                    className="uk-navbar-nav dark:uk-text-gray-10 uk-visible@m"
                    data-uk-scrollspy-nav="closest: li; scroll: true; offset: 40"
                    data-uk-navbar-bound
                  >
                    <li>
                      <Link href="/">Home</Link>
                    </li>
                    <li>
                      <Link href="/view">View NFT</Link>
                    </li>
                    <li>
                      <Link href="/mint">Mint NFT</Link>
                    </li>

                  </ul>
                </div>

                {/* Right Social Icons */}
                <div className="uk-navbar-right uk-flex-1 uk-flex-right">
                  <div className="uk-navbar-item uk-visible@m">
                    <ul className="uk-subnav uk-subnav-small">
                      <li>
                        <a href="https://x.com/retirementcto">
                          <i className="uk-icon-medium unicon-logo-twitter"></i>
                        </a>
                      </li>
                      <li>
                        <a href="https://t.me/TheRetirementCoinCTO">
                          <i className="uk-icon-medium fab fa-telegram-plane"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="uk-navbar-item uk-hidden@m">
                    <a href="#uni_mobile_menu" data-uk-toggle>
                      <span className="uk-icon uk-icon-medium material-icons">
                        menu
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

    </>


  );
};

export default Header;