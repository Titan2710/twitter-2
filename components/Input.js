
import { CalendarIcon, ChartBarIcon, EmojiHappyIcon, PhotographIcon, XIcon } from '@heroicons/react/outline';
import { addDoc, collection, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import React, { useRef, useState, useEffect } from 'react'
import { db, storage } from '../firebase';


function Input() {
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef(null);

   const sendPost = async () => {
      if(loading) return;
      setLoading(true);

      const docRef = await addDoc(collection(db, "posts"), {
        // id: session.user.uid,
        // username: session.user.name,
        // userImg: session.user.image,
        // tag: session.user.tag,
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
            src='data:image/png;base64,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'
            alt=""
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