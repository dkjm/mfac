# mfac
meeting facilation mvp workshop

## Running current version

```
git clone <repo url>
cd mfac
```

### API
#### Postgres
Start postgres service on your machine and create db called "mfac_dev". If you have postgres commands in your $PATH, you can simply do `createdb mfac_dev`

#### Start virtual environment for python
You need to create a virtual environment inside of api folder.  You should use a python interpreter >= 3.5.1.  Tested only with Python 3.5.1, but should work for everything newer.
```
cd api
virtualenv -p <path-to-your-preferred-python-3-interpreter> .
source bin/activate
```

#### Install dependencies
```
pip install -r requirements.txt
```

#### Migrate and generate fake data for testing
```
cd app
python manage.py migrateApp
python manage.py makeData
```
** Note: If you need to delete data and start over again, you can run `python manage.py deleteData` and then `python manage.py makeData` again.
Check out files in `core/management/commands` to see what commands are doing.

#### Start development server
```
python manage.py runserver
```

#### Admin
You should now be able to navigate to `http://localhost:8000/admin` in browser and have an interface for data.  Default admin username and pass are respectively: `admin asdf`

#### Run workers
If you want, you can fire up some Celery workers and simulate receiving periodic live updates on the client.  ** Note that the updates are just randomly chosen vote counts created in the `send_update` function in `tasks.py`.  If you cast a vote from the client while you're receiving the random live updates, the number you see will look wrong because you're still receiving random updates.

In one terminal run
```
celery -A tasks beat
```

In another terminal run
```
celery -A tasks worker --loglevel=info
```

For both of above commands, make sure you activate correct virtual environment using `source bin/activate` or `source ../bin/activate` depending what your pwd is.



### Client
#### Install dependencies and run dev server
```
cd web
yarn install
yarn start
```
