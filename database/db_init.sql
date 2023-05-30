DROP TABLE IF EXISTS CANAL;

DROP TABLE IF EXISTS VIDEO;

DROP TABLE IF EXISTS CLASIFICACION;

DROP TABLE IF EXISTS FAVORITO;

DROP TABLE IF EXISTS SUSCRIPCION;

DROP TABLE IF EXISTS USUARIO;

CREATE TABLE USUARIO (
USU_ID BIGINT NOT NULL AUTO_INCREMENT,
NOMBRE VARCHAR(100) NOT NULL,
CORREO VARCHAR(100) NOT NULL,
USUARIO VARCHAR(10) NOT NULL UNIQUE,
CONTRASENA TEXT NOT NULL,
ROL VARCHAR(50) NOT NULL,
GENERO VARCHAR(1) NOT NULL,
FECHA_NACIMIENTO DATE NOT NULL,
TELEFONO VARCHAR(15) NOT NULL,
ESTADO VARCHAR(10) NOT NULL,
PRIMARY KEY (USU_ID)
);

CREATE TABLE CANAL (
ID_CAN BIGINT NOT NULL,
NOMBRE TEXT NOT NULL,
ENLACE TEXT NOT NULL,
RESENA TEXT NOT NULL,
PORTADA TEXT NOT NULL,
PRIMARY KEY (ID_CAN)
);

CREATE TABLE CLASIFICACION (
CLA_ID BIGINT NOT NULL AUTO_INCREMENT,
NOMBRE VARCHAR(75) NOT NULL UNIQUE,
PRIMARY KEY (CLA_ID)
);

CREATE TABLE VIDEO (
VID_ID BIGINT NOT NULL AUTO_INCREMENT,
BUCKET TEXT NOT NULL,
LLAVE TEXT NOT NULL,
FECHA DATETIME NOT NULL,
NOMBRE TEXT NOT NULL,
RESENA TEXT NOT NULL,
DURACION TEXT NOT NULL,
PORTADA TEXT NOT NULL,
CLASIFICACION_CLA_ID BIGINT NOT NULL,
PRIMARY KEY (VID_ID),
FOREIGN KEY (CLASIFICACION_CLA_ID) REFERENCES CLASIFICACION (CLA_ID) ON DELETE NO ACTION ON UPDATE NO ACTION
);


CREATE TABLE FAVORITO (
FAV_ID BIGINT NOT NULL AUTO_INCREMENT,
USUARIO_USU_ID BIGINT NOT NULL,
VIDEO_VID_ID BIGINT NOT NULL,
PRIMARY KEY (FAV_ID),
FOREIGN KEY (USUARIO_USU_ID) REFERENCES USUARIO (USU_ID) ON DELETE CASCADE ON UPDATE NO ACTION,
FOREIGN KEY (VIDEO_VID_ID) REFERENCES VIDEO (VID_ID) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE SUSCRIPCION (
SUS_ID BIGINT NOT NULL AUTO_INCREMENT,
FECHA_INICIO DATETIME NOT NULL,
FECHA_FIN DATETIME NOT NULL,
USUARIO_USU_ID BIGINT NOT NULL,
PRIMARY KEY (SUS_ID),
FOREIGN KEY (USUARIO_USU_ID) REFERENCES USUARIO (USU_ID) ON DELETE CASCADE ON UPDATE NO ACTION
);

INSERT INTO USUARIO(NOMBRE,CORREO,USUARIO,CONTRASENA,ROL,GENERO,FECHA_NACIMIENTO,TELEFONO,ESTADO) VALUES('ADMINISTRADOR', 'carlosmartz1995@gmail.com', 'admin', 'pbkdf2:sha256:600000$wlmhu5dUvUHVPtm0$ed23f52cbe4f2b4ba482662ada5c9faa77fdea38d6ea97d94582691df3902c41', 'ADMINISTRADOR','M','1995-07-20','502-4583-9132','ACTIVO');

DELIMITER $$
CREATE PROCEDURE ActivarSuscripcion(IN usuario_id BIGINT, OUT salida VARCHAR(250))
BEGIN
    DECLARE usuario_estado VARCHAR(10);
    DECLARE suscripcion_id BIGINT;
    SET usuario_estado = (SELECT ESTADO FROM USUARIO WHERE USU_ID = usuario_id);
    IF usuario_estado = 'INACTIVO' THEN
        SET @fecha_inicio = NOW();
        SET @fecha_fin = DATE_ADD(@fecha_inicio, INTERVAL 1 MONTH);
        INSERT INTO SUSCRIPCION (FECHA_INICIO, FECHA_FIN, USUARIO_USU_ID) VALUES (@fecha_inicio, @fecha_fin, usuario_id);
        UPDATE USUARIO SET ESTADO = 'ACTIVO' WHERE USU_ID = usuario_id;
        SET salida = "SE ACTIVO LA SUSCRIPCION EXITOSAMENTE";
    ELSE
        SET salida = "ERROR, EL USUARIO YA CUENTA CON UNA SUSCRIPCION ACTIVA";
    END IF;
END$$
DELIMITER ;



DELIMITER $$
CREATE PROCEDURE CancelarSuscripcion(IN usuario_id BIGINT, OUT salida VARCHAR(250))
BEGIN
    DECLARE usuario_estado VARCHAR(10);
    SELECT ESTADO INTO usuario_estado FROM USUARIO WHERE USU_ID = usuario_id;
    IF usuario_estado = 'ACTIVO' THEN
        DELETE FROM SUSCRIPCION WHERE USUARIO_USU_ID = usuario_id;
        UPDATE USUARIO SET ESTADO = 'INACTIVO' WHERE USU_ID = usuario_id;
        SET salida = "SE HA CANCELADO LA SUSCRIPCION EXITOSAMENTE";
    ELSE
        SET salida = "ERROR, EL USUARIO NO TIENE UNA SUSCRIPCION ACTIVA ACTUALMENTE"; 
    END IF;
END$$
DELIMITER ;


DELIMITER $$
CREATE EVENT eliminar_suscripcion_event
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
BEGIN
    DECLARE fecha_actual DATE;
    SET fecha_actual = CURDATE();
    DELETE FROM SUSCRIPCION WHERE FECHA_FIN <= fecha_actual;
    UPDATE USUARIO
    SET ESTADO = 'INACTIVO'
    WHERE USU_ID IN (
        SELECT USUARIO_USU_ID
        FROM SUSCRIPCION
        WHERE FECHA_FIN <= fecha_actual
    );
END$$
DELIMITER ;