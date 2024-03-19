## Router-app

A simple router-app that handles incoming events and routes them to one or multiple destinations via specific transports according to routing strategy.
To receive an event app exposes a simple HTTP-endpoint, whereto authorized clients may send HTTP-requests. List of available destinations and strategy are stored in a database and change dynamically.
Each event may override strategy by specifying desired strategy name (or custom strategy source code) in a request params.

## Getting Started

To run the application, you will need Docker and Docker Compose installed.

1. **Clone the repository**: First, clone this repository to your local machine:

   ```bash
   git clone https://github.com/Sergei-Sazonov/router-app.git
   ```

2. **Navigate to the project directory**: Change into the project directory:

   ```bash
   cd <directory-name>
   ```

3. **Before running the application, add a file with the following values to the .env root**

   ```bash
   PORT=3000
   JWT_SECRET_KEY=pHnsjkLuijnalEEs
   SALT=10
   BYTES=1024
   JWT_EXPIRE=1h
   ATLAS_URI=mongodb://mongodb:27017/routerApp
   ```

4. **Run the application using Docker Compose**: Execute the command to run Docker Compose, which will automatically create and configure containers for your application and database:
   ```bash
   docker-compose up --build
   ```

This command will start your application and MongoDB.

Check the application: After successful startup, you can check if your application is running by visiting http://localhost:3000 in your web browser.

The application has a simplified authorization system. First, register a new user, log in using the new user, and using the received token, you can make requests for other endpoints.

Register URL
Method: POST

```bash
http://localhost:3000/register
```

Body example for register

```bash
{
    "name": "user",
    "email": "user@gmail.com",
    "password": "user"
}
```

Login URL
Method: POST

```bash
http://localhost:3000/login
```

Body example for login

```bash
{
    "email": "user@gmail.com",
    "password": "user"
}
```

Event URL
Method: POST

```bash
http://localhost:3000/events
```

Body examples for strategy requests:

**ALL**

```bash
{
 "payload": {
     "a": 1,
     "b": 2,
     "c": 3
 },
 "routingIntents": [
     {
         "destinationName": "destination1"
     },
     {
         "destinationName": "destination2"
     },
     {
         "destinationName": "destination3"
     },
     {
         "destinationName": "destination4"
     },
     {
         "destinationName": "destination5"
     }
 ],
 "strategy": "ALL"
}
```

**IMPORTANT**

```bash
{
    "payload": {
        "a": 1,
        "b": 2,
        "c": 3
    },
    "routingIntents": [
        {
            "destinationName": "destination1",
            "important": true
        },
        {
            "destinationName": "destination2",
            "important": false
        },
        {
            "destinationName": "destination3",
            "important": true
        },
        {
            "destinationName": "destination4",
            "important": false
        },
        {
            "destinationName": "destination5",
            "important": true
        }
    ],
    "strategy": "IMPORTANT"
}
```

**SMALL**

```bash
{
    "payload": {
        "a": 1,
        "b": 2,
        "c": 3
    },
    "routingIntents": [
        {
            "destinationName": "destination1",
            "bytes": 128
        },
        {
            "destinationName": "destination2",
            "bytes": 2048
        },
        {
            "destinationName": "destination3",
            "bytes": 4048
        }

    ],
    "strategy": "SMALL"
}

```

**CUSTOM**

```bash
{
    "payload": {
        "a": 1,
        "b": 2,
        "c": 3
    },
    "strategy": "function onlyNegativeScore(routingIntents) { return routingIntents.filter(intent => intent?.score < 0); }",
    "routingIntents": [
        {
            "destinationName": "destination1",
            "score": 1
        },
        {
            "destinationName": "destination2",
            "score": -1
        },
        {
            "destinationName": "destination3",
            "score": 0
        },
        {
            "destinationName": "destination4",
            "score": -1
        },
        {
            "destinationName": "destination5",
            "score": 1
        }
    ]
}

```

Stop the application: To stop the application and all associated containers, run the command:

```bash
docker-compose down
```
