"""
Django settings for core project.
"""
import os
from pathlib import Path
import dj_database_url
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# ====================================================
# CORE SETTINGS
# ====================================================

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
# We check if the string "True" is in the .env file (Local = True, Render = False usually)
DEBUG = os.getenv('DEBUG') == 'True'

# Allow Render and Localhost to host the app
ALLOWED_HOSTS = ['*']


# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # 3rd Party
    'rest_framework',
    'corsheaders',

    # My App
    'api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',                     
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',                
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',    
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'


# ====================================================
# DATABASE (SQLite Locally, Postgres on Render)
# ====================================================
DATABASES = {
    'default': dj_database_url.config(
        default='sqlite:///db.sqlite3',
        conn_max_age=600
    )
}


# ====================================================
# AUTHENTICATION
# ====================================================
AUTH_PASSWORD_VALIDATORS = [
    { 'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator', },
]

# Tell Django to use my custom User model 
AUTH_USER_MODEL = 'api.User'


# ====================================================
# INTERNATIONALIZATION
# ====================================================
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# ====================================================
# STATIC FILES (CSS, JavaScript, Images)
# ====================================================
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'


# ====================================================
# SECURITY & PRODUCTION CONFIG
# ====================================================

# CORS
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://skillbarter-webapp.onrender.com",
]

# CSRF
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "https://skillbarter-webapp.onrender.com",
]

# Hosts
ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    "skillbarter-backend-5i7n.onrender.com",
]

# ============================
# COOKIE CONFIG
# ============================

if DEBUG:
    # Local development
    CSRF_COOKIE_DOMAIN = None
    SESSION_COOKIE_DOMAIN = None

    CSRF_COOKIE_SECURE = False
    SESSION_COOKIE_SECURE = False
else:
    # Production (Render)
    CSRF_COOKIE_DOMAIN = ".onrender.com"
    SESSION_COOKIE_DOMAIN = ".onrender.com"

    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_SECURE = True

CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_SAMESITE = "None"
SESSION_COOKIE_SAMESITE = "None"

# ============================
# PROXY / HTTPS
# ============================

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Only force HTTPS in production
SECURE_SSL_REDIRECT = not DEBUG


# ====================================================
# DJANGO REST FRAMEWORK
# ====================================================

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
}
