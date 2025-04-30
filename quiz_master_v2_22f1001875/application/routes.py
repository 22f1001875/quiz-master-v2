from flask import current_app as app,jsonify,request
from .database import db
from datetime import date,datetime
from .models import *
from flask_security import auth_required,roles_required,hash_password,current_user,roles_accepted #roles_accepted for getting multiple roles acces to routes

#quizaddition-/api/addquiz/<int:c_id>, deletion-/api/deletequiz/<int:q_id>
#
#
#
#
#

@app.route('/',methods=['GET'])
def home():
    return '<h1>This is THE HOMEPAGE</h1>'

@app.route('/api/admin')
@auth_required('token') #authentication
@roles_required('admin') #RBAC
def admin_home():
    return "<h1>This is admin</h1>"

@app.route('/api/user')
@auth_required('token')
@roles_required('user')
def user_home():
    user=current_user #to get all info of current user from session from token.
    return jsonify({
        "username" : user.username,
        "email": user.email
    })

@app.route('/api/register', methods=['POST'])
def user_reg():
    user_details=request.get_json()
    if not app.security.datastore.find_user(email = user_details['email']):
        if  not app.security.datastore.find_user(username = user_details['username']):
            app.security.datastore.create_user(email=user_details['email'],
                                           username=user_details['username'],
                                           password=hash_password(user_details['password']),
                                           roles=['user'])
            db.session.commit()
            return jsonify({
            "message" : "User created successfully"
            }),201
        else:
            return jsonify({
        "message" : "Username already taken"
    }),400
    return jsonify({
        "message" : "Email already registered"
    }),400
        
@app.route("/api/addquiz/<int:c_id>",methods=["POST"])
@auth_required('token')
@roles_required('admin')
def addquiz(c_id):
    body=request.get_json()
    if 'time_duration' in body and 'quiz_date' in body and 'remarks' in body:
        time_duration=body['time_duration']
        unchecked_date=body['quiz_date']
        temp_date_list=unchecked_date.split("-")
        quiz_date=date(int(temp_date_list[0]),int(temp_date_list[1]),int(temp_date_list[2]))
        remarks=body['remarks']
        new_quiz=Quiz(date=quiz_date,time_duration=time_duration,remarks=remarks,c_id=c_id)
        db.session.add(new_quiz)
        db.session.commit()
        return jsonify({
        "message" : "Quiz added sucessfully"
        })
    return jsonify({
        "message": "Missing entries"
    }),400

@app.route("/api/deletequiz/<int:q_id>",methods=["DELETE"])
@auth_required('token')
@roles_required('admin')
def quizdeletion(q_id):
    Questions.query.filter_by(q_id=q_id).delete()
    Quiz.query.filter_by(id=q_id).delete()
    db.session.commit()
    return jsonify({
        "message" : "Deletion successful"
    })

@app.route("/api/updatequiz/<int:q_id>",methods=["POST"])
@auth_required('token')
@roles_required('admin')
def updatequiz(q_id):
    info={'message':"Updated"}
    quiz=Quiz.query.get(q_id)
    body=request.get_json()
    if 'time_duration' in body:
        quiz.time_duration=body['time_duration']
        info['message']=info['message']+' time duration'
    if 'quiz_date' in body:
        unchecked_date=body['quiz_date']
        temp_date_list=unchecked_date.split("-")
        quiz_date=date(int(temp_date_list[0]),int(temp_date_list[1]),int(temp_date_list[2]))
        quiz.date=quiz_date
        info['message']=info['message']+" quiz-date"
    if 'remarks' in body:
        quiz.remarks=body['remarks']
        info['message']=info['message']+' remarks'
    if 'c_id' in body:
        quiz.c_id=body["c_id"]
        info['message']=info['message']+" chapter"
    db.session.commit()
    return jsonify(info)

@app.route("/api/quizbychapter/<int:c_id>")
@auth_required('token')
@roles_accepted('admin','user')
def quizbychapter(c_id):
    quizjson=[]
    quiz=Quiz.query.filter_by(c_id=c_id).all()
    for q in quiz:
        qdict={}
        qdict["id"] = q.id
        qdict["remarks"] = q.remarks
        qdict["time_duration"] = q.time_duration
        qdict["date"] = q.date
        qdict["c_id"] = q.c_id
        quizjson.append(qdict)
    if quizjson:
        return quizjson
        
    return {
            "message" : "No quizzes under this chapter"
        },404

####-----Question Starts here-----####

@app.route("/api/addquestion/<int:q_id>",methods=["POST"])
@auth_required('token')
@roles_required('admin')
def addquestion(q_id):
    body=request.get_json()
    if 'question' in body and 'op1' in body and 'op2' in body and 'op3' in body and 'op4' in body and 'cop' in body:
        question=body['question']
        op1=body['op1']
        op2=body['op2']
        op3=body['op3']
        op4=body['op4']
        cop=body['cop']
        new_question=Questions(question=question,op1=op1,op2=op2,op3=op3,op4=op4,cop=cop,q_id=q_id)
        db.session.add(new_question)
        db.session.commit()
        return jsonify({
        "message" : "Question added sucessfully"
        })
    return jsonify({
        "message": "Missing entries"
    }),400

@app.route("/api/deletequestion/<int:id>",methods=["DELETE"])
@auth_required('token')
@roles_required('admin')
def questiondeletion(id):
    Questions.query.filter_by(id=id).delete()
    db.session.commit()
    return jsonify({
        "message" : "Deletion successful"
    })

@app.route("/api/updatequestion/<int:id>",methods=["POST"])
@auth_required('token')
@roles_required('admin')
def updatequestion(id):
    info={'message':"Updated"}
    question=Questions.query.get(id)
    body=request.get_json()
    if 'question' in body:
        question.question=body['question']
        info['message']=info['message']+' question'
    if 'op1' in body:
        question.op1=body['op1']
        info['message']=info['message']+" op1"
    if 'op2' in body:
        question.op2=body['op2']
        info['message']=info['message']+" op2"
    if 'op3' in body:
        question.op3=body['op3']
        info['message']=info['message']+" op3"
    if 'op4' in body:
        question.op4=body['op4']
        info['message']=info['message']+" op4"
    if 'cop' in body:
        question.cop=body['cop']
        info['message']=info['message']+" cop"
    if 'q_id' in body:
        question.q_id=body["q_id"]
        info['message']=info['message']+" quiz"
    db.session.commit()
    if len(info['message'])>7:
        return jsonify(info)
    return jsonify({
        "message" : "Missing entries"
    })

@app.route("/api/questionbyquiz/<int:q_id>")
@auth_required('token')
@roles_accepted('admin','user')
def questionbychapter(q_id):
    questionjson=[]
    question=Questions.query.filter_by(q_id=q_id).all()
    for q in question:
        qdict={}
        qdict["id"] = q.id
        qdict["question"] = q.question
        qdict["op1"] = q.op1
        qdict["op2"] = q.op2
        qdict["op3"] = q.op3
        qdict["op4"] = q.op4
        qdict["cop"] = q.cop
        qdict["q_id"] = q.q_id
        questionjson.append(qdict)
    if questionjson:
        return questionjson
        
    return {
            "message" : "No questions under this quiz"
        },404

@app.route("/api/addscore/<int:q_id>",methods=["POST"])
@auth_required('token')
@roles_required('user')
def addscore(q_id):
    body=request.get_json()
    user=current_user
    if 'score' in body:
        score=body['score']
        quizid=q_id
        u_id=user.id
        new_score=Scores(score=score,q_id=quizid,u_id=u_id)
        db.session.add(new_score)
        db.session.commit()
        return jsonify({
        "message" : "Score added sucessfully"
        })
    return jsonify({
        "message": "Missing entries"
    }),400
