# How to run this project?
## Set environment varaibles
On Linux:
```
export ADMIN_PASSWORD='<your_password>'
export SECRET_KEY='<your_secret_key>'
```
or generate random key (Python 3.6+):
```
export SECRET_KEY=`python -c "import secrets; print(secrets.token_urlsafe())"`
```

Project generates admin account with password given in env variable.

## Run docker compose command
### Run version without volumes:
```
docker-compose up
```
Or using docker-compose-plugin:
```
docker compose up
```
### Or run dev version (with volumes):
```
docker-compose -f docker-compose.dev.yml up
```
Or using docker-compose-plugin:
```
docker compose -f docker-compose.dev.yml up