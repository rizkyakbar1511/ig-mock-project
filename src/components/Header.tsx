import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  SearchIcon,
  PlusCircleIcon,
  UserGroupIcon,
  HeartIcon,
  PaperAirplaneIcon,
  MenuIcon,
} from "@heroicons/react/outline";
import { HomeIcon } from "@heroicons/react/solid";
import { signIn, signOut, useSession } from "next-auth/react";
import { useSetRecoilState } from "recoil";

import Spinner from "./Spinner";
import { modalState } from "@atoms/modalAtoms";

const Header: React.FC = () => {
  const { data: session, status } = useSession();
  const setOpen = useSetRecoilState(modalState);

  return (
    <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="flex justify-between max-w-6xl mx-5 lg:mx-auto">
        {/* Left */}
        <Link href="/" passHref>
          <div className="relative hidden w-24 cursor-pointer lg:inline-grid">
            <Image
              src="https://links.papareact.com/ocw"
              layout="fill"
              alt="ocw"
              objectFit="contain"
            />
          </div>
        </Link>
        <div className="relative flex-shrink-0 w-10 cursor-pointer lg:hidden">
          <Image
            src="https://links.papareact.com/jjm"
            layout="fill"
            alt="jjm"
            objectFit="contain"
          />
        </div>
        {/* Middle - Search input field */}
        <div className="max-w-xs">
          <div className="relative p-3 mt-1 rounded-md ">
            <div className="absolute inset-y-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon className="w-5 h-5 text-gray-400" />
            </div>
            <input
              className="block w-full pl-10 border-gray-300 rounded-md focus:ring-black focus:border-black bg-gray-50 sm:text-sm"
              type="text"
              placeholder="Search"
            />
          </div>
        </div>
        {/* Right */}
        <div className="flex items-center justify-end space-x-4">
          <Link href="/">
            <a>
              <HomeIcon className="nav-button" />
            </a>
          </Link>
          <MenuIcon className="h-6 cursor-pointer md:hidden" />
          {session ? (
            <>
              <div className="relative nav-button">
                <PaperAirplaneIcon className="rotate-45 nav-button" />
                <div className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-1 -right-2 animate-pulse">
                  3
                </div>
              </div>
              <PlusCircleIcon
                onClick={() => setOpen(true)}
                className="nav-button"
              />
              <UserGroupIcon className="nav-button" />
              <HeartIcon className="nav-button" />

              {status === "loading" ? (
                <Spinner />
              ) : (
                <div
                  onClick={() => signOut()}
                  className="relative w-10 h-10 overflow-hidden rounded-full cursor-pointer"
                >
                  <Image
                    src={session?.user?.image as string}
                    layout="fill"
                    alt={session?.user?.name as string}
                    objectFit="contain"
                  />
                </div>
              )}
            </>
          ) : (
            <button onClick={() => signIn()}>Sign In</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
