from app import app
from flask import render_template, flash, redirect, url_for, session, make_response, request, jsonify, json
from app.forms import LoginForm
from flask_login import current_user, login_user
from app.models import User, Cinema, Evento, Biglietto, Ordine
from flask_login import logout_user
from app import db
from app.forms import RegistrationForm
from flask_login import login_required
from json import dumps
from sqlalchemy import and_, or_, not_

@app.route('/')
@app.route('/home')
def home():
    return render_template('home.html')


@app.route('/login', methods=['GET', 'POST'])  # indica di accettare anche le richieste post utilizzate
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = LoginForm()
    if form.validate_on_submit():  # inoltre quando il browser invia una richiesta get per ricevere il webform la
        # funzione ritorna falso e si viene reinderizzati al render_template, quindi alla pagina di login
        # anche quando dopo la compilazione del form viene premuto il tasto submit e si invia una richiesta post ma un
        # campo è errato la funzione ritorna false e anche in questo caso si viene reindirizzati di nuovo a login.html
        user = User.query.filter_by(
            username=form.username.data).first()  # first ritorna l'user se esiste none altrimenti
        if user is None or not user.check_password(
                form.password.data):  # se l'user non è stato trovato (None) oppure non è stata trovata la password(not)
            flash('Invalid username or password')
            return redirect((url_for('login')))  # ricarico la pagina di login
        login_user(user,
                   remember=form.ricordami.data)  # registro l'utente come loggato e lo ricordo se spunto il campo ricordami
        return redirect(url_for('home'))
    return render_template('login.html', form=form)


@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('home'))


@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        redirect(url_for('home'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Registrazione completata, benvenuto in Corona Drive In!')
        return redirect(url_for('login'))
    return render_template('register.html', form=form)


@app.route('/srcFilm', methods=["GET"])
def srcFilm():
    return render_template('srcFilm.html')


@app.route('/filmView/<string:idFilm>', methods=['GET', 'POST'])
def filmView(idFilm):
    cinema_evento = Evento.query.filter_by(
        id_film=idFilm).order_by(
        Evento.orario).all()  # ritorna tutte le proiezioni di quel film

    soldOut = [] #eventi sold out
    for i in cinema_evento:
        if i.sold_out == True:
            soldOut.append(i)

    eventDisp = [] #eventi disponibili
    for j in cinema_evento:
        if j.sold_out == False:
            eventDisp.append(j)

    if request.method == "POST":
        eventi_array = []
        for i in cinema_evento:
            eventi_json = {
                'idEvento': cinema_evento.id_evento
            }
            eventi_array.append(eventi_json)

        return make_response(dumps(eventi_array))

    return render_template('filmView.html', eventDisp=eventDisp, soldOut=soldOut )


@app.route('/getEvents/<string:idFilm>', methods=['GET', 'POST'])
def getEvents(idFilm):
    events = Evento.query.filter_by(
        id_film=idFilm).order_by(
        Evento.orario).all()  # ritorna tutte le proiezioni di quel film
    events_json = []
    for i in events:
        el_json = {
            'id_evento' : i.id_evento,
            'id_film': i.id_film,
            'titolo': i.titolo,
            'orario': i.orario.isoformat(),
            'sold_out': i.sold_out,
            'cinema' : i.theatre.address
        }
        events_json.append(el_json)

    return make_response(dumps(events_json))


@app.route('/abc', methods=["POST"])
def abc():
    if request.method == "POST":
        qry = Evento.query.get(1)

        jsonE = {
            'film': qry.id_film
        }
        return make_response(dumps(jsonE))


@app.route('/srcFilmResult')
def srcFilmResult():
    return render_template('srcFilmResult.html')


@app.route('/<id_film>/selectSeat/<id_event_chosen>')
@login_required
def selectSeat(id_film,id_event_chosen):
    return render_template("selectSeat.html")


@app.route('/get_seat/<int:id_event_chosen>')
def getl(id_event_chosen):
    ticket_qry = Biglietto.query.filter_by(evento_id=id_event_chosen).all()
    event_qry = Evento.query.filter_by(id_evento=id_event_chosen).first()
    if not ticket_qry: #se non c'è nessun biglietto passo solo il numero di posti
        el_json = {
            'MAXposti': event_qry.theatre.n_posti,
            'full_free': True
        }
        return make_response(dumps(el_json))
    else:
        posti_occupati = []
        for i in ticket_qry:
            json_el = {
                'posto': i.posto,
                'MAXposti': event_qry.theatre.n_posti,
                'full_free': False
            }
            posti_occupati.append(json_el)

        return make_response(dumps(posti_occupati))


@app.route('/buyTicket/<int:id_event_chosen>/<int:num_posto>')
@login_required
def buyTicket(id_event_chosen, num_posto):  # ottengo dall'url id evento del biglietto che vado ad acuistare e il posto
    evento = Evento.query.filter_by(
        id_evento=id_event_chosen).first()  # ottengo l'evento per cui sto andando ad acquistare il biglietto
    loggedUsr = User.query.filter_by(
        id=current_user.get_id()).first()  # ottengo l'user loggato come oggetto dal databse
    ticket = Biglietto(proiezione=evento, utente=loggedUsr,
                       posto=num_posto)  # assegno al biglietto il corrispondente evento e l'utente loggato
    db.session.add(ticket)
    db.session.commit()
    n_biglietti = Biglietto.query.filter_by(evento_id=evento.id_evento).count()
    if n_biglietti >= evento.theatre.n_posti: #se al momento dell'acquisto il numero di biglietti per l'evento è uguale al numero psoti
        evento.sold_out = True #allora segno il sold out
        db.session.commit()
    return render_template('buyTicket.html', ticket=ticket)



@app.route('/<string:idFilm>/<int:iEvent>/getIdEvent')
def getIdEvent(idFilm, iEvent):
    # ottengo prima l'evento selezionato attraverso idFilm e la posizione iEvent all'interno della query fatta prima del
    # caricamento della pagina di scelta dei biglietti
    event_qry = Evento.query.filter_by(id_film=idFilm).order_by(Evento.orario).offset(iEvent).limit(iEvent).first()
    json_id = {
        'idEvento': event_qry.id_evento
    }
    return make_response(dumps(json_id))


@app.route('/myTickets')
@login_required
def myTickets():
    loggedUsr = User.query.filter_by(id=current_user.get_id()).first()
    tickets = Biglietto.query.filter_by(utente=loggedUsr).all()
    return render_template('myTickets.html', tickets=tickets)


@app.route('/services')
@login_required
def services():
    loggedUsr = User.query.filter_by(id=current_user.get_id()).first()
    tickets = Biglietto.query.filter_by(utente=loggedUsr).all()
    return render_template('services.html', tickets=tickets)

@app.route('/services/<int:idTicket>/selectProduct')
@login_required
def selectProduct(idTicket):
    return render_template('selectProduct.html', idTicket=idTicket)

@app.route('/services/<int:idTicket>/selectProduct/<string:products>/buyOrder')
@login_required
def buyOrder(idTicket, products):
    biglietto = Biglietto.query.filter_by(id_ticket=idTicket).first()
    order = Ordine(acquisti=products, ticket=biglietto)
    db.session.add(order)
    db.session.commit()
    idOrder = {
        'idOrder': order.id_ordine
    }
    return make_response(dumps(idOrder))

@app.route('/orderSummary/<int:idOrder>')
@login_required
def orderSummary(idOrder):
    return render_template("orderSummary.html")

@app.route('/getOrderInfo/<int:idOrder>')
@login_required
def getOrderInfo(idOrder):
    order = Ordine.query.filter_by(id_ordine=idOrder).first()
    info = {
        'acquisti': order.acquisti
    }
    return make_response(dumps(info))

@app.route('/myOrders')
@login_required
def myOrders():
    # ordini = Ordine.query.join(Biglietto).join(User).filter_by(id=current_user.get_id()).all()
    return render_template("myOrders.html");

@app.route('/getMyOrders')
@login_required
def getMyOrder():
    orders_qry = Ordine.query.join(Biglietto).join(User).filter_by(id=current_user.get_id()).all()
    orders_json = []
    for i in orders_qry:
        el = {
            'id_ordine': i.id_ordine,
            'acquisti': i.acquisti,
            'evento': i.ticket.proiezione.titolo,
            'evento_ora': i.ticket.proiezione.orario.isoformat(),
            'cinema': i.ticket.proiezione.theatre.address
        }
        orders_json.append(el);

    return make_response(dumps(orders_json))

@app.route('/supporto')
def supporto():
    return render_template('supporto.html')



