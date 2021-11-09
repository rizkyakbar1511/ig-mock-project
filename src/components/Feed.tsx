import { useSession } from "next-auth/react";
import MiniProfile from "./MiniProfile";
import Posts from "./Posts";
import Stories from "./Stories";
import Suggestions from "./Suggestions";

const Feed: React.FC = () => {
  const { data: session } = useSession();
  return (
    <main
      className={`grid grid-cols-1 mx-auto md:grid-cols-2 md:max-w-3xl xl:grid-cols-3 xl:max-w-6xl ${
        !session && "!grid-cols-1 !max-w-3xl"
      }`}
    >
      {/* Section */}
      <section
        className={`${!session ? "col-span-1" : "col-span-1 md:col-span-2"}`}
      >
        {/* Stories */}
        <Stories />
        {/* Posts */}
        <Posts />
      </section>
      {/* Section */}
      {session && (
        <section className="hidden xl:inline-grid md:col-span-1">
          <div className="fixed top-20">
            {/* Mini Profile */}
            <MiniProfile />
            {/* Suggestion for you */}
            <Suggestions />
          </div>
        </section>
      )}
    </main>
  );
};

export default Feed;
