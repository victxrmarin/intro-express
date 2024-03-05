const data = require('./data.json');
const express = require('express');
const fs = require('fs');

const port = 3000

const server = express();
server.use(express.json());

server.listen(port, () => {
    console.log('Server is running.')
});

server.post('/user', (req, res) => {
    const newUser = req.body
    if (!newUser.name || !newUser.age || !newUser.course) {
        return res.status(400).json({ message: "Data Incompleted" })
    } else {
        data.User.push(newUser);
        saveData(data);
        return res.status(201).json({ message: "Data completed." })
    }
});

server.get('/user', (req, res) => {
    return res.json(data.User);
});

server.put('/user/:id', (req, res) => {
    const userID = parseInt(req.params.id)
    const updateUser = req.body
    const indexUser = data.User.findIndex(user => user.id === userID);

    if (indexUser == -1) { return res.status(404).json({ message: "User not founded." }) }

    data.User[indexUser].name = updateUser.name || data.User[indexUser].name
    data.User[indexUser].age = updateUser.age || data.User[indexUser].age
    data.User[indexUser].course = updateUser.course || data.User[indexUser].course

    saveData(data);
    return res.json({ message: "Update sucessfully." })
});

server.delete('/user/:id', (req, res) => {
    const id = parseInt(req.params.id);
    data.User = data.User.filter(user => user !== id);
    saveData(data);
    return res.status(200).json({ message: "User deleted." });
})

function saveData() {
    fs.writeFileSync(__dirname + "/data.json", JSON.stringify(data, null, 2));
}