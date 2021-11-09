import type { NextPage } from "next";
import Head from "next/head";
import Header from "@components/Header";
import Feed from "@components/Feed";
import Modal from "@components/Modal";

const Home: NextPage = () => {
  return (
    <div className="h-screen overflow-y-scroll bg-gray-50 scrollbar-hide">
      <Head>
        <title>Mock Instagram</title>
      </Head>
      <Header />
      <Feed />
      <Modal />
    </div>
  );
};

export default Home;
