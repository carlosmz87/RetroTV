import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class ConexionSMTP:
    def __init__(self, smtp_server, smtp_port, username, password):
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port
        self.username = username
        self.password = password
        self.server = None

    def conectar(self):
        try:
            self.server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            self.server.starttls()
            self.server.login(self.username, self.password)
            print("CONEXION SMTP EXITOSA")
        except Exception as e:
            print("ERROR DE CONEXION SMTP:", str(e))

    def desconectar(self):
        if self.server:
            self.server.quit()
            print("CONEXION SMTP CERRADA")

    def enviar_correo(self, destinatario, asunto, contenido):
        mensaje = MIMEMultipart()
        mensaje['From'] = self.username
        mensaje['To'] = destinatario
        mensaje['Subject'] = asunto

        cuerpo_mensaje = contenido
        mensaje.attach(MIMEText(cuerpo_mensaje, 'plain'))

        try:
            self.server.send_message(mensaje)
            print("CORREO ENVIADO A: ", destinatario)
        except Exception as e:
            print("ERROR AL ENVIAR CORREO:", str(e))

