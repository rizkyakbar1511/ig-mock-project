import React, { FormEvent } from "react";
import Image from "next/image";
import {
  BookmarkIcon,
  ChatIcon,
  DotsHorizontalIcon,
  EmojiHappyIcon,
  HeartIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/outline";

import { HeartIcon as HeartIconFilled } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  setDoc,
} from "@firebase/firestore";
import Moment from "react-moment";
import { db } from "@config/firebase";

interface Props {
  id: string;
  username: string;
  userImg: string;
  postImg: string;
  caption: string;
}

const Post: React.FC<Props> = ({ id, username, userImg, postImg, caption }) => {
  const { data: session } = useSession();
  const [comment, setComment] = React.useState("");
  const [comments, setComments] = React.useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  const [likes, setLikes] = React.useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  const [hasLiked, setHasLiked] = React.useState(false);

  React.useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "posts", id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setComments(snapshot.docs)
      ),
    [id]
  );

  React.useEffect(
    () =>
      onSnapshot(collection(db, "posts", id, "likes"), (snapshot) =>
        setLikes(snapshot.docs)
      ),
    [id]
  );

  React.useEffect(
    () =>
      setHasLiked(
        likes.findIndex((like) => like.id === session?.user.uid) !== -1
      ),
    [likes, session?.user.uid]
  );

  const sendComment = async (e: FormEvent) => {
    e.preventDefault();
    setComment("");
    await addDoc(collection(db, "posts", id, "comments"), {
      comment,
      username: session?.user.username,
      userImage: session?.user.image,
      timestamp: serverTimestamp(),
    });
  };

  const likePost = async () => {
    if (hasLiked) {
      await deleteDoc(
        doc(db, "posts", id, "likes", session?.user.uid as string)
      );
    } else {
      await setDoc(doc(db, "posts", id, "likes", session?.user.uid as string), {
        username: session?.user.username,
      });
    }
  };

  return (
    <div className="bg-white border rounded-sm my-7">
      {/* Header */}
      <div className="flex items-center p-5">
        <div className="relative w-12 h-12 p-1 mr-3 overflow-hidden border rounded-full">
          <Image
            src={userImg}
            alt={username}
            layout="fill"
            objectFit="contain"
          />
        </div>
        <p className="flex-1 font-bold">{username}</p>
        <DotsHorizontalIcon className="h-5" />
      </div>
      {/* Post Image */}
      <div className="relative w-full overflow-hidden h-96">
        <Image src={postImg} alt={username} layout="fill" objectFit="cover" />
      </div>
      {/* Buttons */}
      {session && (
        <div className="flex justify-between px-4 pt-4">
          <div className="flex space-x-4">
            {hasLiked ? (
              <HeartIconFilled
                onClick={likePost}
                className="text-red-500 post-action-btn"
              />
            ) : (
              <HeartIcon onClick={likePost} className="post-action-btn" />
            )}
            <ChatIcon className="post-action-btn" />
            <PaperAirplaneIcon className="post-action-btn" />
          </div>
          <BookmarkIcon className="post-action-btn" />
        </div>
      )}

      {/* Likes */}
      {likes.length > 0 && (
        <p className="px-5 mt-3 font-bold">{likes.length} likes</p>
      )}

      {/* Caption */}
      <p className="p-5 pt-3 truncate">
        <span className="mr-1 font-bold">{username} </span> {caption}
      </p>

      {/* Comments */}
      <div className="h-20 ml-10 overflow-y-scroll scrollbar-thumb-black scrollbar-thin">
        {comments?.map((comment) => (
          <div className="flex items-center mb-3 space-x-2" key={comment.id}>
            <div className="relative overflow-hidden rounded-full h-7 w-7">
              <Image
                src={comment.data().userImage}
                alt="comment-img"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <p className="flex-1 text-sm">
              <span className="font-bold">{comment.data().username}</span>{" "}
              {comment.data().comment}
            </p>
            <Moment className="pr-5 text-xs text-gray-400" fromNow>
              {comment.data().timestamp?.toDate()}
            </Moment>
          </div>
        ))}
      </div>

      {/* Input Box */}
      {session && (
        <form className="flex items-center p-4">
          <EmojiHappyIcon className="h-7" />
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1 border-none outline-none focus:ring-0"
            type="text"
            placeholder="Add a comment..."
          />
          <button
            onClick={sendComment}
            type="submit"
            disabled={!comment.trim()}
            className="font-semibold text-blue-400"
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
};

export default Post;
