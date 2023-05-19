from jwt import ExpiredSignatureError, InvalidTokenError
from conexion import obtener_conexion
import controlador, conexion_smtp
from flask import Flask, jsonify, request, make_response
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    verify_jwt_in_request,
    get_jwt
)
from functools import wraps
from flask_cors import CORS
from werkzeug.security import generate_password_hash
from datetime import timedelta
import os
from dotenv import load_dotenv
import json

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SECRET_KEY'] = os.environ.get('RetroTV_API_KEY')
load_dotenv()
#Configuracion JWT
jwt = JWTManager(app)

smtp_server = 'smtp.gmail.com'
smtp_port = 587
username = os.environ.get('CORREO_EMISOR')
password = os.environ.get('PASSWORD_CORREO_EMISOR')

conn_smtp = conexion_smtp.ConexionSMTP(smtp_server, smtp_port, username, password)

#Decorador personalizado para validar usuario administrador logueado
def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            try:
                token = request.headers.get('Authorization')
                if not token:
                    return make_response(jsonify({'RetroTV': 'NO HA ENVIADO EL TOKEN DE AUTENTICACION'}), 400)
                verify_jwt_in_request()
                claims = get_jwt()
                if claims["rol"] == "ADMINISTRADOR":
                    return fn(*args, **kwargs)
                else:
                    return make_response(jsonify({"RetroTV":"ACCESO DENEGADO, UNICAMENTE EL ADMINISTRADOR PUEDE INGRESAR"}), 403)
            except jwt.ExpiredSignatureError:
                return make_response(jsonify({'RetroTV': 'EL TOKEN DE AUTENTICACION HA EXPIRADO'}), 400)
            except jwt.InvalidTokenError:
                return make_response(jsonify({'RetroTV': 'TOKEN DE AUTENTICACION NO ES VALIDO'}), 400)
        return decorator

    return wrapper

#Decorador personalizado para validar usuario logueado
def user_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            try:
                token = request.headers.get('Authorization')
                if not token:
                    return make_response(jsonify({'RetroTV': 'NO HA ENVIADO EL TOKEN DE AUTENTICACION'}), 400)
                verify_jwt_in_request()
                claims = get_jwt()
                if claims["rol"] == "USUARIO":
                    return fn(*args, **kwargs)
                else:
                    return make_response(jsonify({"RetroTV":"ACCESO DENEGADO, UNICAMENTE LOS USUARIOS CON SESION ACTIVA PUEDEN INGRESAR"}), 403)
            except ExpiredSignatureError:
                return make_response(jsonify({'RetroTV': 'EL TOKEN DE AUTENTICACION HA EXPIRADO'}), 400)
            except InvalidTokenError:
                return make_response(jsonify({'RetroTV': 'TOKEN DE AUTENTICACION NO ES VALIDO'}), 400)
        return decorator

    return wrapper


@app.route("/protected_admin", methods=["GET"])
@admin_required()
def protected_admin():
    return make_response(jsonify({"RetroTV": "ACCESO DE ADMINISTRADOR CONCEDIDO"}),200)

@app.route("/protected_user", methods=["GET"])
@user_required()
def protected_user():
    return make_response(jsonify({"RetroTV": "ACCESO DE USUARIO ACTIVO CONCEDIDO"}),200)


#Enpoint para probar la conexion con la base de datos
@app.route('/', methods=['GET'])
def index():
    try:
        conexion = obtener_conexion()
        conn_smtp.conectar()
        conn_smtp.desconectar()
        print("CONEXION EXITOSA")
        response = make_response(jsonify({'RetroTV': "CONEXION EXITOSA"}))
        response.status_code = 200
        return response
    except:
        print("NO SE PUEDE ESTABLECER LA CONEXION A LA BASE DE DATOS")
        response = make_response(jsonify({'RetroTV': "NO SE PUEDE ESTABLECER LA CONEXION A LA BASE DE DATOS"}))
        response.status_code = 500
        return response


#Endpoint para registrar usuarios al sistema    
@app.route('/RegistrarUsuario', methods=['POST'])
def RegistrarUsuario():
    try:
        info = request.json
        nombre = info['nombre']
        usuario = info['usuario']
        correo = info['correo']
        contrasena = info['contrasena']
        conf_contrasena = info['conf_contrasena']
        telefono = info['telefono']
        genero = info['genero']
        fecha = info['fecha']
        suscripcion = info['suscripcion']
        #validamos que la contraseña y la confimacion coincidan
        if contrasena == conf_contrasena:
            contrasena_encriptada = generate_password_hash(contrasena)
            if controlador.RegistrarUsuario(nombre,usuario,correo,contrasena_encriptada,telefono,genero,fecha):
                #en este entorno enviar solicitud de suscripcion
                if suscripcion =="true":
                    print("SE CREARA LA SOLICITUD DE SUSCRIPCION")
                    try:
                        conn_smtp.conectar()
                        destinatario = '2730538920101@ingenieria.usac.edu.gt'
                        asunto = 'SOLICITUD DE MEMBRESIA PREMIUM RetroTV'
                        contenido = 'SE INFORMA QUE EL USUARIO ' + str(usuario) + ' HA SOLICITADO UNA MEMBRESIA PREMIUM.'
                        conn_smtp.enviar_correo(destinatario, asunto, contenido)
                        response = make_response(jsonify({"RetroTV":"USUARIO REGISTRADO EN EL SISTEMA Y LA NOTIFICACION DE CORREO ELECTRONICO AL ADMINISTRADOR SE HA ENVIADO EXITOSAMENTE"}))
                        response.status_code = 200
                        return response
                    except:
                        response = make_response(jsonify({"RetroTV":"USUARIO REGISTRADO EN EL SISTEMA EXITOSAMENTE PERO LA NOTIFICACION DE CORREO ELECTRONICO AL ADMINISTRADOR NO SE HA ENVIADO CORRECTAMENTE"}))
                        response.status_code = 200
                        return response
                    finally:    
                        conn_smtp.desconectar()
                else:
                    print("NO DESEA SOLICITAR LA SUSCRIPCION")
                    response = make_response(jsonify({"RetroTV":"USUARIO REGISTRADO EXITOSAMENTE EN EL SISTEMA"}))
                    response.status_code = 200
                    return response
            else:
                response = make_response(jsonify({"RetroTV":"EL USUARIO NO SE HA REGISTRADO EN EL SISTEMA"}))
                response.status_code = 400
                return response
        else:
            response = make_response(jsonify({"RetroTV":"LA CONTRASEÑA DEBE COINCIDIR CON LA CONFIRMACION DE LA CONTRASEÑA"}))
            response.status_code = 400
            return response
    except:
        response = make_response(jsonify({"RetroTV":"ERROR DE COMUNICACION"}))
        response.status_code = 500
        return response


# Endpoint para realizar el inicio de sesión de usuario
@app.route('/login', methods=['POST'])
def login():
    try:
        info = request.json
        username = info['username']
        password = info['password']
        
        # Autenticar al usuario
        user = controlador.Autenticar(username, password)
        if user is not None:
            # Generar el token JWT
            access_token = create_access_token(identity=user['id'], expires_delta=timedelta(days=1),additional_claims={"rol": user['rol']})
            response = make_response(jsonify({'RetroTV': 'INICIO DE SESION EXITOSO', 'auth_token': access_token}))
            response.status_code = 200
            return response
        else:
            response = jsonify({'RetroTV': 'LAS CREDENCIALES INGRESADAS NO SON VALIDAS'})
            response.status_code = 400
            return response
    except:
        response = jsonify({'RetroTV': 'ERROR DE COMUNICACION'})
        response.status_code = 500
        return response



if __name__ == '__main__':
    print("SERVIDOR INICIADO EN EL PUERTO: 5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
