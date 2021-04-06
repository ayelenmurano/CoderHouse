const socket = io()
//Permite empezar a usar los sockets desde el lado cliente
//cliente

//Nos suscribimos a un evento enviada desde el servidor
// socket.on('NuevoProducto', data=>{
//     res.render("pages/index.ejs",{productos})
//     // alert(data)

//     //Enviamos un evento al servidor
//     socket.emit('notificacion','Mensaje recibido exitosamente')

// })


function nuevoProducto(){
    let titulo = document.getElementById("titulo").value
    let precio = document.getElementById("precio").value
    let thumbnail = document.getElementById("thumbnail").value
    socket.emit('nuevoProducto', {titulo, precio, thumbnail})
}

socket.on('nuevoProducto', productos =>{
    console.log('hola')
    let template=ejs.compile("pages/index.ejs")
    template({productos})
})
