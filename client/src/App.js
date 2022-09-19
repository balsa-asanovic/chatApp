import './App.css';
import io from "socket.io-client";
import { useEffect, useState } from "react";
import Users from './components/Users';
import Chat from './components/Chat';

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
        <div>
          <h1>Chat App</h1>
          <form onSubmit={joinChat}>
            <div>
              <input
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)} />
              <button>
                Join Chat
              </button>
            </div>
          </form>
        </div>)
        : (<div>
          <Users users={users} myUsername={username} getChatFriend={getChatFriend} />
          <Chat id={id} username={username} setUsername={setUsername} friendId={friendId} friendUsername={friendUsername} />
        </div>)
      }
    </>
  );
}

export default App;
