#!/bin/sh
python manage.py flush --no-input
# python manage.py makemigrations
python manage.py migrate
# python manage.py loaddata fixtures.json
python manage.py createdefaultadmin
# python manage.py runserver 0.0.0.0:8000
python manage.py runserver