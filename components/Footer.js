

const Footer = () => {
  return (
    <footer className="uni-footer uk-section uk-section-xlarge@m uk-border-top">
      <div className="uk-container">
        <div className="uk-panel uk-position-z-index">
          <div className="uk-grid" data-uk-grid>
            {/* Left Section */}
            <div className="uk-width-expand@m">
              <div className="uk-panel uk-width-medium@m">
                <a href="https://retirementcoin.io" className="uk-logo">
                  <img
                    className="uk-visible dark:uk-hidden"
                    width="120"
                    src="/assets/images/nerko-light.png"
                    alt="Nerko"
                  />
                  <img
                    className="uk-hidden dark:uk-visible"
                    width="120"
                    src="/assets/images/nerko-dark.png"
                    alt="Nerko"
                  />
                </a>
                <p className="uk-margin-medium@m">
                  DISCLAIMER: <b>$RETIREMENT</b> is a meme coin with no intrinsic value or expectation of financial
                  return. Rich talk, bold claims, and &quot;moon missions&quot; are not financial advice <b>(NFA)</b>. Always Do Your
                  Own Research <b>(DYOR)</b> before making any investment decisions. Crypto is volatile, and while we may
                  joke about retiring early, we&rsquo;re not here to provide financial advice.{" "}
                  <i>Be smart, have fun, and never invest more than you&rsquo;re willing to lose.</i>
                </p>
                <ul className="uk-subnav uk-subnav-small">
                  <li>
                    <a href="https://x.com/retirementcto">
                      <i className="uk-icon uk-icon-medium unicon-logo-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://t.me/TheRetirementCoinCTO">
                      <i className="uk-icon-medium fab fa-telegram-plane"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            {/* Right Section */}
            <div className="uk-width-2-5@m">
              <div className="uk-grid" data-uk-grid>
                <div className="uk-width-1-2 uk-width-expand@m">
                  <ul className="uk-list">
                    <li>
                      <a href="https://www.retirementcoin.io/whitepaper.html#introduction">About</a>
                    </li>
                    <li>
                      <a href="https://www.retirementcoin.io/whitepaper.html/whitepaper#roadmap">Roadmap</a>
                    </li>
                    <li>
                      <b>
                        <a href="https://nft.retirementcoin.io">OG NFT Launch</a>
                      </b>
                    </li>
                  </ul>
                </div>
                <div className="uk-width-1-2 uk-width-expand@m">
                  <ul className="uk-list">
                    <li>
                      <a href="https://www.retirementcoin.io/whitepaper.html#tokenomics">How it works!</a>
                    </li>
                    <li>
                      <a href="https://www.retirementcoin.io/community.html">Community</a>
                    </li>
                    <li>
                      <a
                        href="mailto:info@retirementcoin.io"
                        style={{ overflowWrap: "break-word" }}
                      >
                        Email us: info@retirementcoin.io
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="uk-panel uk-text-small uk-margin-medium-top uk-margin-2xlarge-top@m">
            <div className="uk-grid uk-child-width-auto@m uk-flex-between" data-uk-grid>
              <div className="uk-flex-first@m">
                <p>© 2024 Retirement. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;