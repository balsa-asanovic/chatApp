import './App.css';
import io from "socket.io-client";
import { useEffect, useState } from "react";
import Users from './components/Users';
import Chat from './components/Chat';

document.body.classList.add('bg-gradient-to-br');
document.body.classList.add('from-sky-900');
document.body.classList.add('to-indigo-700');

const socket = io.connect("http://localhost:5000");

function App() {
  // my id assigned by socekt.io
  const [id, setId] = useState("");
  // my username
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  // list of connected users
  const [users, setUsers] = useState([]);
  // id and username of the person you chat with
  const [friendId, setFriendId] = useState("");
  const [friendUsername, setFriendUsername] = useState("");

  const joinChat = (e) => {
    e.preventDefault();
    username !== "" && socket.emit("join_chat", username);
  };

  const getChatFriend = (chatFriendId, chatFriendUsername) => {
    if (id !== chatFriendId) {
      setFriendId(chatFriendId);
      setFriendUsername(chatFriendUsername);
    }
  };

  useEffect(() => {
    // setting id assigned by socket
    socket.on("id", (data) => {
      setId(data);
    });
    // if joined successfully show users list and chat and hide initial form
    socket.on("join_status", (data) => {
      data && setJoined(true);
    })
    // setting users list with data we get from the socket
    socket.on("users_list", (data) => {
      setUsers(data);
    });
  });

  return (
    <>
      {!joined ? (
        <div className="flex flex-col items-center w-1/2 my-[15%] m-auto space-y-20">
          <h1 className="text-5xl text-slate-300 font-bold">Chat App</h1>
          <form onSubmit={joinChat} className="w-full max-w-sm">
            <div className="flex items-center border-teal-500 py-2">
              <input className="appearance-none bg-transparent border-solid border-b-2 w-full text-gray-300 mr-3 py-1 px-2 leading-tight outline-none focus:bg-gradient-to-br from-sky-700 to-indigo-500 rounded"
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)} />
              <button className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded">
                Join Chat
              </button>
            </div>
          </form>
        </div>)
        : (<div className="flex flex-row p-5 rounded-2xl space-x-2 h-screen">
          <Users users={users} myUsername={username} getChatFriend={getChatFriend} />
          <Chat id={id} username={username} setUsername={setUsername} friendId={friendId} friendUsername={friendUsername} />
        </div>)
      }
    </>
  );
}

export default App;
