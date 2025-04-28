from .database import db
from flask_security import UserMixin,RoleMixin

class User(db.Model,UserMixin):
    #required for flask security
    id=db.Column(db.Integer,primary_key=True)
    email=db.Column(db.String,unique=True,nullable=False)
    password=db.Column(db.String,nullable=False)
    username=db.Column(db.String,unique=True,nullable=False)
    fs_uniquifier = db.Column(db.String, unique=True, nullable=False)
    active = db.Column(db.Boolean, nullable=False, default=True)
    roles = db.relationship('Role', backref = 'bearer', secondary='user_roles')


class Role(db.Model,RoleMixin):
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String,unique=True,nullable=False)


class UserRoles(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    user_id=db.Column(db.Integer,db.ForeignKey('user.id'))
    role_id=db.Column(db.Integer,db.ForeignKey('role.id'))

class Subject(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String,unique=True,nullable=False)
    description=db.Column(db.Text,nullable=True)
    chapters = db.relationship("Chapter", backref="subject", lazy=True)

class Chapter(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String,nullable=False)
    s_id=db.Column(db.Integer,db.ForeignKey('subject.id', ondelete="CASCADE"))

class Quiz(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    date=db.Column(db.Date, nullable=False)
    time_duration=db.Column(db.Integer,nullable=False)
    remarks=db.Column(db.Text)
    c_id=db.Column(db.Integer,db.ForeignKey('chapter.id',ondelete="CASCADE"))
    quest = db.relationship("Questions", backref="quiz", lazy=True)

class Questions(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    q_id=db.Column(db.Integer,db.ForeignKey('quiz.id', ondelete="CASCADE"))
    question=db.Column(db.Text,nullable=False)
    op1=db.Column(db.Text,nullable=False)
    op2=db.Column(db.Text,nullable=False)
    op3=db.Column(db.Text,nullable=False)
    op4=db.Column(db.Text,nullable=False)
    cop=db.Column(db.Integer,nullable=False)

class Scores(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    q_id=db.Column(db.Integer,db.ForeignKey('quiz.id', ondelete="CASCADE"))
    u_id=db.Column(db.Integer,db.ForeignKey('user.id', ondelete="CASCADE"))
    score=db.Column(db.Integer,nullable=False)