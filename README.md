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
If you want, you can fire up some Celery workers and simulate receiving periodic live updates on the client.  ** Note celery tasks may or may not work.  Need to retest with new API - MPP - 180203.

In one terminal run
```
celery -A tasks beat
```

In another terminal run
```
celery -A tasks worker --loglevel=info
```

For both of above commands, make sure you activate correct virtual environment using `source bin/activate` or `source ../bin/activate` depending what your pwd is.

### ExApi
#### Postgres
Start postgres service on your machine and create db called "ex_mfac_dev". If you have mix installed you can run `mix ecto.create`

#### Install dependencies
```
mix do deps.get
```

#### Migrate and generate fake data for testing
```
mix ecto.migrate
mix escripts.build()
./mfac --makedata [MODEL_NAME] 
```
** Note: Seeding functions with relationships are still being worked on, so atm, the data wont have associations. If you need to delete data and start over again, you can run `./mfac deletedata [MODEL_NAME]`

#### Start development server
```
mix phx.server
```

Or, alternatively with an inline repl
```
iex -S mix phx.server
```

** Note: The api is not returning data in the structure expected by the client side app atm. This is actively being resolved. 

### Client
#### Install dependencies and run dev server
```
cd web
yarn install
yarn start
```

#### Login and mess around
You can login with username and password: Blade asdf
Try opening up an incognito window and login with a different user (user django admin interface to find a user, all passwords are asdf), sending an invitation from the first user to the second user, and going from there.


