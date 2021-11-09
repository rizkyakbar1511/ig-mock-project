import { NextPage, GetServerSideProps } from "next";
import { getProviders, signIn as providerSignIn } from "next-auth/react";
import Image from "next/image";
import Header from "@components/Header";

const SignIn: NextPage<{
  providers: typeof getProviders;
}> = ({ providers }) => {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen py-2 -mt-56 text-center px-14">
        <div className="relative w-40 h-20">
          <Image
            src="https://links.papareact.com/ocw"
            layout="fill"
            alt="logo"
            objectFit="contain"
          />
        </div>
        <p className="text-xs italic">
          This is not a Real App, it is built for mock project only
        </p>
        <div className="mt-40">
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                className="p-3 text-white bg-blue-500 rounded-lg"
                onClick={() =>
                  providerSignIn(provider.id, { callbackUrl: "/" })
                }
              >
                Sign in with {provider.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
};

export default SignIn;
