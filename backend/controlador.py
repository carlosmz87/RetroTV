from conexion import obtener_conexion

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

