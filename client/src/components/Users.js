import onlineIcon from "../online.png";

const Users = ({ users, myUsername, getChatFriend }) => {
    return (
        <div className="flex flex-col border-r-2 w-1/4 bg-white rounded-2xl">
            <h2 className="py-2 pb-2 pl-2 text-lg border-b border-gray-500 text-gray-600"><span className="font-bold">{myUsername}'s</span> Chats</h2>
            <ul>
                {users && users.filter((user) => user.username !== myUsername).map((user) => {
                    return (
                    <li key={user.id}>
                    <button onClick={() => getChatFriend(user.id, user.username)}
                            className="flex w-full items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-100 focus:outline-none">
                        <div className="w-full pb-2">
                            <div className="flex justify-between">
                                <span className="block ml-2 font-semibold text-gray-600">{user.username}</span>
                                <span className="block ml-2 mt-2"><img src={onlineIcon} className="h-3 w-3" /></span>
                            </div>
                            <span className="flex ml-2 text-sm text-gray-600"></span>
                        </div>
                    </button>
                </li>)
                })
                }
            </ul>
        </div>
    )
}

export default Users;