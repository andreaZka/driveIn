from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired, ValidationError, Email, EqualTo
from app.models import User

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    ricordami = BooleanField('Ricordami')
    submit = SubmitField('Accedi')


class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    passConfirm = PasswordField('Conferma password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Registrati')

    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first() #controllo se esiste già nel database questo usernam
        if user is not None: #se l'user viene trovato quello inserito è gia in uso
            raise ValidationError('Username già in uso') #lo avviso all'utente

    def validate_email(self, email):
        mail = User.query.filter_by(email=email.data).first()
        if mail is not None:
            raise ValidationError('Email già in uso')


