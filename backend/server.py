from jwt import ExpiredSignatureError, InvalidTokenError
from conexion import obtener_conexion
import boto3
import datetime
import openpyxl

#Configuracion del cliente de cloudfront
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import padding

from botocore.exceptions import NoCredentialsError, ClientError
import controlador, conexion_smtp, reportes
from flask import Flask, jsonify, request, make_response, send_file
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    verify_jwt_in_request,
    get_jwt
)
from functools import wraps
from flask_cors import CORS
from werkzeug.security import generate_password_hash
from werkzeug.utils import secure_filename
from datetime import timedelta
import os
from dotenv import load_dotenv



from botocore.signers import CloudFrontSigner



app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": ["*"]}})
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SECRET_KEY'] = os.environ.get('RetroTV_API_KEY')
app.config['UPLOAD_FOLDER'] = os.environ.get('UPLOAD_PORTADAS')

load_dotenv()
#Configuracion JWT
jwt = JWTManager(app)

smtp_server = 'smtp.gmail.com'
smtp_port = 587
username = os.environ.get('CORREO_EMISOR')
password = os.environ.get('PASSWORD_CORREO_EMISOR')

conn_smtp = conexion_smtp.ConexionSMTP(smtp_server, smtp_port, username, password)

#Configuracion del bucket de s3
s3 = boto3.client('s3')
bucket_name = os.environ.get('BUCKET_NAME')  # Reemplaza con el nombre de tu bucket de S3




#Decorador personalizado para validar usuario administrador logueado
def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            try:
                token = request.headers.get('Authorization')
                if not token:
                    return make_response(jsonify({'status':'error','RetroTV': 'NO HA ENVIADO EL TOKEN DE AUTENTICACION'}), 400)
                verify_jwt_in_request()
                claims = get_jwt()
                if claims["rol"] == "ADMINISTRADOR":
                    return fn(*args, **kwargs)
                else:
                    return make_response(jsonify({'status':'error','RetroTV':'ACCESO DENEGADO, UNICAMENTE EL ADMINISTRADOR PUEDE INGRESAR'}), 403)
            except ExpiredSignatureError:
                return make_response(jsonify({'status':'error','RetroTV': 'EL TOKEN DE AUTENTICACION HA EXPIRADO'}), 400)
            except InvalidTokenError:
                return make_response(jsonify({'status':'error','RetroTV': 'TOKEN DE AUTENTICACION NO ES VALIDO'}), 400)
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
                    return make_response(jsonify({'status':'error','RetroTV': 'NO HA ENVIADO EL TOKEN DE AUTENTICACION'}), 400)
                verify_jwt_in_request()
                claims = get_jwt()
                if claims["rol"] == "USUARIO":
                    return fn(*args, **kwargs)
                else:
                    return make_response(jsonify({'status':'error','RetroTV':'ACCESO DENEGADO, UNICAMENTE LOS USUARIOS CON SESION ACTIVA PUEDEN INGRESAR'}), 403)
            except ExpiredSignatureError:
                return make_response(jsonify({'status':'error','RetroTV': 'EL TOKEN DE AUTENTICACION HA EXPIRADO'}), 400)
            except InvalidTokenError:
                return make_response(jsonify({'status':'error','RetroTV': 'TOKEN DE AUTENTICACION NO ES VALIDO'}), 400)
        return decorator

    return wrapper

#Decorador personalizado para validar usuario o admin logueado
def auth_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            try:
                token = request.headers.get('Authorization')
                if not token:
                    return make_response(jsonify({'status':'error','RetroTV': 'NO HA ENVIADO EL TOKEN DE AUTENTICACION'}), 400)
                verify_jwt_in_request()
                claims = get_jwt()
                if claims["rol"] == "USUARIO" or claims["rol"] == "ADMINISTRADOR":
                    return fn(*args, **kwargs)
                else:
                    return make_response(jsonify({'status':'error','RetroTV':'ACCESO DENEGADO, UNICAMENTE LOS USUARIOS O ADMINISTRADOR CON SESION ACTIVA PUEDEN INGRESAR'}), 403)
            except ExpiredSignatureError:
                return make_response(jsonify({'status':'error','RetroTV': 'EL TOKEN DE AUTENTICACION HA EXPIRADO'}), 400)
            except InvalidTokenError:
                return make_response(jsonify({'status':'error','RetroTV': 'TOKEN DE AUTENTICACION NO ES VALIDO'}), 400)
        return decorator

    return wrapper

@app.route("/protected_admin", methods=["GET"])
@admin_required()
def protected_admin():
    return make_response(jsonify({'status':'success',"RetroTV": "ACCESO DE ADMINISTRADOR CONCEDIDO"}),200)

@app.route("/protected_user", methods=["GET"])
@user_required()
def protected_user():
    return make_response(jsonify({'status':'success',"RetroTV": "ACCESO DE USUARIO ACTIVO CONCEDIDO"}),200)


#Enpoint para probar la conexion con la base de datos
@app.route('/', methods=['GET'])
def index():
    try:
        conexion = obtener_conexion()
        conn_smtp.conectar()
        conn_smtp.desconectar()
        print("CONEXION EXITOSA")
        print(generate_password_hash("admin"))
        response = make_response(jsonify({'status':'success','RetroTV': "CONEXION EXITOSA"}))
        response.status_code = 200
        return response
    except:
        print("NO SE PUEDE ESTABLECER LA CONEXION A LA BASE DE DATOS")
        response = make_response(jsonify({'status':'error','RetroTV': "NO SE PUEDE ESTABLECER LA CONEXION A LA BASE DE DATOS"}))
        response.status_code = 500
        return response


#Endpoint para registrar usuarios al sistema    
@app.route('/RegistrarUsuario', methods=['POST'])
def RegistrarUsuario():
    try:
        info = request.get_json()
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
                if suscripcion == True:
                    print("SE CREARA LA SOLICITUD DE SUSCRIPCION")
                    try:
                        conn_smtp.conectar()
                        destinatario = '2730538920101@ingenieria.usac.edu.gt'
                        asunto = 'SOLICITUD DE MEMBRESIA PREMIUM RetroTV'
                        contenido = 'SE INFORMA QUE EL USUARIO ' + str(usuario) + ' HA SOLICITADO UNA MEMBRESIA PREMIUM.'
                        conn_smtp.enviar_correo(destinatario, asunto, contenido)
                        response = make_response(jsonify({'status':'success',"RetroTV":"USUARIO REGISTRADO EN EL SISTEMA Y LA NOTIFICACION DE CORREO ELECTRONICO AL ADMINISTRADOR SE HA ENVIADO EXITOSAMENTE"}))
                        response.status_code = 200
                        return response
                    except:
                        response = make_response(jsonify({'status':'success',"RetroTV":"USUARIO REGISTRADO EN EL SISTEMA EXITOSAMENTE PERO LA NOTIFICACION DE CORREO ELECTRONICO AL ADMINISTRADOR NO SE HA ENVIADO CORRECTAMENTE"}))
                        response.status_code = 500
                        return response
                    finally:    
                        conn_smtp.desconectar()
                else:
                    print("NO DESEA SOLICITAR LA SUSCRIPCION")
                    response = make_response(jsonify({'status':'success',"RetroTV":"USUARIO REGISTRADO EXITOSAMENTE EN EL SISTEMA"}))
                    response.status_code = 200
                    return response
            else:
                response = make_response(jsonify({'status':'error',"RetroTV":"EL USUARIO NO SE HA REGISTRADO EN EL SISTEMA"}))
                response.status_code = 400
                return response
        else:
            response = make_response(jsonify({'status':'error',"RetroTV":"LA CONTRASEÑA DEBE COINCIDIR CON LA CONFIRMACION DE LA CONTRASEÑA"}))
            response.status_code = 400
            return response
    except:
        response = make_response(jsonify({'status':'error',"RetroTV":"ERROR DE COMUNICACION" }))
        response.status_code = 500
        return response


# Endpoint para realizar el inicio de sesión de usuario
@app.route('/login', methods=['POST'])
def login():
    try:
        info = request.get_json()
        username = info['username']
        password = info['contrasena']
        
        # Autenticar al usuario
        user = controlador.Autenticar(username, password)
        if user is not None:
            # Generar el token JWT
            access_token = create_access_token(identity=user['id'], expires_delta=timedelta(days=1),additional_claims={"rol": user['rol']})
            response = make_response(jsonify({'status':'success','RetroTV': 'INICIO DE SESION EXITOSO', 'auth_token': access_token}))
            response.status_code = 200
            return response
        else:
            response = make_response(jsonify({'status':'error','RetroTV': 'LAS CREDENCIALES INGRESADAS NO SON VALIDAS', 'auth_token': ""}))
            response.status_code = 400
            return response
    except:
        response = make_response(jsonify({'status':'error','RetroTV': 'ERROR DE COMUNICACION', 'auth_token': ""}))
        response.status_code = 500
        return response

#Endpoint para recuperar las credenciales del usuario
@app.route('/recover', methods=['POST'])
def recover():
    try:
        info = request.get_json()
        correo = info['correo']
        recover_data = controlador.recover(correo)
        if recover_data is not None:
            try:
                conn_smtp.conectar()
                destinatario = correo
                asunto = 'RECUPERACION DE CREDENCIALES RetroTV'
                contenido = 'HAS SOLICITADO RECUPERAR TUS CREDENCIALES, SE RECOMIENTA CAMBIAR LA CONTRASEÑA AL INICIAR SESION NUEVAMENTE. TU USUARIO ES: ' + str(recover_data['username']) + " TU CONTRASEÑA TEMPORAL GENERADA POR EL SISTEMA ES: " + str(recover_data['contrasena']) + "\nCUALQUIER INCONVENIENTE PONTE EN CONTACTO CON NOSOTROS."
                conn_smtp.enviar_correo(destinatario, asunto, contenido) 
                response = make_response(jsonify({'status':'success',"RetroTV":"SE HA ENVIADO UN CORREO CON ELECTRONICO AL USUARIO " + str(recover_data['username']) + " CON CREDENCIALES TEMPORALES ASIGNADAS POR EL SISTEMA"}))
                response.status_code = 200
                return response
            except:
                response = make_response(jsonify({'status':'success',"RetroTV":"NO HA SIDO POSIBLE ENVIAR EL CORREO ELECTRONICO CON LAS CREDENCIALES DE RECUPERACION, INTENTA NUEVAMENTE."}))
                response.status_code = 500
                return response
            finally:    
                conn_smtp.desconectar()
        else:
            response = make_response(jsonify({'status':'error','RetroTV': 'NO SE HAN PODIDO OBTENER LOS DATOS DE RECUPERACION, POSIBLEMENTE INGRESASTE UN CORREO ELECTRONICO QUE NO ESTA REGISTRADO, INTENTA NUEVAMENTE'}))
            response.status_code = 500
            return response
    except:
        response = make_response(jsonify({'status':'error','RetroTV': 'ERROR DE COMUNICACION'}))
        response.status_code = 500
        return response
    
#Endpoint para retornar todos los usuarios registrados
@app.route('/ListarClientes', methods=['GET'])
@admin_required()
def ListarCliente():
    try:
        usuarios = controlador.ListarClientes()
        if usuarios is not None:
            response = make_response(jsonify({'status':'success','RetroTV': 'SE HAN MOSTRADO LOS USUARIOS EXITOSAMENTE','usuarios':usuarios}))
            response.status_code = 200
            return response
        else:
            response = make_response(jsonify({'status':'error','RetroTV': 'ERROR AL MOSTRAR LOS USUARIOS','usuarios':None}))
            response.status_code = 400
            return response
    except:
        response = make_response(jsonify({'status':'error','RetroTV': 'ERROR DE COMUNICACION','usuarios':None}))
        response.status_code = 500
        return response
    
#Endpoint para Activar una suscripcion
@app.route('/ActivarSuscripcion/<id>', methods=['POST'])
@admin_required()
def ActivarSuscripcion(id):
    try:
        respuesta = controlador.ActivarSuscripcion(id)
        if respuesta is not None:
            response = make_response(jsonify({'status':'success','RetroTV': 'SE EJECUTO EL PROCEDIMIENTO ActivarSolicitud','respuesta':respuesta}))
            response.status_code = 200
            return response 
        else:
            response = make_response(jsonify({'status':'error','RetroTV': 'ERROR AL ACTIVAR LA SUSCRIPCION','respuesta':None}))
            response.status_code = 400
            return response 
    except:
        response = make_response(jsonify({'status':'error','RetroTV': 'ERROR DE COMUNICACION','respuesta':None}))
        response.status_code = 500
        return response  
    
#Endpoint para Cancelar una suscripcion
@app.route('/CancelarSuscripcion/<id>', methods=['POST'])
@auth_required()
def CancelarSuscripcion(id):
    try:
        respuesta = controlador.CancelarSuscripcion(id)
        if respuesta is not None:
            response = make_response(jsonify({'status':'success','RetroTV': 'SE EJECUTO EL PROCEDIMIENTO CancelarSolicitud','respuesta':respuesta}))
            response.status_code = 200
            return response 
        else:
            response = make_response(jsonify({'status':'error','RetroTV': 'ERROR AL CANCELAR LA SUSCRIPCION','respuesta':None}))
            response.status_code = 400
            return response 
    except:
        response = make_response(jsonify({'status':'error','RetroTV': 'ERROR DE COMUNICACION','respuesta':None}))
        response.status_code = 500
        return response
    

#Enpoint para Eliminar un usuario
@app.route('/EliminarUsuario/<id>', methods=['DELETE'])
@auth_required()
def EliminarUsuario(id):
    try:
        respuesta = controlador.EliminarUsuario(id)
        if respuesta is not None:
            response = make_response(jsonify({'status':'success','RetroTV': respuesta}))
            response.status_code = 200
            return response 
        else:
            response = make_response(jsonify({'status':'error','RetroTV': 'ERROR AL ELIMINAR USUARIO'}))
            response.status_code = 400
            return response

    except:
        response = make_response(jsonify({'status':'error','RetroTV': 'ERROR DE COMUNICACION'}))
        response.status_code = 500
        return response  

#Endpoint para obtener los datos del administrador
@app.route('/PerfilAdministrador/<id>', methods=['GET'])
@admin_required()
def PerfilAdministrador(id):    
    try:
        datos = controlador.PerfilAdministrador(id)
        if datos is not None:
            response = make_response(jsonify({'status':'success', 'RetroTV':'DATOS OBTENIDOS EXITOSAMENTE', 'datos':datos}))
            response.status_code = 200
            return response
        else:
            response = make_response(jsonify({'status':'error','RetroTV': 'ERROR AL OBTENER LA INFORMACION DEL ADMINISTRADOR', 'datos':None}))
            response.status_code = 400
            return response   
    except:
        response = make_response(jsonify({'status':'error','RetroTV': 'ERROR DE COMUNICACION','datos':None}))
        response.status_code = 500
        return response  

#Endpoint para obtener los datos del usuario
@app.route('/PerfilUsuario/<id>', methods=['GET'])
@user_required()
def PerfilUsuario(id):    
    try:
        datos = controlador.PerfilUsuario(id)
        if datos is not None:
            response = make_response(jsonify({'status':'success', 'RetroTV':'DATOS OBTENIDOS EXITOSAMENTE', 'datos':datos}))
            response.status_code = 200
            return response
        else:
            response = make_response(jsonify({'status':'error','RetroTV': 'ERROR AL OBTENER LA INFORMACION DEL USUARIO', 'datos':None}))
            response.status_code = 400
            return response   
    except:
        response = make_response(jsonify({'status':'error','RetroTV': 'ERROR DE COMUNICACION','datos':None}))
        response.status_code = 500
        return response  

#Endpoint para crear una nueva clasificacion de videos
@app.route('/CrearClasificacion', methods=['POST'])
@admin_required()
def CrearClasificacion():
    try:
        datos = request.get_json()
        nombre = datos['nombre']
        resp = controlador.CrearClasificacion(nombre)
        if resp:
            response = make_response(jsonify({'status':'success', 'RetroTV':"LA NUEVA CLASIFICACION SE HA AGREGADO EXITOSAMENTE"}))
            response.status_code = 200
            return response
        else:
            response = make_response(jsonify({'status':'error', 'RetroTV':'ERROR AL CREAR UNA NUEVA CLASIFICACION'}))
            response.status_code = 400
            return response
    except:
        response = make_response(jsonify({'status':'error','RetroTV': 'ERROR DE COMUNICACION'}))
        response.status_code = 500
        return response  

#Endpoint para listar todas las clasificaciones existentes
@app.route('/ListarClasificaciones', methods=['GET'])
def ListarClasificaciones():
    try:
        clasificaciones = controlador.ListarClasificaciones()
        if clasificaciones is not None:
            response = make_response(jsonify({'status':'success', 'RetroTV':'SE HAN OBTENIDO LAS CLASIFICACIONES EXITOSAMENTE', 'clasificaciones':clasificaciones}))
            response.status_code = 200
            return response
        else:
            response = make_response(jsonify({'status':'error', 'RetroTV':'ERROR AL OBTENER LAS CLASIFICACIONES', 'clasificaciones': None}))
            response.status_code = 400
            return response  
    except:
        response = make_response(jsonify({'status':'error','RetroTV': 'ERROR DE COMUNICACION', 'clasificaciones':None}))
        response.status_code = 500
        return response
    
#Enpoint para Eliminar una clasificacion
@app.route('/EliminarClasificacion', methods=['DELETE'])
@admin_required()
def EliminarClasificacion():
    try:
        data = request.get_json()
        nombre = data['nombre']
        respuesta = controlador.EliminarClasificacion(nombre)
        if respuesta is not None:
            response = make_response(jsonify({'status':'success','RetroTV': respuesta}))
            response.status_code = 200
            return response 
        else:
            response = make_response(jsonify({'status':'error','RetroTV': 'ERROR AL ELIMINAR LA CLASIFICACION'}))
            response.status_code = 400
            return response

    except:
        response = make_response(jsonify({'status':'error','RetroTV': 'ERROR DE COMUNICACION'}))
        response.status_code = 500
        return response 

#Endpoint para actualizar el correo electronico de los usuarios
@app.route('/ActualizarCorreo', methods={'PUT'})
@auth_required()
def ActualizarCorreo():
    try:
        data = request.get_json()
        correo = data['correo']
        id = data['id']
        res = controlador.ActualizarCorreo(correo, id)
        if res is not None:
            response = make_response(jsonify({'status':'success','RetroTV': res}))
            response.status_code = 200
            return response 
        else:
            response = make_response(jsonify({'status':'error','RetroTV': 'ERROR AL ACTUALIZAR TU CORREO ELECTRONICO'}))
            response.status_code = 400
            return response
    except:
        response = make_response(jsonify({'status':'error','RetroTV': 'ERROR DE COMUNICACION'}))
        response.status_code = 500
        return response   

#Endpoint para actualizar el telefono de los usuarios
@app.route('/ActualizarTelefono', methods={'PUT'})
@auth_required()
def ActualizarTelefono():
    try:
        data = request.get_json()
        telefono = data['telefono']
        id = data['id']
        res = controlador.ActualizarTelefono(telefono,id)
        if res is not None:
            response = make_response(jsonify({'status':'success','RetroTV': res}))
            response.status_code = 200
            return response 
        else:
            response = make_response(jsonify({'status':'error','RetroTV': 'ERROR AL ACTUALIZAR TU NUMERO DE TELEFONO'}))
            response.status_code = 400
            return response
    except:
        response = make_response(jsonify({'status':'error','RetroTV': 'ERROR DE COMUNICACION'}))
        response.status_code = 500
        return response    

#Endpoint para actualizar la contrasena de los usuarios
@app.route('/ActualizarContrasena', methods={'PUT'})
@auth_required()
def ActualizarContrasena():
    try:
        data = request.get_json()
        contrasena = data['contrasena']
        conf_contrasena =data['conf_contrasena']
        id = data['id']
        if contrasena == conf_contrasena:
            contrasena_encriptada = generate_password_hash(contrasena)
            res = controlador.ActualizarContrasena(contrasena_encriptada,id)
            if res is not None:
                response = make_response(jsonify({'status':'success','RetroTV': res}))
                response.status_code = 200
                return response 
            else:
                response = make_response(jsonify({'status':'error','RetroTV': 'ERROR AL ACTUALIZAR TU CONTRASEÑA'}))
                response.status_code = 400
                return response
        else:
            response = make_response(jsonify({'status':'error','RetroTV': 'ERROR AL ACTUALIZAR TU CONTRASEÑA, DEBE COINCIDIR EN AMBOS CAMPOS'}))
            response.status_code = 400
            return response
    except:
        response = make_response(jsonify({'status':'error','RetroTV': 'ERROR DE COMUNICACION'}))
        response.status_code = 500
        return response

#Endpoint para enviar una solicitud de suscripcion al administrador
@app.route('/SolicitarSuscripcion', methods=['POST'])
@user_required()
def SolicitarSuscripcion():
    try:
        datos = request.get_json()
        usuario = datos['usuario']
        conn_smtp.conectar()
        destinatario = '2730538920101@ingenieria.usac.edu.gt'
        asunto = 'SOLICITUD DE MEMBRESIA PREMIUM RetroTV'
        contenido = 'SE INFORMA QUE EL USUARIO ' + str(usuario) + ' HA SOLICITADO UNA MEMBRESIA PREMIUM.'
        conn_smtp.enviar_correo(destinatario, asunto, contenido)
        response = make_response(jsonify({'status':'success',"RetroTV":"LA NOTIFICACION DE CORREO ELECTRONICO AL ADMINISTRADOR SE HA ENVIADO EXITOSAMENTE"}))
        response.status_code = 200
        return response
    except:
        response = make_response(jsonify({'status':'error','RetroTV': 'ERROR DE COMUNICACION'}))
        response.status_code = 500
        return response
    finally:
        conn_smtp.desconectar()

#Endpoint para enviar un correo de promocion a los usuarios
@app.route('/EnviarPromocion', methods=['POST'])
@admin_required()
def EnviarPromocion():
    try:
        destinatarios = controlador.ObtenerCorreosUsuarios()        
        asunto = request.form['asunto']
        cuerpo = request.form['cuerpo']
        archivos = request.files.getlist('archivos') if 'archivos' in request.files else None
        if len(destinatarios) > 0:
            for destinatario in destinatarios:
                try:
                    conn_smtp.conectar()
                    conn_smtp.enviar_correo(destinatario, asunto, cuerpo, archivos)
                    conn_smtp.desconectar()
                except:
                    conn_smtp.desconectar()
            
            response_data = {
                'status': 'success',
                'RetroTV': 'CORREOS ENVIADOS EXITOSAMENTE'
            }
            response = make_response(jsonify(response_data))
            response.status_code = 200
            return response
        else:
            response = make_response(jsonify({'status': 'error', 'RetroTV': 'ERROR AL OBTENER LOS DESTINATARIOS DEL CORREO'}))
            response.status_code = 400
            return response
    except:
        response = make_response(jsonify({'status': 'error', 'RetroTV': 'ERROR DE COMUNICACION'}))
        response.status_code = 500
        return response

#Endpoint para agregar un video a la base de datos
@app.route('/AgregarVideo', methods=['POST'])
@admin_required()
def AgregarVideo():
    try:
        nombre = request.form['nombre']
        fecha = request.form['fecha']
        resena = request.form['resena']
        duracion = request.form['duracion']
        clasificacion = request.form['clasificacion']
        portada = request.files['portada']
        video = request.files['video']
        ruta_portada = ""
        if portada is not None:
            filename = secure_filename(portada.filename)
            portada.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            ruta_portada = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        else:
            response = make_response(jsonify({'status': 'error', 'RetroTV': 'ERROR AL OBTENER LA PORTADA'}))
            response.status_code = 400
            return response   

        id_clasificacion = controlador.GetIdClasificacion(clasificacion)
        if id_clasificacion is not None:
            if video is not None:
                # Cambiar el nombre del archivo de video
                new_filename = secure_filename(nombre + '.mp4')
                id_vid = controlador.ObtenerVideo(new_filename)
                if id_vid is not None:
                    response = make_response(jsonify({'status': 'error', 'RetroTV': 'ERROR, EL VIDEO YA EXISTE EN LA BASE DE DATOS'}))
                    response.status_code = 400
                    return response 
                else:
                    # Subir el archivo de video a S3 con el nuevo nombre
                    
                    object_name = f"videos/{new_filename}"  # Ruta dentro del bucket donde se almacenará el video
                    try:
                        s3.upload_fileobj(video, bucket_name, object_name)
                        print("Archivo de video subido exitosamente a S3 con el nuevo nombre")
                        insertado = controlador.AgregarVideo(new_filename, fecha, resena, duracion, ruta_portada, id_clasificacion)
                        if insertado:
                            response_data = {
                            "status":"success",
                            "RetroTV":"VIDEO AGREGADO EXITOSAMENTE"
                            }
                            response = make_response(jsonify(response_data))
                            response.status_code = 200
                             # Establecer el encabezado "Content-Type" en la respuesta
                            response.headers['Content-Type'] = 'video/mp4'
                            response.headers['Content-Disposition'] = 'inline'
                            return response
                        else:
                            response = make_response(jsonify({'status': 'error', 'RetroTV': 'ERROR AL SUBIR LOS DATOS DEL VIDEO A LA BASE DE DATOS'}))
                            response.status_code = 400
                            return response   
                    except NoCredentialsError:
                        print("Credenciales de AWS no encontradas")
                        response = make_response(jsonify({'status': 'error', 'RetroTV': 'ERROR AL SUBIR VIDEO EN AWS'}))
                        response.status_code = 400
                        return response
            else:
                response = make_response(jsonify({'status': 'error', 'RetroTV': 'ERROR AL OBTENER EL VIDEO'}))
                response.status_code = 400
                return response
        else:
            response = make_response(jsonify({'status': 'error', 'RetroTV': 'ERROR AL OBTENER EL ID DE LA CLASIFICACION'}))
            response.status_code = 400
            return response
    except:
        response = make_response(jsonify({'status': 'error', 'RetroTV': 'ERROR DE COMUNICACION'}))
        response.status_code = 500
        return response

#Endpoint para actualizar la informacion del video
@app.route('/EditarVideoInfo', methods={'PUT'})
@admin_required()
def EditarVideoInfo():
    try:
        id_vid = request.form['id']
        fecha = request.form['fecha']
        resena = request.form['resena']
        duracion = request.form['duracion']
        clasificacion = request.form['clasificacion']
        portada = request.files['portada']
        ruta_portada = ""
        if portada is not None:
            filename = secure_filename(portada.filename)
            portada.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            ruta_portada = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        else:
            response = make_response(jsonify({'status': 'error', 'RetroTV': 'ERROR AL OBTENER LA PORTADA'}))
            response.status_code = 400
            return response   

        id_clasificacion = controlador.GetIdClasificacion(clasificacion)
        if id_clasificacion is not None:
            res = controlador.EditarVideoInfo(fecha, resena, duracion, id_clasificacion, ruta_portada, id_vid)
            if res is not None:
                response = make_response(jsonify({'status':'success','RetroTV': res}))
                response.status_code = 200
                return response 
            else:
                response = make_response(jsonify({'status':'error','RetroTV': 'ERROR AL ACTUALIZAR LA INFORMACION DEL VIDEO'}))
                response.status_code = 400
                return response
        else:
            response = make_response(jsonify({'status': 'error', 'RetroTV': 'ERROR AL OBTENER EL ID DE LA CLASIFICACION'}))
            response.status_code = 400
            return response
    except:
        response = make_response(jsonify({'status':'error','RetroTV': 'ERROR DE COMUNICACION'}))
        response.status_code = 500
        return response 
    
#Endpoint para obtener una lista con los videos almacenados en la base de datos
@app.route('/ObtenerVideosLista', methods = ['GET'])
@auth_required()
def ObtenerVideosLista():
    try:
        videos = controlador.ObtenerVideosLista()
        if videos is not None:
            response = make_response(jsonify({'status':'success', 'RetroTV':'SE HAN OBTENIDO LOS VIDEOS EXITOSAMENTE', 'videos':videos}))
            response.status_code = 200
            return response
        else:
            response = make_response(jsonify({'status':'error', 'RetroTV':'ERROR AL OBTENER LOS VIDEOS', 'videos': None}))
            response.status_code = 400
            return response  
    except:
        response = make_response(jsonify({'status':'error','RetroTV': 'ERROR DE COMUNICACION', 'videos':None}))
        response.status_code = 500
        return response

#Endpoint para eliminar un video del sistema y de S3
@app.route('/EliminarVideo/<nombre>', methods=['DELETE'])
@admin_required()
def EliminarVideo(nombre):
    try:
        # Eliminar el video de S3
        try:
            s3.delete_object(Bucket=bucket_name,Key="videos/"+nombre)
        except:
            # Si no se eliminó correctamente de S3, devolver un error
            return make_response(jsonify({'status': 'error', 'RetroTV': 'ERROR AL ELIMINAR EL VIDEO DE S3'}), 400)
         # Eliminar el video de la base de datos
        mensaje = controlador.EliminarVideo(nombre)
        
        # Verificar si el video se eliminó correctamente de la base de datos
        if mensaje is not None:
            return make_response(jsonify({'status': 'success', 'RetroTV': mensaje}), 200)
        else:
            return make_response(jsonify({'status': 'error', 'RetroTV': 'ERROR AL ELIMINAR EL VIDEO DE LA BASE DE DATOS'}), 400)    
    except:
        return make_response(jsonify({'status': 'error', 'RetroTV': 'ERROR DE COMUNICACION'}), 500)

#Endpoint para saber si un usuario cuenta con suscripcion activa
@app.route('/IsSubscriptionActive', methods = ['POST'])
def IsSubscriptionActive():
    try:
        data = request.get_json()
        id = data['id']
        suscripcion = controlador.IsSubscriptionActive(id)
        if suscripcion is not None:
            return make_response(jsonify({'status': 'success', 'RetroTV': 'ESTADO DE LA SUSCRIPCION DEL USUARIO OBTENIDA EXITOSAMENTE', 'suscripcion':suscripcion}), 200)
        else:
            return make_response(jsonify({'status': 'error', 'RetroTV': 'ERROR AL OBTENER EL ESTADO DE LA SUSCRIPCION DEL USUARIO', 'suscripcion':None}), 400)
    except:
        return make_response(jsonify({'status': 'error', 'RetroTV': 'ERROR DE COMUNICACION', 'suscripcion':None}), 500)


#Endpoint para retornar los datos del video y una URL firmada del video
@app.route('/GetVideoData', methods=['POST'])
@auth_required()
def GetVideoData():
    try:
        enviados = request.get_json()
        id_vid = enviados['id']
        data = controlador.GetVideoData(id_vid)
        if data is not None:
            try:
                url = os.environ.get('CLOUDFRONT_URL') + '/videos/' + data['nombre']
                ##FECHA DE EXPIRACION DEBE ESTAR DEFINIDA EN FORMATO UTC
                expire_date = datetime.datetime.now(datetime.timezone.utc)+ datetime.timedelta(hours=3)
                ##DEFINIR UN SIGNER DE CLOUDFRONT PARA LAS URL
                key_id = os.environ.get('CF_PUBLIC_KEY_ID')
                cloudfront_signer = CloudFrontSigner(key_id, rsa_signer)  # Especificar la versión V4
                # Crear una URL firmada que será válida hasta la fecha de expiración específica utilizando una política predefinida.
                signed_url = cloudfront_signer.generate_presigned_url(url, date_less_than=expire_date)
                if signed_url is not None:
                    print("URL firmada:")
                    print(signed_url)
                    data_obj = {
                        "nombre": data['nombre'],
                        "fecha": data['fecha'],
                        "resena": data['resena'],
                        "duracion": data['duracion'],
                        "portada": data['portada'],
                        "clasificacion": data['clasificacion'],
                        "video_url": signed_url
                    }
                    response = make_response(jsonify({'status': 'success', 'RetroTV': 'VIDEO OBTENIDO EXITOSAMENTE', 'data': data_obj}), 200)
                     # Establecer el encabezado "Content-Type" en la respuesta
                    response.headers['Content-Type'] = 'video/mp4'
                    response.headers['Content-Disposition'] = 'inline'
                    return response
                else:
                    return make_response(jsonify({'status': 'error', 'RetroTV': 'ERROR AL OBTENER LA URL FIRMADA DEL VIDEO', 'data': None}), 400)
            except NoCredentialsError:
                return make_response(jsonify({'status': 'error', 'RetroTV': 'ERROR AL OBTENER LA URL FIRMADA DEL VIDEO', 'data': None}), 400)
            except ClientError as e:
                error_message = str(e)
                print("Error al generar la URL firmada:", error_message)
                return make_response(jsonify({'status': 'error', 'RetroTV': 'ERROR AL GENERAR LA URL FIRMADA DEL VIDEO', 'data': None}), 400)
        else:
            return make_response(jsonify({'status': 'error', 'RetroTV': 'ERROR AL OBTENER LA INFORMACION DEL VIDEO', 'data': None}), 400)
    except:
        return make_response(jsonify({'status': 'error', 'RetroTV': 'ERROR DE COMUNICACION', 'data': None}), 500)

#Endpoint para crear una nueva clasificacion de videos
@app.route('/AgregarVideoFavoritos', methods=['POST'])
@auth_required()
def AgregarVideoFavoritos():
    try:
        datos = request.get_json()
        id_usu = datos['id_usuario']
        id_vid = datos['id_video']
        resp = controlador.AgregarVideoFavoritos(id_usu, id_vid)
        if resp:
            response = make_response(jsonify({'status':'success', 'RetroTV':"EL VIDEO SE HA AGREGADO A LA LISTA DE FAVORITOS EXITOSAMENTE"}))
            response.status_code = 200
            return response
        else:
            response = make_response(jsonify({'status':'error', 'RetroTV':'ERROR AL AGREGAR EL VIDEO A LA LISTA DE FAVORITOS'}))
            response.status_code = 400
            return response
    except:
        response = make_response(jsonify({'status':'error','RetroTV': 'ERROR DE COMUNICACION'}))
        response.status_code = 500
        return response 

 #Endpoint para eliminar un video de la lista de favoritos
@app.route('/EliminarVideoFavoritos', methods=['POST'])
@auth_required()
def EliminarVideoFavoritos():
    try:
        datos = request.get_json()
        id_usu = datos['id_usuario']
        id_vid = datos['id_video']
         # Eliminar el video de la base de datos
        mensaje = controlador.EliminarVideoFavoritos(id_usu, id_vid)
        
        # Verificar si el video se eliminó correctamente de la base de datos
        if mensaje is not None:
            return make_response(jsonify({'status': 'success', 'RetroTV': mensaje}), 200)
        else:
            return make_response(jsonify({'status': 'error', 'RetroTV': 'ERROR AL ELIMINAR EL VIDEO DE LA BASE DE DATOS'}), 400)    
    except:
        return make_response(jsonify({'status': 'error', 'RetroTV': 'ERROR DE COMUNICACION'}), 500)

#Endpoint para obtener una lista con los videos almacenados en la lista de favoritos del usuario logueado
@app.route('/ObtenerVideosListaFavoritos', methods = ['POST'])
@auth_required()
def ObtenerVideosListaFavoritos():
    try:
        datos = request.get_json()
        id_usu = datos['id_usuario']
        videos = controlador.ObtenerVideosListaFavoritos(id_usu)
        if videos is not None:
            response = make_response(jsonify({'status':'success', 'RetroTV':'SE HAN OBTENIDO LOS VIDEOS FAVORITOS EXITOSAMENTE', 'videos':videos}))
            response.status_code = 200
            return response
        else:
            response = make_response(jsonify({'status':'error', 'RetroTV':'ERROR AL OBTENER LOS VIDEOS FAVORITOS', 'videos': None}))
            response.status_code = 400
            return response  
    except:
        response = make_response(jsonify({'status':'error','RetroTV': 'ERROR DE COMUNICACION', 'videos':None}))
        response.status_code = 500
        return response


#Endpoint para saber si un usuario cuenta con suscripcion activa
@app.route('/IsFavoriteOf', methods = ['POST'])
@auth_required()
def IsFavoriteOf():
    try:
        data = request.get_json()
        id_usu = data['id_usuario']
        id_vid = data['id_video']
        fav = controlador.IsFavoriteOf(id_usu, id_vid)
        if fav is not None:
            return make_response(jsonify({'status': 'success', 'RetroTV': 'SE HA VERIFICADO QUE EL VIDEO ES FAVORITO PARA EL USUARIO CON SESION ACTIVA EXITOSAMENTE', 'favorito':fav}), 200)
        else:
            return make_response(jsonify({'status': 'error', 'RetroTV': 'ERROR AL VERIFICAR SI EL VIDEO ES FAVORITO PARA EL USUARIO CON SESION ACTIVA', 'favorito':None}), 400)
    except:
        return make_response(jsonify({'status': 'error', 'RetroTV': 'ERROR DE COMUNICACION', 'favorito':None}), 500)
    
#Endpoint para obtener la lista de videos segun su clasificacion
@app.route('/ObtenerVideosClasificacion/<clasificacion>', methods = ['GET'])
@auth_required()
def ObtenerVideosClasificacion(clasificacion):
    try:
        videos = controlador.ObtenerVideosClasificacion(clasificacion)
        if videos is not None:
            response = make_response(jsonify({'status':'success', 'RetroTV':'SE HAN OBTENIDO LOS VIDEOS EXITOSAMENTE', 'videos':videos}))
            response.status_code = 200
            return response
        else:
            response = make_response(jsonify({'status':'error', 'RetroTV':'ERROR AL OBTENER LOS VIDEOS', 'videos': None}))
            response.status_code = 400
            return response  
    except:
        response = make_response(jsonify({'status':'error','RetroTV': 'ERROR DE COMUNICACION', 'videos':None}))
        response.status_code = 500
        return response

# Endpoint para obtener la lista de videos segun su clasificacion
@app.route('/reporte/consulta1', methods = ['GET'])
#@auth_required()
def VideosExistentesConClasificacion():
    try:
        videos = reportes.VideosExistentes_ConClasificacion()
        if videos is not None:
            response = make_response(jsonify({'status':'success', 'RetroTV':'SE HAN OBTENIDO LOS VIDEOS EXITOSAMENTE', 'videos':videos}))
            response.status_code = 200
            return response
        elif videos is None:
            response = make_response(jsonify({'status':'error', 'RetroTV':'NO HAY VIDEOS DISPONIBLES', 'canales': None}))
            response.status_code = 200
            return response
        else:
            response = make_response(jsonify({'status':'error', 'RetroTV':'ERROR AL OBTENER LOS VIDEOS', 'videos': None}))
            response.status_code = 400
            return response
    except:
        response = make_response(jsonify({'status':'error','RetroTV': 'ERROR DE COMUNICACION', 'videos':None}))
        response.status_code = 500
        return response
    
# Endpoint para obtener la lista de clasificaciones
@app.route('/reporte/consulta2', methods = ['GET'])
#@auth_required()
def ListaClasificaciones():
    try:
        clasificaciones = reportes.ListaClasificaciones()
        if clasificaciones is not None:
            response = make_response(jsonify({'status':'success', 'RetroTV':'SE HAN OBTENIDO LAS CLASIFICACIONES EXITOSAMENTE', 'clasificaciones':clasificaciones}))
            response.status_code = 200
            return response
        elif clasificaciones is None:
            response = make_response(jsonify({'status':'error', 'RetroTV':'NO HAY CLASIFICACIONES DISPONIBLES', 'canales': None}))
            response.status_code = 200
            return response
        else:
            response = make_response(jsonify({'status':'error', 'RetroTV':'ERROR AL OBTENER LAS CLASIFICACIONES', 'clasificaciones': None}))
            response.status_code = 400
            return response
    except:
        response = make_response(jsonify({'status':'error','RetroTV': 'ERROR DE COMUNICACION', 'clasificaciones':None}))
        response.status_code = 500
        return response
    
# Endpoint para obtener la lista de canales
@app.route('/reporte/consulta3', methods = ['GET'])
#@auth_required()
def ListaCanales():
    try:
        canales = reportes.ListaCanales()
        if canales is not None:
            response = make_response(jsonify({'status':'success', 'RetroTV':'SE HAN OBTENIDO LOS CANALES EXITOSAMENTE', 'canales':canales}))
            response.status_code = 200
            return response
        elif canales is None:
            response = make_response(jsonify({'status':'error', 'RetroTV':'NO HAY CANALES DISPONIBLES', 'canales': None}))
            response.status_code = 200
            return response
        else:
            response = make_response(jsonify({'status':'error', 'RetroTV':'ERROR AL OBTENER LOS CANALES', 'canales': None}))
            response.status_code = 400
            return response
    except:
        response = make_response(jsonify({'status':'error','RetroTV': 'ERROR DE COMUNICACION', 'canales':None}))
        response.status_code = 500
        return response
    
# Endpoint para obtener la lista de usuarios
@app.route('/reporte/consulta4', methods = ['GET'])
#@auth_required()
def ListaUsuarios():
    try:
        usuarios = reportes.ListaUsuarios()
        if usuarios is not None:
            response = make_response(jsonify({'status':'success', 'RetroTV':'SE HAN OBTENIDO LOS USUARIOS EXITOSAMENTE', 'usuarios':usuarios}))
            response.status_code = 200
            return response
        elif usuarios is None:
            response = make_response(jsonify({'status':'error', 'RetroTV':'NO HAY USUARIOS DISPONIBLES', 'usuarios': None}))
            response.status_code = 200
            return response
        else:
            response = make_response(jsonify({'status':'error', 'RetroTV':'ERROR AL OBTENER LOS USUARIOS', 'usuarios': None}))
            response.status_code = 400
            return response
    except:
        response = make_response(jsonify({'status':'error','RetroTV': 'ERROR DE COMUNICACION', 'usuarios':None}))
        response.status_code = 500
        return response

# Endpoint para obtener la lista de usuarios con suscripción activa con fecha de inicio y fecha de vencimiento
@app.route('/reporte/consulta5', methods = ['GET'])
#@auth_required()
def ListaSuscripciones():
    try:
        suscripciones = reportes.ListaSuscripciones()
        if suscripciones is not None:
            response = make_response(jsonify({'status':'success', 'RetroTV':'SE HAN OBTENIDO LAS SUSCRIPCIONES EXITOSAMENTE', 'suscripciones':suscripciones}))
            response.status_code = 200
            return response
        elif suscripciones is None:
            response = make_response(jsonify({'status':'error', 'RetroTV':'NO HAY SUSCRIPCIONES DISPONIBLES', 'suscripciones': None}))
            response.status_code = 200
            return response
        else:
            response = make_response(jsonify({'status':'error', 'RetroTV':'ERROR AL OBTENER LAS SUSCRIPCIONES', 'suscripciones': None}))
            response.status_code = 400
            return response
    except:
        response = make_response(jsonify({'status':'error','RetroTV': 'ERROR DE COMUNICACION', 'suscripciones':None}))
        response.status_code = 500
        return response
    
# Endpoint para obtener la lista de usuarios con suscripción activa con fecha de inicio y fecha de vencimiento
@app.route('/reporte/consultaE1', methods = ['GET'])
#@auth_required()
def ListaVideosCarrusel():
    try:
        videos = reportes.ListaVideosCarrusel()
        if videos is not None:
            response = make_response(jsonify({'status':'success', 'RetroTV':'SE HAN OBTENIDO LOS VIDEOS EXITOSAMENTE', 'videos':videos}))
            response.status_code = 200
            return response
        elif videos is None:
            response = make_response(jsonify({'status':'error', 'RetroTV':'NO HAY VIDEOS DISPONIBLES', 'videos': None}))
            response.status_code = 200
            return response
        else:
            response = make_response(jsonify({'status':'error', 'RetroTV':'ERROR AL OBTENER LOS VIDEOS', 'videos': None}))
            response.status_code = 400
            return response
    except:
        response = make_response(jsonify({'status':'error','RetroTV': 'ERROR DE COMUNICACION', 'videos':None}))
        response.status_code = 500
        return response

# Endpoint para obtener la cantidad de subscripciones activas e inactivas
@app.route('/reporte/consultaE2', methods = ['GET'])
#@auth_required()
def SuscripcionesActivasInactivas():
    try:
        suscripciones = reportes.SuscripcionesActivasInactivas()
        if suscripciones is not None:
            response = make_response(jsonify({'status':'success', 'RetroTV':'SE HAN OBTENIDO LAS SUSCRIPCIONES EXITOSAMENTE', 'suscripciones':suscripciones}))
            response.status_code = 200
            return response
        elif suscripciones is None:
            response = make_response(jsonify({'status':'error', 'RetroTV':'NO HAY SUSCRIPCIONES DISPONIBLES', 'suscripciones': None}))
            response.status_code = 200
            return response
        else:
            response = make_response(jsonify({'status':'error', 'RetroTV':'ERROR AL OBTENER LAS SUSCRIPCIONES ', 'suscripciones': None}))
            response.status_code = 400
            return response
    except:
        response = make_response(jsonify({'status':'error','RetroTV': 'ERROR DE COMUNICACION', 'videos':None}))
        response.status_code = 500
        return response
    
# Función para generar el reporte
@app.route('/reporte/generar', methods = ['GET'])
def GenerarReporte():
    try:
        videos_clasificacion = reportes.VideosExistentes_ConClasificacion()
        lista_clasificacion = reportes.ListaClasificaciones()
        lista_canales = reportes.ListaCanales()
        lista_usuarios = reportes.ListaUsuarios()
        lista_suscripcion = reportes.ListaSuscripciones()
        response = make_response(jsonify({'status':'success', 'RetroTV':'SE HAN OBTENIDO DATOS DEL REPORTE CORRECTAMENTE', 
                                          'videos_existente': videos_clasificacion, 'lista_clasificacion': lista_clasificacion, 
                                          'lista_canales': lista_canales, 'lista_usuarios': lista_usuarios, 'lista_suscripciones': lista_suscripcion}))
        response.status_code = 200
        return response
    except:
        response = make_response(jsonify({'status':'error','RetroTV': 'ERROR DE COMUNICACION', 'reporte':None}))
        response.status_code = 500
        return response



#FUNCION PARA FIRMAR LAS URL'S GENERADAS PARA ACCEDER AL CONTENIDO CON ACCESO RESTRINGIDO
def rsa_signer(message):
    with open(os.environ.get("PRIVATE_KEY_PATH"), 'rb') as key_file:
        private_key = serialization.load_pem_private_key(
            key_file.read(),
            password=None,
            backend=default_backend()
        )
    return private_key.sign(message, padding.PKCS1v15(), hashes.SHA1())

if __name__ == '__main__':
    print("SERVIDOR INICIADO EN EL PUERTO: 5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
