import Head from 'next/head';
import { Layout, AuthorizeDataForm } from '../components';

const Home = () => (
  <Layout>
    <div className="container">
      <Head>
        <title>My Shared Air</title>
      </Head>
      <div className="child left">
        <h1>
          My
          <br />
          Shared Air
        </h1>
        <p>
          Här kan du som är legitimerad sjukvårdspersonal anmäla positiva
          provsvar på covid-19.
        </p>
      </div>
      <div className="child right">
        <AuthorizeDataForm />
      </div>

      <style jsx>{`
        .container {
          flex: 1;
          justify-self: center;
          display: flex;
          align-items: center;
        }

        .child {
          flex-basis: 50%;
        }

        .left {
          margin-right: 1rem;
        }

        .right {
          margin-left: 1rem;
          padding: 1em;
          background-color: #fff;
          border-radius: 0.61em;
        }

        h1 {
          max-width: 80%;
          line-height: 1;
        }
      `}</style>
    </div>
  </Layout>
);

export default Home;
