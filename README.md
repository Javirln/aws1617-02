# researcher-api [![Build Status](https://travis-ci.org/Javirln/researcher-api.svg?branch=master)](https://travis-ci.org/Javirln/researcher-api)

Este respositorio contiene el código para la primera entrega de la asignatura "Aplicaciones Web Basadas en Servicios" del master universitario en
Ingeniería y Tecnología Software de la Universidad de Sevilla.

## Tecnologías y dependencias

La API está desarrollada con [express](https://expressjs.com) y los siguientes modulos:

- [mongodb](https://www.mongodb.com/): para hacer persistentes todas las llamadas a la API
- [morgan](https://github.com/expressjs/morgan): middelware para hacer logging de las llamadas HTTP
- [nodemon](https://github.com/remy/nodemon): para durante el desarrollo poder reinicar el servidor automáticamente cuando se produzca un cambio en los ficheros
- [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc): para documentar los endpoints de la API
- [swagger-iu-express](https://github.com/scottie1984/swagger-ui-express): para poder consultar la documentación de la API
- [travis-ci](https://travis-ci.org): para la integración continua
- [heroku](https://heroku.com): para el despliegue de la aplicación
- Durante el desarrollo también se usan: [chai](http://chaijs.com/), 
  [chai-things](https://github.com/chaijs/chai-things), [grunt](https://gruntjs.com/), 
  [grunt-contrib-jshint](https://github.com/gruntjs/grunt-contrib-jshint), 
  [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch),
  [grunt-mocha-test](https://github.com/pghalliday/grunt-mocha-test),
  [mocha](https://mochajs.org/)

## Documentación

La API hace uso de dos modulos para poder ofrecer a los desarrolladores una interfaz sencilla donde consultar los endpoints y sus opciones.
Basta con acceder al recurso `/documentation` y veremos la siguiente ventana:
![Swagger UI](https://image.ibb.co/fTeF0a/Screen_Shot_2017_03_16_at_11_48_00.png)

Para poder consumir la API directamente desde la interfaz de usuario, hay que crear una variable de entorno 
con el nombre `SWAGGER_HOST` **sin el protocolo** apuntando a la URL desde donde vayamos a arrancar el servidor. 

Ejemplo:

    SWAGGER_HOST=localhost:3000

## Integración continua

Todos los commits que se suban a la rama principal `master` arrancarán pruebas automáticas en [travis-ci](https://travis-ci.org)
y una vez pasadas, desplegará automáticamente la aplicación en [heroku](https://researcher-api.herokuapp.com/)
## Desarrollo

Para poder empezar a desarrollar hay que seguir los siguientes pasos:
1. Clona el respositorio
2. `npm install`
3. `npm run test`
4. `npm start`
