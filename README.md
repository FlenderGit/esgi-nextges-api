# NextGes Web API

## 📜 Information
This application is a rest API for the NextGes application. It use Express and Typescript.

## Starting
Before all, install dependencies.
```bash
npm install
```

Create a `.net` file
```env
JWT_SECRET=myjwtsecret
DATABASE_URL=mongodb://root:password@localhost:27017/nextges?authSource=admin
PORT=3000
``` 

* Start the application as dev mode
```bash
npm run dev
```

* Start the application for production
```bash
npm run build
```

## 📘 Documentation
* [API Documentation](redoc-static.html)
* [API Endpoint Documentation](V1-API-technical-document.pdf)

## 🏗️ Application architecture
This project's architecture is based on the [Vertical Slice Architecture](https://www.milanjovanovic.tech/blog/vertical-slice-architecture) to simply add new functionnalities on the futur. Theremore, it is easier to move around the projet as a developper.

* **/src**
    * **/@types**: Add types within the Request type of Express
    * **/config**: Config for the **ENV** and **MongoDB**
    * **/entities**: Each entity **mongo schema**, **router** and **repository**
    * **/middleware**: My middleware for authentification and log
    * **/routes**: Routes that are not link to a entity
    * **app.ts**: The app
    * **server.ts**: The entrypoint of the application

* **/build**: This application use Typescript, so it should be compiled
