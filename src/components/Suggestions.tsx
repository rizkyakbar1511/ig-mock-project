import React from "react";
import faker from "faker";

type ISuggestions = {
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

const Suggestions: React.FC = () => {
  const [suggestions, setSuggestions] = React.useState<ISuggestions[]>([]);

  React.useEffect(() => {
    const suggestions = [...Array(5)].map((_, id) => ({
      ...faker.helpers.contextualCard(),
      id,
    }));
    setSuggestions(suggestions);
  }, []);
  return (
    <div className="mt-4 ml-10">
      <div className="flex justify-between mb-5 text-sm">
        <h3 className="text-sm font-bold text-gray-400">Suggestions for you</h3>
        <button className="font-semibold text-gray-600">See All</button>
      </div>
      {suggestions.map(({ id, avatar, username, company }) => (
        <div className="flex items-center justify-between mt-3" key={id}>
          <img
            className="w-10 h-10 rounded-full border p-[0.125em]"
            src={avatar}
            alt={username}
          />

          <div className="flex-1 ml-4">
            <h2 className="text-sm font-semibold">{username}</h2>
            <h3 className="text-xs text-gray-400">Works at {company.name}</h3>
          </div>

          <button className="text-xs font-bold text-blue-400">Follow</button>
        </div>
      ))}
    </div>
  );
};

export default Suggestions;
