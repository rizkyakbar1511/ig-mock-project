import React from "react";
import faker from "faker";
import Story from "@components/Story";
import { useSession } from "next-auth/react";

type IStories = {
  name: string;
  username: string;
  avatar: string;
  email: string;
  dob: Date;
  phone: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  id: number;
};

const Stories: React.FC = () => {
  const [suggestions, setSuggestions] = React.useState<IStories[]>([]);
  const { data: session } = useSession();
  React.useEffect(() => {
    const suggestions = [...Array(20)].map((_, i) => ({
      ...faker.helpers.contextualCard(),
      id: i,
    }));
    setSuggestions(suggestions);
  }, []);
  return (
    <div className="flex p-6 mt-8 space-x-2 overflow-x-scroll bg-white border border-gray-200 rounded-sm scrollbar-thin scrollbar-thumb-black">
      {session && (
        <Story img={session.user.image} username={session.user.username} />
      )}
      {suggestions.map((suggestion) => (
        <Story
          key={suggestion.id}
          img={suggestion.avatar}
          username={suggestion.username}
        />
      ))}
    </div>
  );
};

export default Stories;
