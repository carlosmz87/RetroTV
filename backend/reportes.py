import base64
from conexion import obtener_conexion

# Funcion para obtener la lista de videos existentes
def VideosExistentes_ConClasificacion():
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            query = """
                SELECT V.NOMBRE AS Nombre_Video, C.NOMBRE AS Clasificacion
                FROM VIDEO V
                INNER JOIN CLASIFICACION C ON V.CLASIFICACION_CLA_ID = C.CLA_ID;"""
            cursor.execute(query)
            videosExistentes = cursor.fetchall()
            
            if len(videosExistentes) == 0:
                print("No se encontraron videos existentes.")
                return None
            else:
                resultados = []
                for video in videosExistentes:
                    nombre_video, clasificacion = video
                    resultados.append({
                        "Nombre_Video": nombre_video,
                        "Clasificacion": clasificacion
                    })
                # Imprimir los datos por consola
                # for resultado in resultados:
                #     print(f"Nombre del Video: {resultado['Nombre_Video']}")
                #     print(f"Clasificación: {resultado['Clasificacion']}")
                return resultados
    except Exception as e:
        print(f"Error: {str(e)}")
        return None
    finally:
        conexion.close()

# Funcion para obtener la lista de clasificaciones
def ListaClasificaciones():
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            query = "SELECT NOMBRE AS Clasificacion FROM CLASIFICACION;"
            cursor.execute(query)
            clasificaciones = cursor.fetchall()
            
            if len(clasificaciones) == 0:
                print("No se encontraron clasificaciones.")
                return None
            else:
                resultados = []
                for clasificacion in clasificaciones:
                    nombre_clasificacion = clasificacion
                    resultados.append({
                        "clasificacion": nombre_clasificacion[0]
                    })
                    print(nombre_clasificacion)
                # Imprimir los datos por consola
                # for resultado in resultados:
                #     print(f"Nombre de clasificacion: {resultado['nombre_clasificacion']}")
                return resultados
    except Exception as e:
        print(f"Error: {str(e)}")
        return None
    finally:
        conexion.close()

# Funcion para obtener la lista de canales existente
def ListaCanales():
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            query = """
                SELECT NOMBRE AS Canal, ENLACE AS Enlace, RESENA AS Resena
                FROM CANAL;"""
            cursor.execute(query)
            canales = cursor.fetchall()
            
            if len(canales) == 0:
                print("No se encontraron canales existentes.")
                resultados = [{"canal": "No hay canales existentes", "enlace": "No hay canales existentes", "resena": "No hay canales existentes"}]
                return resultados
            else:
                resultados = []
                for canal in canales:
                    nombre_canal, enlace, resena = canal
                    resultados.append({
                        "canal": nombre_canal,
                        "enlace": enlace,
                        "resena": resena
                    })
                # Imprimir los datos por consola
                # for resultado in resultados:
                #     print(f"Nombre de canal: {resultado['canal']}")
                #     print(f"Enlace: {resultado['enlace']}")
                #     print(f"Reseña: {resultado['resena']}")
                return resultados
    except Exception as e:
        print(f"Error: {str(e)}")
        return None
    finally:
        conexion.close()

# Funcion para obtener la lista de usuarios
def ListaUsuarios():
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            query = """
                SELECT NOMBRE AS Nombre_Usuario, CORREO AS Correo, USUARIO AS Usuario, ROL AS Rol, 
                GENERO AS Genero, FECHA_NACIMIENTO AS Fecha_Nacimiento, TELEFONO AS Telefono, ESTADO AS Estado
                FROM USUARIO;"""
            cursor.execute(query)
            usuarios = cursor.fetchall()
            
            if len(usuarios) == 0:
                print("No se encontraron usuarios existentes.")
                return None
            else:
                resultados = []
                for usuario_ in usuarios:
                    nombre_usuario, correo, usuario, rol, genero, fecha_nacimiento, telefono, estado = usuario_
                    resultados.append({
                        "nombre":nombre_usuario,
                        "correo": correo,
                        "usuario": usuario,
                        "rol": rol,
                        "genero": genero,
                        "fecha_nacimiento": fecha_nacimiento,
                        "telefono": telefono,
                        "estado": estado
                    })
                # Imprimir los datos por consola
                # for resultado in resultados:
                #     print(f"Nombre: {resultado['nombre']}")
                #     print(f"Correo: {resultado['correo']}")
                #     print(f"Usuario: {resultado['usuario']}")
                #     print(f"Rol: {resultado['rol']}")
                #     print(f"Genero: {resultado['genero']}")
                #     print(f"Fecha de Nacimiento: {resultado['fecha_nacimiento']}")
                #     print(f"Telefono: {resultado['telefono']}")
                #     print(f"Estado: {resultado['estado']}")
                return resultados
    except Exception as e:
        print(f"Error: {str(e)}")
        return None
    finally:
        conexion.close()

# Funcion para obtener la lista de usuarios con suscripción activa con fecha de inicio y fecha de vencimiento
def ListaSuscripciones():
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            query = """
                SELECT U.NOMBRE AS Nombre_Usuario, S.FECHA_INICIO AS Fecha_Inicio, S.FECHA_FIN AS Fecha_Final
                FROM SUSCRIPCION S
                INNER JOIN USUARIO U ON S.USUARIO_USU_ID = U.USU_ID
                WHERE U.ESTADO = 'ACTIVO';
                """
            cursor.execute(query)
            suscripciones = cursor.fetchall()
            
            if len(suscripciones) == 0:
                print("No se encontraron suscripciones existentes.")
                return None
            else:
                resultados = []
                for suscripcion in suscripciones:
                    nombre_usuario, fecha_inicio, fecha_final = suscripcion
                    resultados.append({
                        "usuario": nombre_usuario,
                        "fecha_inicio": fecha_inicio,
                        "fecha_final": fecha_final
                    })
                # Imprimir los datos por consola
                # for resultado in resultados:
                #     print(f"Nombre de usuario: {resultado['usuario']}")
                #     print(f"Fecha de inicio: {resultado['fecha_inicio']}")
                #     print(f"Fecha final: {resultado['fecha_final']}")
                return resultados
    except Exception as e:
        print(f"Error: {str(e)}")
        return None
    finally:
        conexion.close()

# Funcion para obtener el nombre del video y la descripción
def ListaVideosCarrusel():
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            query = """
                SELECT V.PORTADA AS URL, V.NOMBRE AS Nombre_Video, V.RESENA AS Descripcion
                FROM VIDEO V
                ORDER BY V.FECHA DESC
                LIMIT 5;
                """
            cursor.execute(query)
            videos = cursor.fetchall()
            
            if len(videos) == 0:
                print("No se encontraron videos existentes.")
                return None
            else:
                resultados = []
                for video in videos:
                    if video[0] is not None:
                        with open(video[0], 'rb') as f:
                            imagen_bytes = f.read()
                            imagen_base64 = base64.b64encode(imagen_bytes).decode('utf-8')
                            portada, nombre, resena = video
                            resultados.append({
                                "nombre": nombre,
                                "resena": resena,
                                "url" : portada,
                                "portada": imagen_base64
                        })  
                # Imprimir los datos por consola
                # for resultado in resultados:
                #     print(f"Nombre de usuario: {resultado['nombre']}")
                #     print(f"Reseña: {resultado['resena']}")
                #     print(f"Portada: {resultado['portada']}")
                return resultados
    except Exception as e:
        print(f"Error: {str(e)}")
        return None
    finally:
        conexion.close()

# Funcion para obtener la cantidad de suscripciones activas e inactivas
def SuscripcionesActivasInactivas():
    try:
        conexion = obtener_conexion()
        with conexion.cursor() as cursor:
            query = """
                SELECT 
                SUM(CASE WHEN U.ESTADO = 'ACTIVO' THEN 1 ELSE 0 END) AS Suscripciones_Pagadas,
                SUM(CASE WHEN U.ESTADO = 'INACTIVO' THEN 1 ELSE 0 END) AS Suscripciones_Gratuitas
                FROM USUARIO U
                WHERE U.USUARIO <> 'admin' AND U.ROL <> 'ADMINISTRADOR';
                """
            cursor.execute(query)
            suscripciones = cursor.fetchall()
            
            if len(suscripciones) == 0:
                print("No se encontraron suscripciones existentes.")
                return None
            else:
                resultados = []
                for suscripcion in suscripciones:
                    suscripcion_activa, suscripcion_inactiva = suscripcion
                    resultados.append({
                        "activas": suscripcion_activa,
                        "inactivas": suscripcion_inactiva,
                    })
                # Imprimir los datos por consola
                # for resultado in resultados:
                #     print(f"Suscripciones activas: {resultado['activas']}")
                #     print(f"Suscripciones inactivas: {resultado['inactivas']}")
                return resultados
    except Exception as e:
        print(f"Error: {str(e)}")
        return None
    finally:
        conexion.close()