import React, { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAykBF57Oarf7ejOySJb8_gCl9U5sLzTyg",
  authDomain: "voicediary-52a16.firebaseapp.com",
  projectId: "voicediary-52a16",
  storageBucket: "voicediary-52a16.appspot.com",
  messagingSenderId: "246151599477",
  appId: "1:246151599477:web:3e3da138b3575691f4af3c",
  measurementId: "G-LQ39VQM6R9",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const VoiceToTextApp = () => {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  let recognition;

  if ("webkitSpeechRecognition" in window) {
    recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setText(transcript);
    };
  }

  const startRecording = () => {
    setIsRecording(true);
    recognition.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    recognition.stop();
  };

  const saveNote = async () => {
    if (text.trim()) {
      await addDoc(collection(db, "notes"), { content: text, timestamp: new Date() });
      setText("");
      alert("Note saved!");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Voice-to-Text Note App</h1>
      <textarea
        className="w-full p-3 border rounded-lg mb-4"
        rows="5"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex space-x-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-4 py-2 rounded-lg ${isRecording ? "bg-red-500" : "bg-green-500"} text-white`}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
        <button
          onClick={saveNote}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          disabled={!text.trim()}
        >
          Save Note
        </button>
      </div>
    </div>
  );
};

export default VoiceToTextApp;