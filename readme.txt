Per prima cosa recarsi nella cartella project tramite terminale e attivare virtual environment con comando Linux:
$ source venv/bin/activate

A quel punto installare flask con:
$pip install Flask

Installarre i moduli flask necessari al funzionamento tramite:
pip install -r requirements.txt

Se stai usando Python 2 installare anche il modulo per virtual environment con:
$ sudo apt-get install python-virtualenv

Una volta completate le installazioni digitare il seguento comando:
$flask run

e nel browser recarsi all'indirizzo:
http://127.0.0.1:5000/
