import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Benefits from '@site/src/components/Benefits';
import Acknowledgments from '@site/src/components/Acknowledgments';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">
          A protocol and library for computation of{' '}
          <Link href="https://en.wikipedia.org/wiki/Threshold_cryptosystem">threshold signatures</Link> by multiple{' '}
          <Link href="https://ethereum.org/en/decentralized-identity/#what-are-decentralized-identifiers">
            cryptographic identities
          </Link>
          .
        </p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/whitepaper">
            Read the Whitepaper - 10min ⏱️
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title="Welcome" description={siteConfig.tagline}>
      <HomepageHeader />
      <main>
        <Benefits />

        <Acknowledgments />
      </main>
    </Layout>
  );
}
