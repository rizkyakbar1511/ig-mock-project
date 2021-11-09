import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import Spinner from "./Spinner";

const MiniProfile: React.FC = () => {
  const { data: session, status } = useSession();

  return (
    <div className="flex items-center justify-between ml-10 mt-14">
      {status === "loading" ? (
        <Spinner />
      ) : (
        <div className=" relative overflow-hidden rounded-full border p-[0.125em] w-16 h-16">
          <Image
            src={session?.user?.image as string}
            alt={session?.user?.name as string}
            layout="fill"
            objectFit="contain"
          />
        </div>
      )}
      <div className="flex-1 mx-4">
        <h2 className="font-bold">{session?.user?.username}</h2>
        <h3 className="text-sm text-gray-400">Welcome to Instagram</h3>
      </div>

      <button
        onClick={() => signOut()}
        className="text-sm font-semibold text-blue-400"
      >
        Sign Out
      </button>
    </div>
  );
};

export default MiniProfile;
