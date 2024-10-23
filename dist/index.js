"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const users = [
    { id: 1, username: 'Danvoo', fullname: 'Joel David' },
    { id: 2, username: 'Dancoren', fullname: 'Jose Daniel' },
    { id: 3, username: 'LDaroi', fullname: 'Jesus Dariel' }
];
let id_secuence = 3;
////////////////////////////////Obtener registros////////////////////////////////
app.get('/users', (request, response) => {
    response.json(users);
});
////////////////////////////////Filtrar por ID////////////////////////////////
app.get('/users/:id', (request, response) => {
    const id = parseInt(request.params.id);
    const user = users.find((u) => u.id === id);
    const userIndex = users.findIndex((u) => u.id === id);
    if (isNaN(id)) {
        response.status(400).json({
            statusCode: 400,
            statusValue: 'Bad Request',
            message: 'El id proporcionado no es válido. Debe ser un número.'
        });
    }
    if (userIndex === -1) {
        response.status(404).json({
            statusCode: 404,
            statusValue: 'Not Found',
            message: 'El usuario del id ' + id + ' no fue encontrado'
        });
    }
    response.json({
        statusCode: 200,
        statusValue: 'OK',
        data: user
    });
});
//////////////////////////////////Crear nuevo registro///////////////////////
app.post('/users', (request, response) => {
    const { username, fullname } = request.body;
    if (!username && !fullname) {
        response.status(400).send('Error 400: Los datos del usuario no están completos');
    }
    else if (!username) {
        response.status(400).send('Error 400: El username no puede estar vacío');
    }
    else if (!fullname) {
        response.status(400).send('Error 400: El fullname no puede estar vacío');
    }
    else { //hice todos estos else if porque el id_secuence se estaba incrementando aunque diera error
        const usuarioExistente = users.find(user => user.username === username);
        if (usuarioExistente) {
            response.status(400).send('Error 400: El username ya está en uso');
        }
        else {
            id_secuence += 1;
            const newUser = {
                id: id_secuence,
                username,
                fullname
            };
            users.push(newUser);
            response.status(201).json(newUser);
        }
    }
});
////////////////////////////////Actualizar los registros////////////////////////////////
app.put('/users/:id', (request, response) => {
    const id = parseInt(request.params.id);
    const userIndex = users.findIndex((u) => u.id === id);
    if (isNaN(id)) {
        response.status(400).json({
            statusCode: 400,
            statusValue: 'Bad Request',
            message: 'El id proporcionado no es válido. Debe ser un número.'
        });
    }
    if (userIndex === -1) {
        response.status(404).json({
            statusCode: 404,
            statusValue: 'Not Found',
            message: 'El usuario del id ' + id + ' no fue encontrado'
        });
    }
    const { username, fullname } = request.body;
    const updatedUser = {
        id,
        username,
        fullname
    };
    users[userIndex] = updatedUser;
    response.json({
        statusCode: 200,
        statusValue: 'OK',
        data: updatedUser
    });
});
////////////////////////////////Borrar los registros////////////////////////////////
app.delete('/users/:id', (request, response) => {
    const id = parseInt(request.params.id);
    const user = users.find((u) => u.id === id);
    const userIndex = users.findIndex((u) => u.id === id);
    if (isNaN(id)) {
        response.status(400).json({
            statusCode: 400,
            statusValue: 'Bad Request',
            message: 'El id proporcionado no es válido. Debe ser un número.'
        });
    }
    else if (userIndex === -1) {
        response.status(404).json({
            statusCode: 404,
            statusValue: 'Not Found',
            message: 'El usuario del id ' + id + ' no fue encontrado'
        });
    }
    else {
        users.splice(userIndex, 1);
        response.json({
            statusCode: 204,
            data: user
        });
    }
});
////////////////////////////////Configuracion de Puerto///////////////////////
const port = process.env.PORT || 5100;
app.listen(port, () => {
    console.log('Servidor corriendo en el puerto ' + port);
});
