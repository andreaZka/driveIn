import os
basedir = os.path.abspath(os.path.dirname(__file__))


class CONFIG(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'prova12'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
