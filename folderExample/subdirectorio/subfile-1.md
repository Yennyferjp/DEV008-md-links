
- [ ] **Códigos de status de HTTP**

  <details><summary>Links</summary><p>

  * [Códigos de estado de respuesta HTTP - MDN](https://developer.mozilla.org/es/docs/Web/HTTP/Status)
  * [The Complete Guide to Status Codes for Meaningful ReST APIs - dev.to](https://dev.to/khaosdoctor/the-complete-guide-to-status-codes-for-meaningful-rest-apis-1-5c5)
</p></details>

## 4. Consideraciones generales

* Este proyecto se debe "resolver" de manera individual.

* El rango de tiempo estimado para completar el proyecto es de 4 a 5 Sprints.

* La **librería** y el **script ejecutable** (herramienta de línea de comando -
  CLI) deben estar implementados en JavaScript para ser ejecutados con
  Node.js. **Está permitido usar librerías externas**.

* Tu módulo **debe ser instalable** via `npm install <github-user>/md-links`. Este
  módulo debe incluir tanto un _ejecutable_ que podamos invocar en la línea de
  comando como una interfaz que podamos importar con `require` para usarlo
  programáticamente.

* Los **tests unitarios** deben cubrir un mínimo del 70% de _statements_,
  _functions_, _lines_ y _branches_. Te recomendamos explorar [Jest](https://jestjs.io/)
  para tus pruebas unitarias.