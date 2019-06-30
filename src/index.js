const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')



const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.emit('message', generateMessage('Welcome!!'))
    socket.broadcast.emit('message', generateMessage('New user joined'))

    socket.on('msgevent', (msg, callback) => {

        const filter = new Filter()

        if (filter.isProfane(msg)){
            return callback('Profanity not allowed')
        }

        io.emit('message', generateMessage(msg))
        callback("delivered")
    })

    socket.on('locevent', (coords, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user left'))
    
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})