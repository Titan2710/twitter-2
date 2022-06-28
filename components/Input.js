
import { CalendarIcon, ChartBarIcon, EmojiHappyIcon, PhotographIcon, XIcon } from '@heroicons/react/outline';
import { addDoc, collection, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useSession } from 'next-auth/react';
import React, { useRef, useState, useEffect } from 'react'
import { db, storage } from '../firebase';


function Input() {
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef(null);

  const {data : session} = useSession()

   const sendPost = async () => {
      if(loading) return;
      setLoading(true);

      const docRef = await addDoc(collection(db, "posts"), {
        id: session.user.uid,
        username: session.user.name,
        userImg: session.user.image,
        tag: session.user.tag,
        text: input,
        timestamp: serverTimestamp(),
      });

      const imageRef = ref(storage, `posts/${docRef.id}/image`);

      if(selectedFile) {
        await uploadString(imageRef, selectedFile, "data_url").then(async () => {
            const downloadURL = await getDownloadURL(imageRef);
            await updateDoc(doc(db, "posts", docRef.id), {
                image: downloadURL,
            })
        })
      }

      setLoading(false);
      setInput("")
      setSelectedFile(null);
    }
    
    const addImageToPost = (e) => {
        const reader = new FileReader();
        if (e.target.files[0]) {
          reader.readAsDataURL(e.target.files[0]);
        }
    
        reader.onload = (readerEvent) => {
          setSelectedFile(readerEvent.target.result);
        };
      };

  return (
    <div className={`flex p-3 space-x-3 border-b border-gray-700 ${loading && "opacity-60"}`}>
        <img    
            src={session?.user.image}
            referrerPolicy="no-referrer"
            alt="user-img"
            className='rounded-full cursor-pointer h-11 w-11'
        />
        <div className="w-full divide-y divide-gray-800">
            <div className={`${selectedFile && "pb-7"} ${input && "space-y-2.5"}`}>
                <textarea
                  className="bg-transparent outline-none text-[#d9d9d9] text-lg placeholder-gray-500 tracking-wide w-full min-h-[50px]"
                  rows="2"
                  placeholder="What's happening?"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                ></textarea>
                {selectedFile && (
                    <div className="relative">
                    <div
                        className="absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer"
                        onClick={() => setSelectedFile(null)}
                    >
                        <XIcon className="h-5 text-white" />
                    </div>
                    <img
                        src={selectedFile}
                        alt=""
                        className="object-contain rounded-2xl max-h-80"
                    />
                    </div>
                )}
            </div>
            {!loading && (
                <div className="flex items-center justify-between pt-2.5">
                    <div className="flex items-center">
                        <div 
                            className="icon"
                            onClick={() => filePickerRef.current.click()}
                        >
                            <PhotographIcon className='h-[22px] text-[#1d9bf0]' />
                            <input 
                                type="file" 
                                hidden
                                className='' 
                                onChange={addImageToPost} 
                                ref={filePickerRef}
                            />
                        </div>
                        
                        <div className="rotate-90 icon">
                            <ChartBarIcon className="text-[#1d9bf0] h-[22px]" />
                        </div>
                        <div className="icon">
                                <EmojiHappyIcon className="text-[#1d9bf0] h-[22px]" />     
                        </div>
                        <div className="icon">
                            <CalendarIcon className="text-[#1d9bf0] h-[22px]" />
                        </div>
                        
                    </div>
                    <button
                        className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default"
                        disabled={!input && !selectedFile}
                        onClick={sendPost}
                    >
                    Tweet
                    </button>
                </div>   
            )}
        </div>
    </div>
  )
}

export default Input