import './App.css';
import io from "socket.io-client";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import Users from './components/Users';
import Chat from './components/Chat';
import { VscError } from "react-icons/vsc";
import { FaBeer } from 'react-icons/fa';

document.body.classList.add('bg-gradient-to-br');
document.body.classList.add('from-sky-900');
document.body.classList.add('to-indigo-700');

const socket = io.connect("http://localhost:5000");

const USERNAME_REGEX = /^[a-zA-Z]+[a-zA-Z0-9]*$/;

function App() {
  // my id assigned by socekt.io
  const [id, setId] = useState("");
  // my username
  const [username, setUsername] = useState("");
  // boolean for username validation
  const [validUsername, setValidUsername] = useState(false);
  // boolean for username existence on server
  const [usernameExists, setUsernameExists] = useState(false);
  const [joined, setJoined] = useState(false);
  // list of connected users
  const [users, setUsers] = useState([]);
  // id and username of the person you chat with
  const [friendId, setFriendId] = useState("");
  const [friendUsername, setFriendUsername] = useState("");
  // reference to friendId state, so we wouldn't get stale value in listener in useEffect
  const friendIdRef = useRef(friendId);
  // reference to input field, used for focus
  const inputRef = useRef(null);

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
    // keeping ref updated
    friendIdRef.current = friendId;
  });

  useEffect(() => {
    // setting id assigned by socket
    socket.on("id", (data) => {
      setId(data);
    });
    // if joined successfully show users list and chat and hide initial form, otherwise show user exist error
    socket.on("join_status", (data) => {
      data ? setJoined(true) : setUsernameExists(true);
    })
    // setting users list with data we get from the socket
    socket.on("users_list", (data) => {
      setUsers(data);
    });
    // focusing on input form when page is rendered
    inputRef.current.focus();
    // listener for users list object
    socket.on("users_list", (data) => {
      setUsers(data);
      // checking to see if our friend is in the user's list, if not close the chat
      // if still there, update username
      !data.filter((item) => item.id === friendIdRef.current).length ? setFriendId("")
        : setFriendUsername(data.find((item) => item.id === friendIdRef.current).username);
    });
  }, []);

  useLayoutEffect(() => {
    setValidUsername(USERNAME_REGEX.test(username));
  }, [username]);

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
                ref={inputRef}
                required
                onChange={(e) => {setUsername(e.target.value); setUsernameExists(false)}} />
              <button className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                      disabled={!username || !validUsername || usernameExists}>
                Join Chat
              </button>
            </div>
            <p className={`${username && !validUsername ? '' : 'hidden'} bg-zinc-700 rounded-xl p-2 text-red-400 flex flex-row`}>
              <VscError className="mr-1 mt-1" /> Username must only contain letters and numbers.
            </p>
            <p className={`${username && usernameExists ? '' : 'hidden'} bg-zinc-700 rounded-xl p-2 text-red-400 flex flex-row`}>
              <VscError className="mr-1 mt-1" /> Username you selected is already active on the server.
            </p>
          </form>
        </div>)
        : (<div className="flex flex-row p-16 rounded-2xl space-x-2 h-screen">
          <Users users={users} myUsername={username} getChatFriend={getChatFriend} />
          <Chat socket={socket} id={id} username={username} setUsername={setUsername} friendId={friendId} setFriendId={setFriendId} friendUsername={friendUsername} setFriendUsername={setFriendUsername} />
        </div>)
      }
    </>
  );
}

export default App;
