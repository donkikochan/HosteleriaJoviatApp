# Restaurant Alumni App

Una aplicación móvil para mostrar restaurantes donde trabajan alumnos y exalumnos de la carrera de hosteleria de la Escuela Joviat- Manresa. Los usuarios pueden ver la información del restaurante y detalles de los alumnos/exalumnos que trabajan allí. La aplicación ofrece una experiencia más completa a los usuarios registrados.

## Índice

1. [Descripción](#descripción)
2. [Instalación](#instalación)
3. [Uso](#uso)
4. [Características](#características)
5. [Tecnologías](#tecnologías)
6. [Estructura del Proyecto](#estructura-del-proyecto)
7. [Contribuciones](#contribuciones)
8. [Pruebas](#pruebas)
9. [Despliegue](#despliegue)
10. [Autores](#autores)
11. [Licencia](#licencia)
12. [Reconocimientos](#reconocimientos)

## Descripción

Hoteleria Joviat App  es una aplicación diseñada por alumenos del segundo año del grado superior en informatica para conectar a los usuarios con restaurantes donde trabajan alumnos y exalumnos de nuestra institución de hotelería. Los usuarios que descargan la app pueden explorar los restaurantes y obtener información detallada sobre los empleados, con la posibilidad de acceder a más detalles mediante el inicio de sesión. Esta login es solo posible para los alumnos y ex alumnos que seran previamente cargados a la base de datos y creados los usarios por la administracion de la institucion a traves de la pagina creada para el mismo fin. 

## Instalación

### Requisitos previos

- Node.js (v14 o superior)
- Expo CLI (última versión)
- Git

### Pasos

1. Clona el repositorio:
    ```bash
    git clone https://github.com/tu-usuario/restaurant-alumni-app.git
    ```
2. Instala las dependencias:
    ```bash
    cd restaurant-alumni-app
    npm install
    ```
3. Inicia la aplicación:
    ```bash
    npx expo start
    ```

## Uso

Para ejecutar la aplicación en tu dispositivo o emulador:
```bash
npx expo start
Escanea el código QR con la aplicación Expo Go o inicia en un emulador desde la consola.


Características
*Exploración de restaurantes: Ver la lista de restaurantes donde trabajan alumnos y ex alumnos en dos modalidades, una version lista o otra version donde se puede ver la ubicacion de los restaurantes (al tocar  en ellos podras ir al restaurante de la misma manera que lo haces desde el modo lista), tambien en esta busqueda lo puedes hacer desde la lupa filtrando por restaurantes.

*Información detallada: Acceder a detalles del restaurante  donde podra leer una breve descripcion , visitar la pagina web, telefono y ubicacion y ademas poder ver la lista los empleados que pasaron o estan en joviat Hosteleria, de aqui podra acceder a la informacion de cada alumno/ex alumno para poder ver la informacion del mismo, la diferencia seria que si esta viendo la app en modo random o en modo usuario ya que con la segunda opcion podra ver informacion mas sensible que la de la version random. 

*Autenticación: Inicio de sesión para ver información completa de los alumnos/exalumnos como se completo anteriormente pero tambien podra acceder a un perfil donde podra modificar su informacion personal como la imagen de usuario, nombre con el que quiere ser visible en la app y su fecha de nacimiento.

*Funcion de favoritos: los usuarios en ambas versiones podran hacer uso de la funcion de guardar en favoritos los restaurantes que destaquen a su gusto y tenerlos ahi almacenados paratener mas facil el acceso sin necesidad de buscar entre todos los restaurantes.

*Modo sin conexión: Navegación básica sin necesidad de iniciar sesión.

*seccion de About Us: donde se podra ver el restaurante de la escuela Joviat y tambien la informacion de los alumnos que llevaron a cabo el desarrollo de la app durante el proyecto de sintesis del segundo año de informatica 2024.


Tecnologías
React Native: Desarrollo de la interfaz móvil.
Expo: Plataforma para ejecutar y construir la aplicación asi facilitar el poder ver como se ve en los dispositivos con distintos sistemas operativos (Android y IOS).
Firebase: Autenticación y base de datos para alamcenar los usuarios y restaurantes.
Axios: Para realizar peticiones HTTP.


Estructura del Proyecto
css
Copiar código
restaurant-alumni-app/
│
├── assets/
│   └── images/
│       └── logo.png
├── src/
│   ├── components/
│   │   ├── RestaurantCard.js
│   │   └── UserProfile.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   ├── LoginScreen.js
│   │   └── RestaurantDetailScreen.js
│   ├── services/
│   │   └── api.js
│   └── App.js
├── .gitignore
├── app.json
├── package.json
└── README.md


Reconocimientos
Agradecimientos a los profesores de la institución por su apoyo.
Inspirado por Nombre de Otro Proyecto.
Copiar código

Puedes ajustar este ejemplo según las necesidades específicas de tu proyecto y asegurarte de incluir capturas de pantalla, enlaces y cualquier otro detalle relevante para que tu documentación sea completa y útil.
