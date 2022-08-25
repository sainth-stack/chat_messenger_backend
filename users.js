const users = []
const addUser = ({name, room,msg,id,type }) => {
    const user = { id, name, room,msg,type,status:'Online'  }
    if(user.room !== undefined){
        users.push(user)
    }
    return { user }
}
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}
const getUser = (room,name) => users.find((user) => user.room === room && user.name === name)
const getActiveUsers = () => users

module.exports = { getUser, addUser, removeUser, getActiveUsers }