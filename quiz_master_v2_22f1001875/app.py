from flask import Flask
from application.database import db
from application.models import User,Role
from application.config import LocalDevelopmentConfig
from flask_security import Security,SQLAlchemyUserDatastore, hash_password


def start_app():
    app = Flask(__name__)
    app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)
    datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app, datastore)
    app.app_context().push()
    return app

app = start_app()







with app.app_context():
    db.create_all()

    app.security.datastore.find_or_create_role(name = "admin")
    app.security.datastore.find_or_create_role(name = "user")
    db.session.commit()

    if not app.security.datastore.find_user(email = "quizmaster@mail.com"):
        app.security.datastore.create_user(email="quizmaster@mail.com",
                                           username="quizmaster",
                                           password=hash_password("quizmaster@123"),
                                           roles=['admin'])
        
    if not app.security.datastore.find_user(email = "dummy@mail.com"):
        app.security.datastore.create_user(email="dummy@mail.com",
                                           username="dummy",
                                           password=hash_password("dummy@123"),
                                           roles=['user'])
        
    db.session.commit()

from application.routes import *
    

if __name__=="__main__":
    app.run()