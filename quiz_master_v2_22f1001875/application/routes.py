from flask import current_app as app,jsonify,request,render_template
from .database import db
from datetime import date,datetime
from .models import *
from flask_security import auth_required,roles_required,current_user,login_user,roles_accepted #roles_accepted for getting multiple roles acces to routes,
from werkzeug.security import check_password_hash,generate_password_hash

#login- /login?include_auth_token,
#quizaddition-/api/addquiz/<int:c_id>, deletion-/api/deletequiz/<int:q_id>

@app.route('/',methods=['GET'])
def home():
    return render_template('index.html')

@app.route('/api/user')
@auth_required('token')
@roles_accepted('admin','user')
def dash():
    user=current_user #to get all info of current user from session from token.
    return jsonify({
        "id" : current_user.id,
        "username" : user.username,
        "email": user.email,
        "roles" : [role.name for role in current_user.roles]
    })

@app.route('/api/login',methods=['POST'])
def user_login():
    body=request.get_json()
    emailorusername = body.get('emailorusername')
    password = body.get('password')

    if not emailorusername:
        return jsonify({
            "message" : "Email/Username required"
        }),400
    user = app.security.datastore.find_user(email=emailorusername)
    if not user:
        user = app.security.datastore.find_user(username=emailorusername)
    if not user:
        return jsonify({
            "message" : "user not found"
        }),404
    if not check_password_hash(user.password,password):
        return jsonify({
                "message" : "Incorrect password"
            }),400
    if current_user.is_authenticated:
            return jsonify({
                    "message" : "Already logged in!"
                }),400
    login_user(user)
    return jsonify({
                "id" : user.id,
                "username" : user.username,
                "auth-token" : user.get_auth_token()
            }),200


@app.route('/api/register', methods=['POST'])
def user_reg():
    user_details=request.get_json()
    if not app.security.datastore.find_user(email = user_details['email']):
        if  not app.security.datastore.find_user(username = user_details['username']):
            if user_details['email'] and user_details['username'] and user_details['password']:
                app.security.datastore.create_user(email=user_details['email'],
                                           username=user_details['username'],
                                           password=generate_password_hash(user_details['password']),
                                           roles=['user'])
                db.session.commit()
                return jsonify({
            "message" : "User created successfully"
            }),201
            else:
                return jsonify({
        "message" : "Missing entries"
            }),400
        else:
            return jsonify({
        "message" : "Username already taken"
    }),400
    return jsonify({
        "message" : "Email already registered"
    }),400
        
@app.route("/api/addquiz",methods=["POST"])
@auth_required('token')
@roles_required('admin')
def addquiz():
    body=request.get_json()
    if 'time_duration' in body and 'date' in body and 'remarks' in body and 'c_id' in body:
        time_duration=body['time_duration']
        unchecked_date=body['date']
        temp_date_list=unchecked_date.split("-")
        quiz_date=date(int(temp_date_list[0]),int(temp_date_list[1]),int(temp_date_list[2]))
        remarks=body['remarks']
        c_id=body['c_id']
        new_quiz=Quiz(date=quiz_date,time_duration=time_duration,remarks=remarks,c_id=c_id)
        db.session.add(new_quiz)
        db.session.commit()
        return jsonify({
        "message" : "Quiz added sucessfully"
        }),201
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

@app.route("/api/addquestion", methods=["POST"])
@auth_required('token')
@roles_required('admin')
def addquestion():
    body = request.get_json()
    
    required_fields = ['question', 'options', 'correct_option', 'quiz_id']
    if not all(field in body for field in required_fields):
        return jsonify({"message": "Missing entries"}), 400

    question = body['question']
    options = body['options']
    correct_option = int(body['correct_option']) 
    quiz_id = body['quiz_id']

    if len(options) != 4 or not (0 <= correct_option <= 3):
        return jsonify({"message": "Invalid options or correct option index"}), 400

    new_question = Questions(
        question=question,
        op1=options[0],
        op2=options[1],
        op3=options[2],
        op4=options[3],
        cop=correct_option,
        q_id=quiz_id
    )

    db.session.add(new_question)
    db.session.commit()

    return jsonify({"message": "Question added successfully"})


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
def questionbyquiz(q_id):
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

    return questionjson


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
