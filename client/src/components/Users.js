const Users = ({ users, myUsername }) => {
    return (
        <div>
            <h2><span>{myUsername}'s</span> Chats</h2>
            <ul>
                {users && users.filter((user) => user.username !== myUsername).map((user) => {
                    return (
                    <li key={user.id}>
                    <button>
                        <div>
                            <div>
                                <span>{user.username}</span>
                                <span></span>
                            </div>
                            <span></span>
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