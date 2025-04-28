from flask import current_app as app,jsonify
from flask_security import auth_required,roles_required,current_user,roles_accepted #roles_accepted for getting multiple roles acces to routes

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