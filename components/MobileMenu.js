import React from "react";
import { useEffect } from "react";
import Link from "next/link";



//import UIkit from "uikit";

const MobileMenu = () => {

  useEffect(() => {
    // Get references to the buttons
    const menuButton = document.getElementById("mobileMenuToggle");
    const closeButton = document.getElementById("closeButton");

    // Define the event listener functions
    const openMenu = () => {
      const offcanvas = UIkit.offcanvas("#uni_mobile_menu");
      if (offcanvas) {
        offcanvas.show(); // Open the menu
      } else {
        console.error("Offcanvas element not found!");
      }
    };

    const closeMenu = () => {
      const offcanvas = UIkit.offcanvas("#uni_mobile_menu");
      if (offcanvas) {
        offcanvas.hide(); // Close the menu
      } else {
        console.error("Offcanvas element not found!");
      }
    };

    // Add event listeners if buttons exist
    if (menuButton) {
      menuButton.addEventListener("click", openMenu);
    }

    if (closeButton) {
      closeButton.addEventListener("click", closeMenu);
    }

    // Clean up event listeners on component unmount
    return () => {
      if (menuButton) {
        menuButton.removeEventListener("click", openMenu);
      }
      if (closeButton) {
        closeButton.removeEventListener("click", closeMenu);
      }
    };
  }, []); // Empty dependency array to ensure this runs only on mount/unmount



  return (
    <div
      id="uni_mobile_menu"
      className="uni-mobile-menu uk-offcanvas"
      data-uk-offcanvas="mode: push; overlay: true; flip: true; selPanel: .uk-offcanvas-bar-panel;"
    >
      <div className="uk-offcanvas-bar-panel uk-panel dark:uk-background-gray-100">
        <div
          className="uni-mobile-menu-wrap uk-flex-column uk-flex-between"
          data-uk-height-viewport="offset-bottom: true;"
        >
          <div className="uni-mobile-menu-content">
            {/* Header */}
            <header className="uk-card uk-card-2xsmall uk-flex-middle uk-flex-between">
              <div className="uk-flex-1">
                <button id="closeButton"
                  aria-label="Close Menu"
                  className=" uk-button uk-button-small uk-button-icon uk-button-default uk-button-outline uk-radius-circle"
                  type="button"
                >
                  <i className="material-icons">arrow_back</i>
                </button>
              </div>
              <div>
                <h5 className="uk-h5 uk-margin-remove">Retirement</h5>
              </div>
              <div className="uk-flex-1"></div>
            </header>
            <hr className="uk-margin-remove" />

            {/* Menu Items */}
            <div className="uk-card uk-card-small">
              <div className="uk-panel">
                <ul className="uk-nav uk-nav-default">
                  <li className="uk-nav-header">Homepages</li>
                  <li>
                      <Link href="https://retirementcoin.io">Home</Link>
                    </li>
                    <li>
                      <Link href="/">Dashboard</Link>
                    </li>
                    <li>
                      <Link href="/view">View NFT</Link>
                    </li>
                    <li>
                      <Link href="/mint">Mint NFT</Link>
                    </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;