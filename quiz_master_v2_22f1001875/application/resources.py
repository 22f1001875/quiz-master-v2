from flask_restful import Api, Resource, reqparse
from .models import *
from flask_security import auth_required,roles_required,hash_password,current_user,roles_accepted #roles_accepted for getting multiple roles acces to routes

api = Api()

def roles_list(roles):
    role_list=[]
    for role in roles:
        role_list.append(role.name)
    return role_list

parser=reqparse.RequestParser()
parser.add_argument('name')
parser.add_argument('description')
parser.add_argument('subject_id')

class SubjectApi(Resource):
    @auth_required('token')
    @roles_accepted('user','admin')
    def get(self):
        subjson=[]
        subject=Subject.query.all()
        for sub in subject:
            subdict={}
            subdict["id"] = sub.id
            subdict["name"] = sub.name
            subdict["description"] = sub.description
            subjson.append(subdict)
        if subjson:
            return subjson
        
        return {
            "message" : "No Subjects"
        },404
    
    @auth_required('token')
    @roles_required('admin')
    def post(self):
        args=parser.parse_args()
        subject=Subject(name=args['name'],
                        description=args['description'])
        db.session.add(subject)
        db.session.commit()
        return {
            "message" : "Adding subject successfull"
        }
    
    @auth_required('token')
    @roles_required('admin')
    def put(self, sub_id):
        args=parser.parse_args()
        subject=Subject.query.get(sub_id)
        if args['name']!=None and args['description']!=None:
            subject.name=args['name']
            subject.description=args['description']
            db.session.commit()
            return {
            "message" : "Updating subject successfull"
        }
        elif args['name']!=None and args['description']==None:
            subject.name=args['name']
            db.session.commit()
            return {
            "message" : "Updating subject name successfull"
        }
        elif args['name']==None and args['description']!=None:
            subject.description=args['description']
            db.session.commit()
            return {
            "message" : "Updating subject description successfull"
        }
        return {
            "message" : "Empty request"
        },400
    
    @auth_required('token')
    @roles_required('admin')
    def delete(self, sub_id):
        chaps=Chapter.query.filter_by(s_id=sub_id).all()
        if chaps:
            for chap in chaps:
                quis=Quiz.query.filter_by(c_id=chap.id).all()
                if quis:
                    for qui in quis:
                        Questions.query.filter_by(q_id=qui.id).delete()
                Quiz.query.filter_by(c_id=chap.id).delete()
        Chapter.query.filter_by(s_id=sub_id).delete()
        Subject.query.filter_by(id=sub_id).delete()
        db.session.commit()
        return {
            "message" : "Deletion successful"
        }
    
class ChapterApi(Resource):
    @auth_required('token')
    @roles_accepted('user','admin')
    def get(self):
        chapjson=[]
        chapter=Chapter.query.all()
        for chap in chapter:
            chapdict={}
            chapdict["id"] = chap.id
            chapdict["name"] = chap.name
            chapdict["subid"] = chap.s_id
            chapjson.append(chapdict)
        if chapjson:
            return chapjson
        
        return {
            "message" : "No Chapters under any subject"
        },404
    
    @auth_required('token')
    @roles_accepted('user','admin')
    def get(self,sub_id):
        chapjson=[]
        chapter=Chapter.query.filter_by(s_id=sub_id).all()
        for chap in chapter:
            chapdict={}
            chapdict["id"] = chap.id
            chapdict["name"] = chap.name
            chapdict["subid"] = chap.s_id
            chapjson.append(chapdict)
        if chapjson:
            return chapjson
        
        return {
            "message" : "No Chapters under this subject"
        },404
    
    @auth_required('token')
    @roles_required('admin')
    def post(self):
        args=parser.parse_args()
        if args['name']!=None and args['subject_id']!=None:
            chapter=Chapter(name=args['name'],
                        s_id=args['subject_id'])
            db.session.add(chapter)
            db.session.commit()
            return {
            "message" : "Adding chapter successfull"
            }
        return {
            "message" : "Missing fields"
        },400
    
    @auth_required('token')
    @roles_required('admin')
    def put(self, chap_id):
        args=parser.parse_args()
        chapter=Chapter.query.get(chap_id)
        if args['name']!=None and args['subject_id']!=None:
            chapter.name=args['name']
            chapter.s_id=args['subject_id']
            db.session.commit()
            return {
            "message" : "Updating chapter successful"
        }
        elif args['name']!=None and args['subject_id']==None:
            chapter.name=args['name']
            db.session.commit()
            return {
            "message" : "Updating chapter name successful"
        }
        elif args['name']==None and args['subject_id']!=None:
            chapter.s_id=args['subject_id']
            db.session.commit()
            return {
            "message" : "Updating subject id successfull"
        }
        return {
            "message" : "Empty request"
        },400
    
    @auth_required('token')
    @roles_required('admin')
    def delete(self, chap_id):
        quis=Quiz.query.filter_by(c_id=chap_id).all()
        if quis:
            for qui in quis:
                Questions.query.filter_by(q_id=qui.id).delete()
        Quiz.query.filter_by(c_id=chap_id).delete()
        Chapter.query.filter_by(id=chap_id).delete()
        db.session.commit()
        return {
            "message" : "Deletion successful"
        }
    


api.add_resource(SubjectApi,'/api/allsubjects','/api/addsubject','/api/updatesubject/<int:sub_id>','/api/deletesubject/<int:sub_id>')
api.add_resource(ChapterApi,'/api/allchapters','/api/chapterbysub/<int:sub_id>','/api/addchapter','/api/updatechapter/<int:chap_id>','/api/deletechapter/<int:chap_id>')