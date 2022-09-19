import { useState } from "react";
import { GrSend } from "react-icons/gr";

const Chat = ({ id, username, setUsername, friendId, friendUsername }) => {
    const [message, setMessage] = useState("");
    const [messageHistory, setMessageHistory] = useState([]);

    return (
        friendId && (
            <div className="flex flex-col w-full rounded-2xl space-y-1 overflow-auto">
                <div className="border-b-2 py-6 pl-4 bg-white rounded-2xl">
                    <p className="text-3xl font-bold">{friendUsername}</p>
                </div>
                <div className="overflow-auto h-[80%] space-y-2 bg-white rounded-2xl">
                    {messageHistory.map((messageData, index) => {
                        return (
                            <div key={index}>{messageData.message}</div>
                        )
                    })}
                </div>
                <div className="p-3 border-t-2 rounded-b-2xl bg-white rounded-2xl">
                    <form className="flex flex-row space-x-2 pt-2">
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