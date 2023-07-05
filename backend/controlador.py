import base64
import random
import string
from conexion import obtener_conexion
from werkzeug.security import check_password_hash, generate_password_hash


#Controlador para registrar usuarios en la base de datos
def RegistrarUsuario(nombre, usuario, correo, contrasena_encriptada, telefono, genero, fecha):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        try:
            cursor.execute("INSERT INTO USUARIO(NOMBRE,CORREO,USUARIO,CONTRASENA,ROL,GENERO,FECHA_NACIMIENTO,TELEFONO,ESTADO) VALUES(%s, %s, %s, %s, 'USUARIO',%s,%s,%s,'INACTIVO');",(nombre,correo,usuario,contrasena_encriptada,genero,fecha,telefono))
            conexion.commit()
            # Validar la inserción
            if cursor.rowcount > 0:
                # Inserción exitosa
                return True
            else:
                # Error en la inserción
                return False
        except:
            # Manejo de excepciones en caso de error
            return False
        finally:
            conexion.close()

#Funcion para autenticar el usuario registrado
def Autenticar(username, password):
    try:
        # Obtener conexión a la base de datos
        conexion = obtener_conexion()
        # Consultar el usuario en la base de datos
        with conexion.cursor() as cursor:
            query = "SELECT USU_ID, USUARIO, CONTRASENA, ROL FROM USUARIO WHERE USUARIO = %s"
            cursor.execute(query, (username,))
            user = cursor.fetchone()
        # Verificar las credenciales del usuario
        if user and check_password_hash(user[2], password):
            return {'id': user[0], 'username': user[1], 'rol': user[3]}
        else:
            return None
    except:
        return None
    finally:
        conexion.close()

#Funcion para recuperar las credenciales del usuario
def recover(correo):
    try:
        # Obtener conexión a la base de datos
        conexion = obtener_conexion()
        # Consultar el usuario en la base de datos
        with conexion.cursor() as cursor:
            query = "SELECT USUARIO FROM USUARIO WHERE CORREO = %s"
            cursor.execute(query, (correo,))
            user = cursor.fetchone()
        # Verificar las credenciales del usuario
        if user is not None:
            new_pass = generar_contrasena_temporal(user[0])
            if new_pass is not None:
                return {'username': user[0], 'contrasena': new_pass}
            else:
                return None
        else:
            return None
    except:
        return None
    finally:
        conexion.close()

#Funcion para generar una contraseña temporal
def generar_contrasena_temporal(username, longitud=8):
    caracteres = string.ascii_letters + string.digits + string.punctuation
    contrasena_temporal = ''.join(random.choice(caracteres) for _ in range(longitud))
    contrasena_encriptada = generate_password_hash(contrasena_temporal)
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            query = "UPDATE USUARIO SET CONTRASENA = %s WHERE USUARIO = %s"
            cursor.execute(query,(contrasena_encriptada, username))
            if cursor.rowcount > 0:
                # La actualización se realizó correctamente
                conexion.commit()
                return contrasena_temporal
            else:
                # No se realizó la actualización
                return None
    except:
        return None
    finally:
        conexion.close()

#Funcion para retornar todos los usuarios registrados
def ListarClientes():
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            query = "SELECT USU_ID, NOMBRE, CORREO, USUARIO, GENERO, FECHA_NACIMIENTO, TELEFONO, ESTADO AS SUSCRIPCION FROM USUARIO WHERE ROL = 'USUARIO'"
            cursor.execute(query)
            usuarios = cursor.fetchall()
            
            if len(usuarios) == 0:
                return None
            
            usuarios_obj = []
            
            for usuario in usuarios:
                usuario_obj = {
                    "id": usuario[0],
                    "nombre": usuario[1],
                    "correo": usuario[2],
                    "usuario": usuario[3],
                    "genero": usuario[4],
                    "fecha_nacimiento": usuario[5],
                    "telefono": usuario[6],
                    "suscripcion": usuario[7]
                }
                usuarios_obj.append(usuario_obj)
            
            return usuarios_obj
    except:
        return None
    finally:
        conexion.close()

# Función para llamar al procedimiento ActivarSuscripcion(id: int)
def ActivarSuscripcion(id):
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            salida = ""
            resultado = cursor.callproc("ActivarSuscripcion", (id, salida))
            conexion.commit()  
            if resultado:
                return resultado[1]
            else:
                return None
    except:
        return None
    finally:
        conexion.close()

# Función para llamar al procedimiento CancelarSuscripcion(id: int)
def CancelarSuscripcion(id):
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            salida = ""
            resultado = cursor.callproc("CancelarSuscripcion", (id, salida))
            conexion.commit()
            if resultado:
                return resultado[1]
            else:
                return None
    except:
        return None
    finally:
        conexion.close()

# Funcion para eliminar un usuario por id
def EliminarUsuario(id):
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            query = "DELETE FROM USUARIO WHERE USU_ID = %s"
            cursor.execute(query, (id,))
            if cursor.rowcount > 0:
                # La actualización se realizó correctamente
                conexion.commit()
                return "SE HA ELIMINADO EXITOSAMENTE EL USUARIO"
            else:
                # No se realizó la actualización
                return None

    except:
        return None
    finally:
        conexion.close()
    
#Funcion para retornar los datos del administrador
def PerfilAdministrador(id):
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            query = "SELECT NOMBRE, USUARIO, CORREO, TELEFONO FROM USUARIO WHERE USU_ID =%s AND ROL ='ADMINISTRADOR'"
            cursor.execute(query, (id,))
            datos = cursor.fetchone()
            if datos:
                datos_obj = {
                    "nombre":datos[0],
                    "usuario":datos[1],
                    "correo":datos[2],
                    "telefono":datos[3]
                }
                return datos_obj
            else:
                return None
    except:
        return None
    finally:
        conexion.close()

#Funcion para retornar los datos del usuario
def PerfilUsuario(id):
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            query = "SELECT NOMBRE, USUARIO, CORREO, TELEFONO, ESTADO FROM USUARIO WHERE USU_ID =%s AND ROL ='USUARIO'"
            cursor.execute(query, (id,))
            datos = cursor.fetchone()
            if datos:
                datos_obj = {
                    "nombre":datos[0],
                    "usuario":datos[1],
                    "correo":datos[2],
                    "telefono":datos[3],
                    "suscripcion":datos[4]
                }
                return datos_obj
            else:
                return None
    except:
        return None
    finally:
        conexion.close() 

#Funcion para crear una nueva clasificacion de videos
def CrearClasificacion(nombre):
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            query = "INSERT INTO CLASIFICACION(NOMBRE) VALUES(%s)"
            cursor.execute(query,(nombre,))
            conexion.commit()
            if cursor.rowcount > 0:
                # Inserción exitosa
                return True
            else:
                # Error en la inserción
                return False
    except:
        return False
    finally:
        conexion.close()

#Funcion para listar las clasificacion de videos
def ListarClasificaciones():
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            query = "SELECT NOMBRE FROM CLASIFICACION"
            cursor.execute(query)
            clasificaciones = cursor.fetchall()
            if len(clasificaciones) == 0:
                return None
            else:
                clasificaciones_obj = []
                for clasificacion in clasificaciones:
                    clasificacion_obj = {
                        "nombre":clasificacion[0]
                    }
                    clasificaciones_obj.append(clasificacion_obj)
                return clasificaciones_obj
    except:
        return None
    finally:
        conexion.close()

#Funcion para eliminar una clasificacion de videos
def EliminarClasificacion(nombre):
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            query = "DELETE FROM CLASIFICACION WHERE NOMBRE = %s"
            cursor.execute(query, (nombre,))
            if cursor.rowcount > 0:
                # La actualización se realizó correctamente
                conexion.commit()
                return "SE HA ELIMINADO CORRECTAMENTE LA CLASIFICACION"
            else:
                # No se realizó la actualización
                return None

    except:
        return None
    finally:
        conexion.close()

#Funcion para actualizar el correo del usuario:
def ActualizarCorreo(correo, id):
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            query = 'UPDATE USUARIO SET CORREO =%s WHERE USU_ID=%s'
            cursor.execute(query,(correo, id))
            if cursor.rowcount > 0:
                conexion.commit()
                return "SE HA ACTUALIZADO EXITOSAMENTE SU CORREO ELECTRONICO"
            else:
                return None
    except:
        return None
    finally:
        conexion.close()

#Funcion para actualizar el telefono del usuario:
def ActualizarTelefono(telefono, id):
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            query = 'UPDATE USUARIO SET TELEFONO =%s WHERE USU_ID=%s'
            cursor.execute(query,(telefono, id))
            if cursor.rowcount > 0:
                conexion.commit()
                return "SE HA ACTUALIZADO EXITOSAMENTE SU NUMERO DE TELEFONO"
            else:
                return None
    except:
        return None
    finally:
        conexion.close()

#Funcion para actualizar la contrasena del usuario:
def ActualizarContrasena(contrasena, id):
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            query = 'UPDATE USUARIO SET CONTRASENA =%s WHERE USU_ID=%s'
            cursor.execute(query,(contrasena, id))
            if cursor.rowcount > 0:
                conexion.commit()
                return "SE HA ACTUALIZADO EXITOSAMENTE SU CONTRASEÑA"
            else:
                return None
    except:
        return None
    finally:
        conexion.close()


#Funcion que retorne todos los correos de los usuarios
def ObtenerCorreosUsuarios():
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            query = 'SELECT CORREO FROM USUARIO WHERE ROL ="USUARIO"'
            cursor.execute(query)
            destinatarios = cursor.fetchall()
            if len(destinatarios) == 0:
                return None
            else:
                correos_obj = []
                for destinatario in destinatarios:
                    correos_obj.append(destinatario[0])
                return correos_obj
    except:
        return None
    finally:
        conexion.close()

#Funcion que retorna el id de la clasificacion
def GetIdClasificacion(nombre):
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            query = "SELECT CLA_ID FROM CLASIFICACION WHERE NOMBRE = %s"
            cursor.execute(query, (nombre,))
            id = cursor.fetchone()
            if id:
                return id[0]
            else: 
                return None
    except:
        return None
    finally:
        conexion.close()

#Funcion que agrega el video a la base de datos
def AgregarVideo(nombre, fecha, resena, duracion, portada, clasificacion):
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            query = "INSERT INTO VIDEO (NOMBRE, FECHA, RESENA, DURACION, PORTADA, CLASIFICACION_CLA_ID) VALUES(%s,%s,%s,%s,%s,%s)"
            cursor.execute(query, (nombre, fecha, resena, duracion, portada, clasificacion))
            conexion.commit()
            if cursor.rowcount > 0:
                # Inserción exitosa
                return True
            else:
                # Error en la inserción
                return False
    except:
        return False
    finally:
        conexion.close()

#Funcion para validar que el video no haya sido cargado previamente
def ObtenerVideo(nombre):
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            query = "SELECT VID_ID FROM VIDEO WHERE NOMBRE = %s"
            cursor.execute(query, (nombre,))
            id = cursor.fetchone()
            if id:
                return id[0]
            else: 
                return None
    except:
        return None
    finally:
        conexion.close()

#Funcion que retorna todos los videos almacenados en la base de datos
def ObtenerVideosLista():
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            query = """SELECT V.VID_ID, V.NOMBRE, V.FECHA, V.RESENA, V.DURACION, V.PORTADA, C.NOMBRE AS CLASIFICACION FROM VIDEO V
            JOIN CLASIFICACION C ON V.CLASIFICACION_CLA_ID = C.CLA_ID;"""
            cursor.execute(query)
            videos = cursor.fetchall()
            if len(videos) == 0:
                return None
            else:
                videos_obj = []
                for video in videos:
                    if video[5] is not None:
                        with open(video[5], 'rb') as f:
                            imagen_bytes = f.read()
                            imagen_base64 = base64.b64encode(imagen_bytes).decode('utf-8')
                    nombre_portada = video[5].split("/")
                    video_obj = {
                        "id":video[0],
                        "nombre":video[1],
                        "fecha":video[2],
                        "resena": video[3],
                        "duracion":video[4],
                        "portada":nombre_portada[-1],
                        "clasificacion":video[6],
                        "portada_b64": imagen_base64
                    }
                    videos_obj.append(video_obj)
                return videos_obj
    except:
        return None
    finally:
        conexion.close()

#Funcion para eliminar un video
def EliminarVideo(nombre):
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            query = "DELETE FROM VIDEO WHERE NOMBRE = %s"
            cursor.execute(query, (nombre,))
            if cursor.rowcount > 0:
                # La actualización se realizó correctamente
                conexion.commit()
                return "SE HA ELIMINADO CORRECTAMENTE EL VIDEO"
            else:
                # No se realizó la actualización
                return None

    except:
        return None
    finally:
        conexion.close()

#Funcion para determinar si un usuario cuenta con suscripcion activa
def IsSubscriptionActive(id):
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            query = "SELECT ESTADO FROM USUARIO WHERE USU_ID = %s"
            cursor.execute(query, (id,))
            estado = cursor.fetchone()
            if estado:
                return estado[0]
            else: 
                return None
    except:
        return None
    finally:
        conexion.close()

#Funcion que retorna la informacion de un video especifico
def GetVideoData(id):
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            query = """SELECT V.NOMBRE, V.FECHA, V.RESENA, V.DURACION, V.PORTADA, C.NOMBRE AS CLASIFICACION FROM VIDEO V
            JOIN CLASIFICACION C ON V.CLASIFICACION_CLA_ID = C.CLA_ID
            WHERE V.VID_ID = %s;"""
            cursor.execute(query, (id,))
            data = cursor.fetchone()
            if data:
                if data[4] is not None:
                    with open(data[4], 'rb') as f:
                        imagen_bytes = f.read()
                        imagen_base64 = base64.b64encode(imagen_bytes).decode('utf-8')
                        data_obj = {
                            "nombre":data[0],
                            "fecha": data[1],
                            "resena":data[2],
                            "duracion":data[3],
                            "portada":imagen_base64,
                            "clasificacion":data[5]
                        }
                        return data_obj
                else:
                    return None
            else: 
                return None
    except:
        return None
    finally:
        conexion.close()