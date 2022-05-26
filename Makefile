SHELL := /bin/bash

db:
	source env.sh \
		&& invenio db init create

index:
	source env.sh \
		&& invenio index init

reindex:
	source env.sh \
		&& invenio index destroy --yes-i-know \
		&& invenio index init \
		&& invenio rdm-records fixtures \
		&& invenio rdm-records rebuild-index

fixtures:
	source env.sh \
		&& invenio rdm-records fixtures \
		&& invenio rdm-records rebuild-index

files:
	source env.sh \
		&& invenio files location create --default default-location /opt/invenio/var/instance/data

roles:
	source env.sh \
		&& invenio roles create admin \
		&& invenio access allow superuser-access role admin

destroy:
	source env.sh \
		&& invenio db destroy --yes-i-know \
		&& invenio index destroy --force --yes-i-know

worker:
	source env.sh \
		&& celery --app invenio_app.celery worker --loglevel INFO

server:
	source env.sh \
		&& invenio run \
			--cert docker/nginx/test.crt --key docker/nginx/test.key \
			--with-threads \
			--reload \
			--debugger \
			--host 192.168.15.252 \
			--port 5000

user:
	source env.sh \
		&& invenio users create email@mail.org --password=123456 --active \
		&& invenio roles add email@mail.org admin \
		&& invenio tokens create --name gkhub-ingest --user email@mail.org \
		&& invenio users create email2@mail.org --password=123456 --active \
		&& invenio tokens create --name gkhub-ingest --user email2@mail.org

start: db roles files index fixtures
finish: destroy
