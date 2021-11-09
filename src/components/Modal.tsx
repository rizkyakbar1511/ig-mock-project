import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRecoilState } from "recoil";
import { modalState } from "@atoms/modalAtoms";
import { CameraIcon } from "@heroicons/react/outline";
import { db, storage } from "@config/firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";
import { useSession } from "next-auth/react";
import { ref, getDownloadURL, uploadString } from "@firebase/storage";
import Spinner from "./Spinner";

const Modal: React.FC = () => {
  const { data: session } = useSession();
  const [selectedFile, setSelectedFile] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [open, setOpen] = useRecoilState(modalState);
  const filePickerRef = React.useRef<HTMLInputElement>(null);
  const captionRef = React.useRef<HTMLInputElement>(null);

  const uploadPost = async () => {
    if (loading) return;
    setLoading(true);

    try {
      //1. Create a post and add to firestore 'post' collection
      //2. get the post ID for the newly created post
      //3. upload the image to firebase storage with the post ID
      //4. get a download URL from firebase storage and update the original post with image

      const docRef = await addDoc(collection(db, "posts"), {
        username: session?.user.username,
        caption: captionRef.current?.value,
        profileImage: session?.user.image,
        timestamp: serverTimestamp(),
      });

      const imageRef = ref(storage, `posts/${docRef.id}/image`);

      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), { image: downloadURL });
      });
    } catch (error) {
      alert("Error");
    } finally {
      setOpen(false);
      setLoading(false);
      setSelectedFile(null);
    }
  };

  const addImageToPost = (e: React.FormEvent<HTMLInputElement>): void => {
    const reader = new FileReader();
    if (e.currentTarget.files?.[0]) {
      reader.readAsDataURL(e.currentTarget.files[0]);
    }
    reader.onload = (readerEvent): void => {
      setSelectedFile(readerEvent.target?.result);
    };
  };

  return (
    <Transition appear show={open} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={() => setOpen(false)}
      >
        <div className="flex items-end justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 transition-opacity bg-black bg-opacity-25" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div>
                {selectedFile ? (
                  <img
                    className="object-contain w-full cursor-pointer"
                    onClick={() => setSelectedFile(null)}
                    src={selectedFile}
                    alt="upload-img"
                  />
                ) : (
                  <div
                    onClick={() => filePickerRef?.current?.click()}
                    className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full cursor-pointer"
                  >
                    <CameraIcon
                      className="w-6 h-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                )}
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Upload a photo
                  </Dialog.Title>
                  <div>
                    <input
                      ref={filePickerRef}
                      onChange={addImageToPost}
                      type="file"
                      hidden
                    />
                  </div>

                  <div className="mt-2">
                    <input
                      className="w-full text-center border-none focus:ring-0"
                      type="text"
                      ref={captionRef}
                      placeholder="Please enter a caption..."
                    />
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    disabled={!selectedFile || loading}
                    onClick={uploadPost}
                    type="button"
                    className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed "
                  >
                    {loading ? <Spinner /> : "Upload Post"}
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
