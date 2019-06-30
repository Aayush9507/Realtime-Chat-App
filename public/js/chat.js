const socket = io()


socket.on('message', (message) => {
    console.log(message)
})


document.querySelector('#msgform').addEventListener('submit', (e) => {
    e.preventDefault()

    const msg = e.target.elements.message.value

    socket.emit('msgevent', msg)
})

document.querySelector('#sendLocation').addEventListener('click', () => {

    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        socket.emit('locevent',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    })
    
})

