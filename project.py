from app import app, db
from app.models import User, Cinema, Evento, Biglietto, Ordine


@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'User': User, 'Cinema': Cinema, 'Evento': Evento, 'Biglietto': Biglietto, 'Ordine': Ordine }
