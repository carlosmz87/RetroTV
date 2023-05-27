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