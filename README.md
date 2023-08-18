<div id="back"></div>
<br/>
<div align="center">

<img src="./logo/yennjp-md-link-Logo.png" alt="Logo yennjp-md-link" width="160px">

 <br/>

<b>Author</b>
<br/>
[Yennyfer Jarava Pérez](https://github.com/Yennyferjp) <br/>

<p align="center">
       </summary>
    <br/>
    <a href="https://github.com/Yennyferjp/DEV008-md-links" target="_blank"><strong>Acceder a la documentación »</strong></a>
    <br/>
     <a href="https://www.npmjs.com/package/yennjp-md-links" target="_blank"><strong>Acceder al despliegue »</strong></a>
    <br/>
  </p>
</div>


## Índice

* [1. Sobre el proyecto](#1-sobre-el-proyecto)
* [2. Instalación](#2-instalación)
* [3. Uso](#3-uso)
* [4. Demo](#4-demo)
* [5. Licencia](#5-licencia)
* [6. Referencias](#6-referencias)

***

## 1. Sobre el proyecto
 <br/>

<summary>¿Qué hace nuestra librería? ¡Buena pregunta! Imagínese una herramienta minuciosa que explora sus archivos Markdown en busca de enlaces, los evalúa a fondo y le proporciona un informe detallado sobre su validez y estado. ¡Diga adiós a los enlaces rotos que empañan su contenido!

Nuestra librería, impulsada por Node.js, no solo tiene la habilidad de detectar enlaces quebrados, sino que también le brinda estadísticas claras y concisas, permitiéndole tomar decisiones informadas sobre la integridad de sus enlaces. ¡Es como contar con su propio guardián personal de enlaces!

No deje que los enlaces rotos obstaculicen su trabajo. Únase a nosotros y descubra cómo nuestra librería puede elevar su experiencia en Markdown a niveles sin igual. ¡Es hora de tomar el control de la calidad de sus enlaces y destacar en la comunidad de código abierto! ⚡️ No pierda esta oportunidad.</summary>
 <br/>


### Lenguaje de programación

- [Javascript](https://www.javascript.com/)

 <br/>

## 2. Instalación
 <br/>

<summary>Para instalar el paquete, use el siguiente comando::</summary>

``` npm i yennjp-md-links ```
 <br/>

## 3. Uso
 <br/>

<summary>Nuestro paquete presenta una interfaz sencilla pero potente:</summary>
 <br/>

``` md-links <path> [options] ```

Donde ```<path>``` corresponde a la ruta, ya sea absoluta o relativa, del archivo o directorio que deseas analizar y ```[options]``` ofrece la flexibilidad de personalizar la salida según tus necesidades.
 <br/>

### Options:

```--validate o --v```
 <br/>
 
Si optas por incluir esta opción ```--validate o --v``` , el paquete realizará una solicitud <b>HTTP</b> para verificar la validez de cada enlace. 
<br><br>
<b>¿Cómo logra esto?</b> Si el enlace es redirigido a una URL que responde con un estado "ok", se certifica como un enlace válido. Los pormenores detallados sobre el estado de la respuesta HTTP serán exhibidos en la salida.

```--stats o --s```
 <br/>

En caso de habilitar esta opción ```--stats o --s``` , el resultado presentará <b>estadísticas fundamentales</b> acerca de los enlaces detectados en el archivo. Se mostrará tanto la cantidad total de enlaces hallados como el número de enlaces únicos.
<br/>

```--validate --stats```
 <br/>

Si <b>ambas opciones</b> son seleccionadas, el resultado incluirá estadísticas sobre los enlaces encontrados, incluyendo la cantidad de enlaces que se encuentran rotos (es decir, aquellos que no responden con "ok" al realizar una solicitud HTTP). Además, en la salida obtendrás la línea exacta donde se encuentra cada enlace.
 <br/>

 ### Ejemplos de uso
 <br/>
 
``` md-links file.md ```
 <br/>
Analiza el archivo ```file.md ``` y muestra los enlaces encontrados, junto con la ruta del archivo y el texto vinculado.
 <br/>
 
``` md-links directory/ ``` 
 <br/>
Examina todos los archivos Markdown en ``` directorio/```  y sus subdirectorios, y despliega los enlaces descubiertos en la consola.
 <br/>

``` md-links file.md --validate ``` 
 <br/>
Verifica los enlaces en el archivo ```file.md ``` y muestra información detallada, incluida la ruta del archivo, el texto del enlace y el estado de la respuesta HTTP al realizar una solicitud.
 <br/>
 
``` md-links file.md --stats ``` 
 <br/>
Muestra estadísticas básicas sobre los enlaces en ```file.md ```, incluyendo el número total de enlaces y la cantidad de enlaces únicos.
 <br/>
 
``` md-links file.md --validate --stats ``` 
 <br/>
Proporciona estadísticas más detalladas sobre los enlaces en ```file.md ```, incluyendo el número total de enlaces, la cantidad de enlaces únicos y la cantidad de enlaces rotos.
 <br/>

 ## 4. Demo
 <br/>
https://www.youtube.com/watch?v=g-zjZYMIMPA

## 5. Licencia
 <br/>
<summary>Este paquete tiene la licencia MIT.</summary>

## 6. Referencias
 <br/>

- [Node - Docs](https://nodejs.org/es/docs)
- [npm](https://www.npmjs.com/)
- [Jest - Getting Started](https://jestjs.io/docs/getting-started)
- [MDN WebDocs](https://developer.mozilla.org/en-US/)

 <br/>


<p align="left"><a href="#back">Back</a></p>
