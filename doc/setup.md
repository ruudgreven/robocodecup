
# Installation

## Prerequisites
1. A VPS with node.js and  mongo
2. (Optional) Install pm2: ```npm install pm2 -g```

# Steps
1. Clone repo.
2.a. Install modules: ```npm install```
2.b. Create directory uploads/admin.
3. Edit conf/config.js and update the robocode admin password.
4. Run app (```pm2 start app.js```)
5. Goto <url>/web/#!/admin and login to the admin backend.
6. Create a competition.
7. Refresh page to see the created competition (upper right corner).
8. Upload teams using a team.json file.


Export existing database:
```
mongodump -d <database_name> -o <directory_backup>
```

Restore the database (from directory_backup/dump/):
```
mongorestore -d <database_name> <directory_backup>
```