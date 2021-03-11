var fs = require('fs');
var express = require('express');

var app = express();

app.use(express.json());

const server = app.listen(8080, () =>{
    console.log(`Escuchando en el puerto ${server.address().port}`)
})

server.on("error", (error) => console.log(`Se produjo un error: ${error}`))

let productos;

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

app.get('/api/productos/listar',(req, res)=>{
    console.log('request recibido');
   // var longitud = productos.length;
   if ( JSON.stringify(productos) === '[]'){
    res.json ({error:'no hay productos cargados'})
   } else {
    res.json({items: productos})
   }   
})

app.get('/api/productos/listar/:id',(req, res)=>{
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

app.post('/api/productos/guardar/',(req,res)=>{
    const producto = req.body;
    var longitud = productos.length;
    producto.id= longitud+1;
    productos.push(producto);
    escribir(productos);
    res.json({items: productos})
})