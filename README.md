# 

## Installation
Clone the repo and run ```npm install```

## Development
You can run the database in docker with the following commands:

```docker run --name db -d -e MYSQL_ROOT_PASSWORD=123 -p 3306:3306 mysql:latest```

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