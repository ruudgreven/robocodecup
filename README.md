# 

## Installation
Clone the repo and run ```npm install```

## Development
You can run the database in docker with the following commands:


```docker run --name robocodecup-mongo -p 27017:27017 -d mongo```
``````

## API
### GET /team.json
List all teams

#### Example output
```
{
    "status": "ok",
    "response": [
        {
            "name": "USEB 2016",
            "id": "1"
        }
    ]
}
```
