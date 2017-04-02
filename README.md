# researcher-api [![Build Status](https://travis-ci.org/Javirln/aws1617-02.svg?branch=master)](https://travis-ci.org/Javirln/aws1617-02)

Este repositorio contiene el código para la primera entrega de la asignatura "Aplicaciones Web basadas en Servicios" del Máster Universitario en
Ingeniería y Tecnología del Software de la Universidad de Sevilla. El grupo está compuesto por David José Corral Plaza, Francisco Javier Rodríguez 
León y Jesus Pardo Carrera.

![Main Interface](https://image.ibb.co/bNBgQa/Screen_Shot_2017_03_16_at_16_39_34.png)


## Tecnologías y dependencias

La API está desarrollada con [express](https://expressjs.com) y usa, entre otros, los siguientes modulos:

- [mongodb](https://www.mongodb.com/): para hacer persistentes todas las llamadas a la API.
- [morgan](https://github.com/expressjs/morgan): middleware para hacer logging de las llamadas HTTP.
- [nodemon](https://github.com/remy/nodemon): para durante el desarrollo poder reiniciar el servidor automáticamente cuando se produzca un cambio en los ficheros.
- [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc): para documentar los endpoints de la API.
- [swagger-iu-express](https://github.com/scottie1984/swagger-ui-express): para poder consultar la documentación de la API.
- [socket.io](https://github.com/socketio/socket.io): para refrescar automáticamente los campos de la página mediante el uso de sockets.
- [travis-ci](https://travis-ci.org): para la integración continua.
- [heroku](https://heroku.com): para el despliegue de la aplicación.
- Durante el desarrollo también se usan: [chai](http://chaijs.com/), 
  [chai-things](https://github.com/chaijs/chai-things),
  [chai-http](https://github.com/chaijs/chai-http),
  [grunt](https://gruntjs.com/),
  [grunt-contrib-jshint](https://github.com/gruntjs/grunt-contrib-jshint), 
  [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch),
  [grunt-mocha-test](https://github.com/pghalliday/grunt-mocha-test),
  [jwt-simple](https://github.com/hokaccha/node-jwt-simple),
  [mocha](https://mochajs.org/)

## Documentación

La API hace uso de dos módulos para poder ofrecer a los desarrolladores una interfaz sencilla donde consultar los endpoints y sus opciones.
Basta con acceder al recurso `/documentation` y veremos la siguiente ventana:
![Swagger UI](https://image.ibb.co/fTeF0a/Screen_Shot_2017_03_16_at_11_48_00.png)

Para poder consumir la API directamente desde la interfaz de usuario, hay que crear una variable de entorno 
con el nombre `SWAGGER_HOST` **sin el protocolo** apuntando a la URL desde donde vayamos a arrancar el servidor. 

Ejemplo:
```
export SWAGGER_HOST=localhost:3000
```
## Integración continua y despliegue con Docker

Todos los commits que se suban a la rama principal `master` arrancarán pruebas automáticas en [travis-ci](https://travis-ci.org)
y una vez pasadas, desplegará automáticamente la aplicación en [heroku](https://aws1617-02.herokuapp.com).

### Docker

Para poder desplegar la API usando un contendor de Docker hay que tener en cuenta algunos aspectos. El proyecto depende de variables de entorno para que se pueda ejecutar en cualquier sitio y sea facilmente configurable. Las variables que tiene son las siguientes:
1. `PORT_NUMBER`: donde podemos indicar en cuál puerto queremos que escuche nuestros servidor. Si no se le pasan parámetros, por defecto escuchará en el 3000.
2. `SWAGGER_HOST`: aunque la documentación se podrá consultar, para poder consumir la API desde la misma, hace falta configurar un host. Por defecto es `localhost`.
3. `MONGODB_URL`: la dirección donde estará escuchando la base de datos MongoDB.

Lo anterior resulta útil si vamos a desplegar el servidor en entornos remotos, donde por ejemplo no tengamos control sobre el puerto donde estará corriendo nuestro servicio y solo lo tengamos accesible a través de una variable de entorno que nos faciliten. 

Para el caso anterior lo único que tenemos que hacer es pasar por parámetros las variables de entorno que necesitemos usando el flag `--build-arg <varname>=<value>`. Ejemplo:

Primero, en el directorio raíz, creamos la imagen y pasamos el puerto por parámetros:
```
docker build --build-arg PORT_NUMBER=3000 .
```
Seguidamente ya creamos el contendor basandonos en la imagen recien creada:
```
docker run --name researcher-api -p 3000:3000 ID_IMAGEN
```
## Autentificación
El mecanismo para generar tokens es muy sencillo. Se basa en almacenar DNI's en una colección "tokens" de la base de datos MongoDB, estos
DNI's que estén presentes en dicha colección podrán obtener tokens de autentificación que serán válidos durante 14 días.

Para almacenar un DNI en dicha colección, haz uso del recurso `POST raíz (/)` enviando en el cuerpo del mensaje el DNI a registrar. Una vez
que el DNI esté en la colección, haz uso del recurso `POST /authenticate` enviando en el cuerpo del mensaje el DNI que está registrado
en la colección de la base de datos. Como respuesta recibirás un token válido.

## Desarrollo

Para poder empezar a desarrollar hay que seguir los siguientes pasos:
1. Clonar el repositorio
2. Exportar una variable de entorno que se llame `MONGODB_URL` que apunte a la dirección de la base de datos de Mongo
3. `npm install`
4. `npm run test`
5. `npm start`

## Testing

Para ejecutar los tests hay dos opciones:
1. `npm run test`
2. `grunt test`
