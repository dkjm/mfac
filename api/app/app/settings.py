import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '^9=*noxf3%v#a55228uw*n&9obkh@c1gdwx+t2#vy0c@@$g-e+'
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition
INSTALLED_APPS = [
    'core',
    'app_users',
    'meetings',
    'oauth2_provider',
    'corsheaders',
    'rest_framework',

    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'channels',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'app.urls'

WSGI_APPLICATION = 'app.wsgi.application'

DATABASES = {
  'default': {
    'ENGINE': 'django.db.backends.postgresql_psycopg2',
    'NAME': 'mfac_dev',
    #'USER': 'postgres',
    #'HOST': 'db',
    'PORT': 5432,
    'ATOMIC_REQUESTS': True,
  }
}

TEMPLATES = [
  {
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [],
    'APP_DIRS': True,
    'OPTIONS': {
      'context_processors': [
        'django.template.context_processors.debug',
        'django.template.context_processors.request',
        'django.contrib.auth.context_processors.auth',
        'django.contrib.messages.context_processors.messages',
      ],
      'debug': DEBUG,
    },
  },
]


# Password validation
# https://docs.djangoproject.com/en/1.10/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# CUSTOM
# Cors config
CORS_ORIGIN_ALLOW_ALL = True

# this allows cookie being passed cross domain    
CORS_ALLOW_CREDENTIALS = True 

CORS_ALLOW_HEADERS = (
  'x-requested-with',
  'content-type',
  'accept',
  'origin',
  'authorization',
  'x-csrftoken',
  'bearer',
)

REST_FRAMEWORK = {
  'DEFAULT_PERMISSION_CLASSES': (
    # 'rest_framework.permissions.IsAuthenticated',
  ),
  'DEFAULT_AUTHENTICATION_CLASSES': (
    #'rest_framework.authentication.TokenAuthentication',
    #'rest_framework.authentication.SessionAuthentication',
    #'rest_framework.authentication.BasicAuthentication',
    #'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
    #'oauth2_provider.ext.rest_framework.OAuth2Authentication',
  ),
  'DEFAULT_PARSER_CLASSES': (
    'rest_framework.parsers.JSONParser',
    'rest_framework.parsers.FormParser',
    'rest_framework.parsers.MultiPartParser',
  ),
}


# Internationalization
# https://docs.djangoproject.com/en/1.10/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.10/howto/static-files/

STATIC_URL = '/static/'



# Channels config
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "asgi_redis.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("localhost", 6379)],
        },
        "ROUTING": "app.routing.channel_routing",
    },
}



REDIS_URL = 'redis://localhost:6379/0'