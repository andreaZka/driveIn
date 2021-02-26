# driveIn

Per prima cosa recarsi nella cartella scaricata tramite terminale e creare un virtual envoirment tramite:
$ python3 -m venv venv

attivare virtual environment con comando Linux:
$ source venv/bin/activate

A quel punto installare flask con:
$pip install Flask

Installarre i moduli flask necessari al funzionamento tramite:
$pip install -r requirements.txt

Se stai usando Python 2 installare anche il modulo per virtual environment con:
$ sudo apt-get install python-virtualenv

Una volta completate le installazioni digitare il seguento comando:
$flask run

se si presenta un messaggio con scritto:
no module flask_login riavviare il terminale

e nel browser recarsi all'indirizzo:
http://127.0.0.1:5000/
