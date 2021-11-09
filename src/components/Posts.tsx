import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
} from "@firebase/firestore";
import React from "react";
import Post from "./Post";
import { db } from "@config/firebase";

const Posts: React.FC = () => {
  const [posts, setPosts] = React.useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);

  React.useEffect(
    () =>
      onSnapshot(
        query(collection(db, "posts"), orderBy("timestamp", "desc")),
        (snapshot) => {
          setPosts(snapshot.docs);
        }
      ),
    []
  );

  return (
    <div>
      {posts.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          username={post.data().username}
          userImg={post.data().profileImage}
          postImg={post.data().image}
          caption={post.data().caption}
        />
      ))}
    </div>
  );
};

export default Posts;
