from conexion import obtener_conexion
from werkzeug.security import check_password_hash


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


    