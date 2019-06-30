const socket = io()

// Elements
const $messageForm = document.querySelector('#msgform')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendlocationButton = document.querySelector('#sendLocation')
const $messages = document.querySelector('#messages')

// Templates

const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML


socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        message: message
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (url) => {
    console.log(url)
    const html = Mustache.render(locationTemplate,{
        url:url
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')
    // disable button after sending

    const msg = e.target.elements.message.value

    socket.emit('msgevent', msg, (error) => {
        // Enable again after ACK
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus


        if(error){
            return console.log(error)
        }
        console.log('Message delivered')

    })
})

document.querySelector('#sendLocation').addEventListener('click', () => {


    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser')
    }
    // Disable
    $sendlocationButton.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        socket.emit('locevent',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log("location shared")
        })
    })

    $sendlocationButton.removeAttribute('disabled')
    
})

