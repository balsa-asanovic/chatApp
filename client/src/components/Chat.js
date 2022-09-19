import { useState, useEffect } from "react";
import { GrSend } from "react-icons/gr";
import Message from "./Message";

const Chat = ({ socket, id, username, setUsername, friendId, setFriendId, friendUsername, setFriendUsername }) => {
    const [message, setMessage] = useState("");
    const [messageHistory, setMessageHistory] = useState([]);

    const sendMessage = async (e) => {
        e.preventDefault();

        if (message !== "") {
            const nickNameChangeReg = /^\/nick <[a-zA-Z0-9]+>$/;
            if (nickNameChangeReg.test(message)) {
                const newUsername = /<([a-zA-z]+)>/.exec(message)[1];
                socket.emit("username_change", { id: id, username: newUsername });
                setUsername(newUsername);
            } else {

                const time = new Date(Date.now());
                const messageData = {
                    username: username,
                    id: friendId,
                    from: id,
                    message: message,
                    time: time.getHours().toString().padStart(2, "0") + ":" + time.getMinutes().toString().padStart(2, "0")
                };
                await socket.emit("send_message", messageData);
                // updating message list with latest message
                setMessageHistory((prev) => [...prev, messageData]);
            }
        }

        setMessage("");
    };

    useEffect(() => {
        socket.removeAllListeners("receive_message");
        socket.on("receive_message", (data) => {
            setMessageHistory((prev) => [...prev, data]);
            setFriendId(data.from);
            setFriendUsername(data.username);
        });
    }, []);

    // message history cleanup after disconnect with chat friend
    useEffect(() => {
        !friendId && setMessageHistory([]);
    }, [friendId])

    return (
        friendId && (
            <div className="flex flex-col w-full rounded-2xl space-y-1 overflow-auto">
                <div className="border-b-2 py-6 pl-4 bg-white rounded-2xl">
                    <p className="text-3xl font-bold">{friendUsername}</p>
                </div>
                <div className="overflow-auto h-[80%] space-y-2 bg-white rounded-2xl">
                    {messageHistory.map((messageData, index) => {
                        return (
                            <Message key={index} message={messageData} me={messageData.from === id} />
                        )
                    })}
                </div>
                <div className="p-3 border-t-2 rounded-b-2xl bg-white rounded-2xl">
                    <form onSubmit={sendMessage} className="flex flex-row space-x-2 pt-2">
                        <input type="text"
                            placeholder="..."
                            onChange={(e) => setMessage(e.target.value)}
                            value={message}
                            className="bg-gray-200 h-10 w-[97%] rounded-2xl pl-2 focus:outline-none"
                        />
                        <button className="w-[7%] md:w-[3%]"><GrSend size="2xs" /></button>
                    </form>
                </div>
            </div>
        )
    )
};

export default Chat;