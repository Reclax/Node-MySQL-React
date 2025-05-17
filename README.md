

### Pasos para la Instalación

Veran solo tienen que seguir estos pasos:

1. Primero clonan el archivo **.env.template** y renombrar a **.env**, cambiaran dentro de los dos archivos el nombre de **JWT_SEED** a otra semilla em los videos dentro de la **Seccion04** el video **08**.


2. Luego instalan las dependencias, lo de siempre.
```bash
npm install
```

3. Luego levantan la base de datos con el comando
```bash
docker-compose up -d
```
- Si quieren ocupan el Mongo campass, ese toca instalar ahi les enseña en los videos, sino en cualquier otro gestor de base de datos.

4. Y ya para ejecutar el proyecto es con
```bash
npm run dev
```


