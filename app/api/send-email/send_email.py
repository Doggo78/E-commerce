import smtplib
import sys
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os

# Cargar variables de entorno
load_dotenv()

# Obtener datos de configuración SMTP desde el archivo .env
SMTP_SERVER = os.getenv('SMTP_SERVER')
SMTP_PORT = int(os.getenv('SMTP_PORT'))
SMTP_USERNAME = os.getenv('SMTP_USERNAME')
SMTP_PASSWORD = os.getenv('SMTP_PASSWORD')
ADMIN_EMAIL = os.getenv('ADMIN_EMAIL')

# Validación de configuración SMTP
if not all([SMTP_SERVER, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD, ADMIN_EMAIL]):
    print("Error: faltan configuraciones en el archivo .env")
    sys.exit(1)

# Obtener datos del formulario desde la línea de comandos
if len(sys.argv) < 4:
    print("Error: faltan argumentos. Uso: python enviar_correo.py <nombre> <email_usuario> <mensaje>")
    sys.exit(1)

name = sys.argv[1]
user_email = sys.argv[2]
message_content = sys.argv[3]

# Configuración del mensaje para el usuario
msg_user = MIMEMultipart()
msg_user['From'] = SMTP_USERNAME
msg_user['To'] = user_email
msg_user['Subject'] = "Gracias por contactarnos"
body_user = f"""\
Hola {name},

Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.

Tu mensaje:
{message_content}

Saludos,
El equipo de soporte
"""
msg_user.attach(MIMEText(body_user, 'plain'))

# Configuración del mensaje para el administrador
msg_admin = MIMEMultipart()
msg_admin['From'] = SMTP_USERNAME
msg_admin['To'] = ADMIN_EMAIL
msg_admin['Subject'] = f"Nuevo mensaje de {name}"
body_admin = f"""\
Nombre: {name}
Correo: {user_email}

Mensaje:
{message_content}
"""
msg_admin.attach(MIMEText(body_admin, 'plain'))

# Enviar correos
try:
    server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
    server.starttls()
    server.login(SMTP_USERNAME, SMTP_PASSWORD)
    server.sendmail(SMTP_USERNAME, user_email, msg_user.as_string())
    server.sendmail(SMTP_USERNAME, ADMIN_EMAIL, msg_admin.as_string())
    server.quit()
    print("Correo enviado exitosamente a usuario y administrador")
    sys.exit(0)
except Exception as e:
    print(f"Error al enviar correo: {e}")
    sys.exit(1)
