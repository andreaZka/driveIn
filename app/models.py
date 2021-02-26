from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from app import login
from datetime import datetime


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    tickets = db.relationship('Biglietto', backref='utente', lazy='dynamic')

    def __repr__(self):
        return '<User {}>'.format(self.username)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Cinema(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.String(64), unique=True)
    n_posti = db.Column(db.Integer, nullable=True)
    programmazione = db.relationship('Evento', backref='theatre', lazy='dynamic')

    def __repr__(self):
        return '<Cinema {}>'.format(self.address)


class Evento(db.Model):
    id_evento = db.Column(db.Integer, primary_key=True)
    id_film = db.Column(db.Integer, index=True) #id del film relativo all'API
    titolo = db.Column(db.String, index=True) #titolo film
    orario = db.Column(db.DateTime, index=True, default=datetime.utcnow) #orario programmazione evento
    sold_out = db.Column(db.Boolean(), default=False)
    id_cinema = db.Column(db.Integer, db.ForeignKey('cinema.id')) #ogni evento è collegato ad un cinema
    biglietti = db.relationship('Biglietto', backref='proiezione', lazy='dynamic')
    def __repr__(self):
        return '<Evento {}>'.format(self.titolo)


class Biglietto(db.Model):
    id_ticket = db.Column(db.Integer, primary_key=True)
    evento_id = db.Column(db.Integer, db.ForeignKey('evento.id_evento'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id')) #ogni biglietto è collegato ad un account
    posto = db.Column(db.Integer, index=True, nullable=True)
    ordini = db.relationship('Ordine', backref='ticket', lazy='dynamic')

class Ordine(db.Model):
    id_ordine = db.Column(db.Integer, primary_key=True)
    acquisti = db.Column(db.String)
    ticket_id = db.Column(db.Integer, db.ForeignKey('biglietto.id_ticket'))


@login.user_loader
def load_user(id):
    return User.query.get(int(id))
