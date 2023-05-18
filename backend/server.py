from conexion import obtener_conexion
import controlador
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os
import json

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

#Enpoint para probar la conexion con la base de datos
@app.route('/', methods=['GET'])
def index():
    try:
        conexion = obtener_conexion()
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
                #en este entorno crear la suscripcion
                if suscripcion =="true":
                    print("SE CREARA LA SOLICITUD DE SUSCRIPCION")
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


if __name__ == '__main__':
    print("SERVIDOR INICIADO EN EL PUERTO: 5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
