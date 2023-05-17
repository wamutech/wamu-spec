import React from 'react';
import styles from './styles.module.css';

import EthereumFoundationLogo from '@site/static/img/ethereum-foundation.svg';

export default function Acknowledgements(): JSX.Element {
  return (
    <section className={styles.acknowledgements}>
      <div className="container">
        <div className="text--center">
          <EthereumFoundationLogo className={styles.acknowledgementsSvg} role="img" />
        </div>
        <div className="text--center">
          <div>Funded by:</div>
          <div className="text--bold">
            <a href="https://esp.ethereum.foundation" target="_blank">
              The Ethereum Foundation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
