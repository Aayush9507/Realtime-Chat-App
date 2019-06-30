const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

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

    socket.on('msgevent', (msg) => {
        io.emit('message',msg)
    })

    socket.on('locevent', (coords) => {
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user left')
    
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})