var fs = require('fs')
var express = require('express')
var multer  = require('multer')

//Iniciamos express
var app = express()

//Le pasamos a http la constante app
const http = require('http').Server(app)

//Le pasamos al constante http a socket.io
const io = require('socket.io')(http)

//Indicamos que queremos cargar los archivos estaticos que se encuentran en dicha carpeta
app.use(express.static("public"))

app.set("view engine", "ejs")

app.set("views", "./views")



app.use(express.urlencoded({ extended: false }))

var router = express.Router()

app.use(express.json())

const server = http.listen(8080, () =>{
    console.log(`Escuchando en el puerto ${server.address().port}`)
})

server.on("error", (error) => console.log(`Se produjo un error: ${error}`))


//-------FUNCIONES-------
let productos

async function leer(){
 try{
    if(!fs.existsSync('./productos.txt')){
        fs.writeFileSync('./productos.txt','[]')
    }
    var contenido = await fs.promises.readFile('./productos.txt','utf-8');
    productos = JSON.parse(contenido);
 } catch (error) {
    console.log('Se produjo un error al leer el archivo.')
 }
   
};

async function escribir(items){
    try{   
        await fs.promises.writeFile('./productos.txt',JSON.stringify(items)) 
    } catch{
        console.log('Se produjo un error al escribir el archivo.')
    }
}

leer();

app.use('/api/productos',router)


//-------RENDERIZADOS-------

//Cargamos el archivo index en la raiz
app.get("/",function(req, res){
    res.redirect("/api/productos/vista")
})

router.get("/vista",function(req, res){
    res.render("pages/index.ejs",{productos})
})

// router.post('/vista', function(req,res){
//     console.log(req.body);
//     const {titulo, precio, thumbnail} = req.body;
//     const producto = {titulo, precio, thumbnail};
//     var longitud = productos.length;
//     producto.id= longitud+1;
//     productos.push(producto);
//     escribir(productos);

//     res.render("pages/index.ejs",{productos})
    
    
// })




//-------POSTMAN-------

router.get('/listar',(req, res)=>{
    console.log('request recibido');
   // var longitud = productos.length;
   if ( JSON.stringify(productos) === '[]'){
    res.json ({error:'no hay productos cargados'})
   } else {
    res.json({items: productos})
   }   
})

router.get('/listar/:id',(req, res)=>{
    console.log('request recibido');
    var longitud = productos.length;
    var id = req.params.id;
    if ( id > longitud || id < 1){
        res.json ({error:'producto no encontrado'})
    } else {
        var producto = productos[id-1]

        res.json({items: producto})
    }
    
})
var upload = multer({ dest: 'uploads/' })

router.post('/guardar',upload.array('title','price','thumbnail'), (req,res)=>{
    const producto = req.body;
    var longitud = productos.length;
    producto.id= longitud+1;
    productos.push(producto);
    escribir(productos);
    res.json({items: productos})
})

router.put('/:id',(req, res)=>{
    console.log('request recibido');
    var longitud = productos.length;
    var id = req.params.id;
    var actualizar = req.body
    if ( id > longitud || id < 1){
        res.json ({error:'producto no encontrado'})
    } else {
        productos[id-1] = actualizar
        var producto = productos[id-1]
        escribir(productos)

        res.json({items: producto})
    }
})

router.delete('/:id',(req,res)=>{
    var id = req.params.id
    var producto = productos[id-1]
    productos.splice(id-1,1)
    escribir(productos)

    res.json({items: producto})
})

//------Socket.io------
io.on('connection', socket => {
    //"connection" se ejecuta la primera vez que se abre una nueva conexion
    console.log('Usuario conectado')
    
    //io.sockets.emit('nuevoProducto',productos)
    //Enviamos un evento al cliente
    //socket.emit ('mi mensaje', 'ESte es un mensaje del servidor')

    socket.on('nuevoProducto', (producto)=> {
        var longitud = productos.length;
        console.log(longitud)
        producto.id= longitud+1
        productos.push(producto)
        escribir(productos);

        io.sockets.emit('nuevoProducto',productos)
        

    })
    //Nos suscribimos a un evento enviada desde el cliente

})


