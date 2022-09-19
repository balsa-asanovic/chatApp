import { useState } from "react";

const Chat = ({ id, username, setUsername, friendId, friendUsername }) => {
    const [message, setMessage] = useState("");
    const [messageHistory, setMessageHistory] = useState([]);

    return (
        friendId && (
            <div>
                <div>
                    <p>{friendUsername}</p>
                </div>
                <div>
                    {messageHistory.map((messageData, index) => {
                        return (
                            <div key={index}>{messageData.message}</div>
                        )
                    })}
                </div>
                <div>
                    <form>
                        <input type="text"
                            placeholder="..."
                            onChange={(e) => setMessage(e.target.value)}
                            value={message}
                        />
                        <button>Send</button>
                    </form>
                </div>
            </div>
        )
    )
};

export default Chat;