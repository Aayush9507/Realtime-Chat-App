const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.emit('message','Welcome!!')
    socket.broadcast.emit('message', 'New user joined')

    socket.on('msgevent', (msg, callback) => {

        const filter = new Filter()

        if (filter.isProfane(msg)){
            return callback('Profanity not allowed')
        }

        io.emit('message', msg)
        callback("delivered")
    })

    socket.on('locevent', (coords, callback) => {
        io.emit('locationMessage', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user left')
    
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})