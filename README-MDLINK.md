```mermaid
graph TD;
  INICIO(Inicio) --> insertRoute["Usuario ingresa la ruta 
  (path, option)"];
  insertRoute --> A{"La ruta 
  es válida?"};
  A --> B[Sí];
  A --> C[No];
  B --> D{"¿La ruta es 
  absoluta?  
  path.isAbsolute"};
  C --> E["Mensaje de error 
   throw new Error(errorMessage)"];
  D --> F[Sí];
  D --> G[No];
  G --> KK["Convertir a ruta 
  absoluta 
  path.resolve(route)" ] --> D;
  E --> FIN(Fin);
  F --> H{"¿La ruta es 
  un directorio?
  isDirectory(absolutePath)"};
  H --> I[Sí];
  H --> J[No];
  I --> K["Recorre directorios
   y subdirectorios
    para buscar archivo .md
    getMDFilesInDirectory(absolutePath)"]
  K --> L["Extraer archivos .md"] --> P
  J --> M{Hay archivo .md?};
  M --> N["Sí"];
  M --> O["No"];
  N --> P["Leer los archivos
  readMDFile(route)"];
  O --> LL["Mostrar un mensaje en consola
  throw new Error"]
  LL --> MMFIN(Fin);
  P --> Q["Analizar texto"]
  Q --> R{"¿Tiene Links?"};
  R --> S["Sí"];
  R --> T["No"];
  T --> U["Mensaje de error"]; 
  U --> VFIN(Fin);
  S --> W["Extraer links
  findLinksInMDText(fileContent, file)"];   
  W --> X["Status de links
  validateLinks(links)"];
  X --> Y{"¿Tiene opciones?"} -->|False| Z["Imprimir resultado en la consola"] --> VFIN(Fin) ;  
  Y{"¿Tiene opciones?
  mdLinks = (path, options)"} -->|True| AA{"---validate 
  &
   ---stats
   mdLinks(route, mdLinksOptions)"} ;  
  AA --> BB["Sí"];
  AA --> CC["No"];
  BB --> DD["Obtener respuesta
  de No. de links 
  totales Unicos, ok y fail"] --> Z;
  CC --> EE{"--validate
  else if (mdLinksOptions.validate)"}; 
  EE --> FF["Sí"];
  FF --> GG["Obtener respuesta del servidor del 
   status del link, ruta del archivo, 
   link y texto"]  --> Z
  EE --> HH["No"];
  HH --> II{"--stats"};
  II --> JJ["Contar el No. 
  de links Totales 
  y únicos"] --> Z
  


```