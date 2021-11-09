interface Props {
  username?: string;
  img?: string;
}

const Story: React.FC<Props> = ({ username, img }) => {
  return (
    <div>
      <img
        className="h-14 w-14 rounded-full p-[0.09375em] border-red-500 border-2 object-contain cursor-pointer hover:scale-110 transition transform duration-200 ease-out"
        src={img}
        alt={username}
      />
      <p className="text-xs text-center truncate w-14">{username}</p>
    </div>
  );
};

export default Story;
