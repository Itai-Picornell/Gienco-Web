import html
import logging
import os

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# --- Constantes de trigger ---
TRIGGER_SIGNUP    = "CustomMessage_SignUp"
TRIGGER_RESEND    = "CustomMessage_ResendCode"
TRIGGER_FORGOT_PW = "CustomMessage_ForgotPassword"

OTP_EXPIRY_MINUTES = 15


def generate_html_body(
    title: str,
    subtitle: str,
    content: str,
    otp_code: str,
) -> str:
    """
    Genera el documento HTML con estilos embebidos para compatibilidad.
    Solo muestra el código OTP sin botones de redirección.
    Todos los parámetros de texto son escapados internamente contra XSS.
    
    Args:
        title: Título del email
        subtitle: Subtítulo
        content: Contenido principal
        otp_code: Código OTP (ej: {####})
    
    Returns:
        str: HTML completo escapado
    """
    safe_title    = html.escape(str(title))
    safe_subtitle = html.escape(str(subtitle))
    safe_content  = html.escape(str(content))
    safe_otp      = html.escape(str(otp_code))

    return f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gienco – Autenticación</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {{ font-family: Arial, sans-serif !important; }}
  </style>
  <![endif]-->
  <style>
    /* ── Reset & Base ── */
    body {{
      margin: 0;
      padding: 0;
      width: 100%;
      background-color: #000000;
      color: #ffffff;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }}
    /* ── Outer wrapper ── */
    .email-wrapper {{
      width: 100%;
      background-color: #000000;
      padding: 40px 0;
    }}
    /* ── Card container ── */
    .email-card {{
      max-width: 560px;
      margin: 0 auto;
      background-color: #1a1a1a;
      border: 1px solid #333333;
      border-radius: 16px;
      overflow: hidden;
    }}
    /* ── Header bar ── */
    .email-header {{
      text-align: center;
      padding: 40px 40px 0 40px;
    }}
    .brand-name {{
      font-family: 'Space Grotesk', 'Helvetica Neue', Arial, sans-serif;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 8px;
      color: #ffffff;
      margin: 0;
      text-transform: uppercase;
    }}
    .brand-divider {{
      width: 40px;
      height: 2px;
      background-color: #333333;
      margin: 24px auto;
      border: none;
    }}
    /* ── Main content ── */
    .email-body {{
      padding: 0 40px 40px 40px;
      text-align: center;
    }}
    .email-title {{
      font-family: 'Space Grotesk', 'Helvetica Neue', Arial, sans-serif;
      font-size: 20px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #ffffff;
      margin: 0 0 8px 0;
    }}
    .email-subtitle {{
      font-family: 'Space Grotesk', 'Helvetica Neue', Arial, sans-serif;
      font-size: 15px;
      color: #cccccc;
      margin: 0 0 16px 0;
      font-weight: 400;
    }}
    .email-text {{
      font-family: 'Space Grotesk', 'Helvetica Neue', Arial, sans-serif;
      font-size: 14px;
      color: #999999;
      line-height: 1.7;
      margin: 0 0 28px 0;
    }}
    /* ── OTP Code Block ── */
    .otp-container {{
      background-color: #000000;
      border: 1px solid #333333;
      border-radius: 12px;
      padding: 28px 20px;
      margin: 0 0 28px 0;
    }}
    .otp-label {{
      font-family: 'Space Grotesk', 'Helvetica Neue', Arial, sans-serif;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 3px;
      color: #666666;
      margin: 0 0 12px 0;
    }}
    .otp-value {{
      font-family: 'Space Grotesk', 'Courier New', monospace;
      font-size: 36px;
      font-weight: 700;
      letter-spacing: 10px;
      color: #ffffff;
      margin: 0 0 12px 0;
    }}
    .otp-expiry {{
      font-family: 'Space Grotesk', 'Helvetica Neue', Arial, sans-serif;
      font-size: 12px;
      color: #666666;
      margin: 0;
    }}
    /* ── Footer ── */
    .email-footer {{
      padding: 24px 40px;
      border-top: 1px solid #222222;
      text-align: center;
    }}
    .footer-text {{
      font-family: 'Space Grotesk', 'Helvetica Neue', Arial, sans-serif;
      font-size: 11px;
      color: #555555;
      line-height: 1.6;
      margin: 0;
    }}
    /* ── Responsive ── */
    @media only screen and (max-width: 600px) {{
      .email-card {{
        margin: 0 16px;
        border-radius: 12px;
      }}
      .email-header,
      .email-body {{
        padding-left: 24px;
        padding-right: 24px;
      }}
      .email-footer {{
        padding-left: 24px;
        padding-right: 24px;
      }}
      .otp-value {{
        font-size: 28px;
        letter-spacing: 6px;
      }}
    }}
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-card">
      <!-- Header -->
      <div class="email-header">
        <p class="brand-name">GIENCO</p>
        <hr class="brand-divider">
      </div>

      <!-- Body -->
      <div class="email-body">
        <p class="email-title">{safe_title}</p>
        <p class="email-subtitle">{safe_subtitle}</p>
        <p class="email-text">{safe_content}</p>

        <!-- OTP Code -->
        <div class="otp-container">
          <p class="otp-label">Tu código de acceso</p>
          <p class="otp-value">{safe_otp}</p>
          <p class="otp-expiry">Expira en {OTP_EXPIRY_MINUTES} minutos</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="email-footer">
        <p class="footer-text">
          Este mensaje ha sido generado automáticamente por el sistema de autenticación de Gienco.<br>
          Si no ha solicitado esta acción, ignore este mensaje y no comparta el código con nadie.
        </p>
      </div>
    </div>
  </div>
</body>
</html>"""


def lambda_handler(event: dict, context: object) -> dict:
    """
    Controlador principal de la Lambda.
    Procesa triggers de Cognito y personaliza los emails de autenticación.
    
    Triggers soportados:
    - CustomMessage_SignUp: Verificación inicial de email en registro
    - CustomMessage_ResendCode: Reenvío del código de verificación
    - CustomMessage_ForgotPassword: Restablecimiento de contraseña
    
    Medidas de seguridad:
    - HTML escape de todos los datos de entrada
    - Manejo seguro de errores sin exponer detalles internos
    - Logging estructurado para auditoría
    
    Nota: Los emails solo contienen el código OTP. 
    La redirección a la web se maneja desde el cliente (Vue.js).
    """
    try:
        trigger = event["triggerSource"]
        logger.info("Trigger recibido: %s", trigger)

        # Sanitización de datos de entrada
        raw_name = event["request"]["userAttributes"].get("name", "Usuario")
        safe_name = html.escape(str(raw_name))

        if trigger in (TRIGGER_SIGNUP, TRIGGER_RESEND):
            event["response"]["emailSubject"] = "Código de verificación – Gienco"
            event["response"]["emailMessage"] = generate_html_body(
                title="Verificación de registro",
                subtitle=f"Hola {safe_name},",
                content=(
                    f"Introduce el siguiente código en la plataforma para activar tu cuenta. "
                    f"El código es válido durante {OTP_EXPIRY_MINUTES} minutos."
                ),
                otp_code="{####}",
            )
            logger.info("Email de verificación de registro/reenvío preparado para: %s", safe_name)

        elif trigger == TRIGGER_FORGOT_PW:
            event["response"]["emailSubject"] = "Recuperación de contraseña – Gienco"
            event["response"]["emailMessage"] = generate_html_body(
                title="Seguridad de la cuenta",
                subtitle="Restablecimiento de acceso.",
                content=(
                    f"Se ha solicitado un cambio de contraseña. Utiliza el código adjunto "
                    f"en los próximos {OTP_EXPIRY_MINUTES} minutos para continuar. "
                    f"Si no fuiste tú, ignora este mensaje."
                ),
                otp_code="{####}",
            )
            logger.info("Email de recuperación de contraseña preparado para: %s", safe_name)

        else:
            logger.warning("Trigger no gestionado, evento devuelto sin modificar: %s", trigger)

    except (KeyError, TypeError) as exc:
        # Devolvemos el evento sin modificar para no bloquear el flujo de autenticación.
        # Cognito mostrará su email por defecto si response queda vacío.
        logger.error(
            "Error al procesar el evento del trigger. Excepción: %s | Evento: %s",
            exc,
            event,
        )

    return event
