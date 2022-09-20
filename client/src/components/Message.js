const Message = ({ message, me }) => {
    return (
        <div className={`px-2 pt-2 flex flex-col ${!me ? 'items-end' : 'items-start'}`}>
            <div className={`border-2 p-2 rounded-2xl ${!me ? message.highlight ? 'bg-gray-500' : 'bg-gray-300' : message.highlight ? 'bg-green-700' : 'bg-green-600'} ${message.think && 'text-gray-500'} ${message.fade && 'opacity-30'}`}>
                <p className={message.highlight ? "text-lg" : ""}>{ message.message }</p>
            </div>
            <div className="px-1 text-xs text-gray-400">
                <p id="time">{ message.time }</p>
            </div>
        </div>
    )
};

export default Message;