import express from 'express';
import fs from 'fs';

var app = express();

app.use (express.json())

let contenido;

async function leer(){
    try {
        if(!fs.existsSync("./productos.txt")){
            fs.writeFileSync('./productos.txt',"[]")
        } 
        contenido = await fs.promises.readFile("./productos.txt","utf-8");
    }
    catch (err) { 
        console.log('Se ha generado un error ')
    }
    };

leer();

const server = app.listen(8080, ()=>{
    console.log(`Servidor escuchando en el puerto ${server.address().port}`)
});

server.on("error", error => console.log(`Error en el servidor ${error}`))

var countItems=0;
var countItemRandom=0;

app.get('/items', (req, res)=>{
    console.log('request recibido');
    var product = JSON.parse(contenido);
    var cantidad = product.length;
    countItems ++;
    res.json({items : product, cantidad: cantidad})
})

app.get('/item-random', (req, res)=>{
    var product = JSON.parse(contenido);
    var cantidad = product.length;
    var productToSend = product[Math.trunc(Math.random()*cantidad-1)];
    countItemRandom++;
    res.json({item: {productToSend}})
})

app.get('/visitas', (req, res)=>{

    res.json({visitas: {items: countItems, item: countItemRandom}})
})
