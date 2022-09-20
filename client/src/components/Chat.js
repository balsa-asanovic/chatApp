import { useState, useEffect, useRef } from "react";
import { GrSend } from "react-icons/gr";
import Message from "./Message";

const Chat = ({ socket, id, username, setUsername, friendId, setFriendId, friendUsername, setFriendUsername, choseNewFriend, setChoseNewFriend }) => {
    const [message, setMessage] = useState("");
    const [messageHistory, setMessageHistory] = useState([]);
    // reference to a div at the bottom of a chat for auto scrolling
    const chatBottom = useRef(null);
    // states for redirect option
    const [redirect, setRedirect] = useState(false);
    const [redirectTimer, setRedirectTimer] = useState(0);
    const redirectTimerRef = useRef(redirectTimer);

    const sendMessage = async (e) => {
        e.preventDefault();

        if (message !== "") {
            const nickNameChangeReg = /^\/nick <[a-zA-Z0-9]+>$/;
            const thinkMessageReg = /^\/think <(.+)>$/;
            const oopsMessageReg = /^\/oops$/;
            const fadeMessageReg = /^\/fadelast$/;
            const highlightMessageReg = /^\/highlight <(.+)>$/;
            const redirectMessageReg = /^\/countdown <[0-9]{1,2}> <(.+)>$/;
            if (nickNameChangeReg.test(message)) {
                const newUsername = /<([a-zA-z]+)>/.exec(message)[1];
                socket.emit("username_change", { id: id, username: newUsername });
                setUsername(newUsername);
            } else {
                let messageToSend = message;

                const thinkMessage = thinkMessageReg.test(message);
                const oopsMessage = oopsMessageReg.test(message);
                const fadeMessage = fadeMessageReg.test(message);
                const highlightMessage = highlightMessageReg.test(message);
                const redirectMessage = redirectMessageReg.test(message);

                thinkMessage && (messageToSend = /<(.+)>/.exec(message)[1]);
                highlightMessage && (messageToSend = /<(.+)>/.exec(messageToSend)[1]);

                const url = redirectMessage ? message?.match(/<([^<>]+)>/g)[1].match(/<([^<>]+)>/)[1] : "";
                const urlTimer = redirectMessage ? message?.match(/<([^<>]+)>/g)[0].match(/<([^<>]+)>/)[1] : "";

                const time = new Date(Date.now());
                const messageData = {
                    username: username,
                    id: friendId,
                    from: id,
                    message: messageToSend,
                    think: thinkMessage,
                    fade: false,
                    highlight: highlightMessage,
                    redirect: redirectMessage,
                    url: url,
                    urlTimer: urlTimer,
                    time: time.getHours().toString().padStart(2, "0") + ":" + time.getMinutes().toString().padStart(2, "0")
                };
                await socket.emit("send_message", messageData);
                // updating message list with latest message
                !redirectMessage && 
                    (!oopsMessage ? 
                        !fadeMessage ? 
                            setMessageHistory((prev) => [...prev, messageData]) 
                            : setMessageHistory((prev) => [...prev.slice(0, -1), { ...prev.at(-1), fade: true }]) 
                        : setMessageHistory((prev) => prev.slice(0, -1)));
            }
        }

        setMessage("");
    };

    const redirectCall = (timer, url) => {
        setRedirectTimer(timer);
        setRedirect(true);
        setInterval(() => {
            redirectTimerRef.current === 1 && (document.location.href = url);
            setRedirectTimer(prev => prev - 1);
        }, 1000);
    };

    useEffect(() => {
        redirectTimerRef.current = redirectTimer;
    });

    useEffect(() => {
        chatBottom.current?.scrollIntoView({ behavior: "smooth" });
    }, [messageHistory]);

    useEffect(() => {
        socket.removeAllListeners("receive_message");
        socket.on("receive_message", (data) => {
            setFriendId(data.from);
            setFriendUsername(data.username);
            !data.redirect ? data.message !== "/oops" ? data.message !== "/fadelast" ? setMessageHistory((prev) => [...prev, data]) : setMessageHistory((prev) => [...prev.slice(0, -1), { ...prev.at(-1), fade: true }]) : setMessageHistory((prev) => prev.slice(0, -1)) : redirectCall(data.urlTimer, data.url);
        });
    }, [redirect, redirectTimer]);

    // message history cleanup after disconnect with chat friend or friend change
    useEffect(() => {
        console.log(`friend id change ${friendId}`);
        messageHistory.length && (choseNewFriend ? setMessageHistory([]) : setMessageHistory((prev) => [prev?.at(-1)]));
        choseNewFriend && setChoseNewFriend(false);
    }, [friendId])

    return (
        friendId && (
            <div className="flex flex-col w-full rounded-2xl space-y-1 overflow-auto">
                <div className="border-b-2 py-6 pl-4 bg-white rounded-2xl">
                    <p className="text-3xl font-bold">{friendUsername}</p>
                </div>
                <div className="overflow-auto h-[80%] space-y-2 bg-white rounded-2xl">
                    {redirect ? <div className="text-7xl text-center relative top-[50%]">{redirectTimer}</div> :
                        messageHistory.map((messageData, index) => {
                            return (
                                <Message key={index} message={messageData} me={messageData.from === id} />
                            )
                        })
                    }
                    <div ref={chatBottom}></div>
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