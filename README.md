# Next.js Teslo Shop
Para correr localmente, se necesita la base de datos.
```
docker-compose up -d
```

* El -d, significa __detached__

MongoDB URL Local:

```
mongodb://localhost:27017/telsodb
```

## Configurar las variables de entorno
Renombrar el archivo __.env.template__ a __.env__

* Reconstruir los módulos de node y levantar NextJS
```
yarn install
yarn dev
```


## Llenar la base de datos con información de pruebas

Llamara: 
```
    http://localhost:3000/api/seed
```