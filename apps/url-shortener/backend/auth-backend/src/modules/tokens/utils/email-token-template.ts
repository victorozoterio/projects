import { mask, TokenType } from '../../../utils';

export function emailTokenTemplate(name: string, token: number, type: TokenType): string {
  const capitalizeName = mask.capitalizeName(name);
  const tokenString = token.toString().padStart(6, '0');

  const tokenDigits = tokenString
    .split('')
    .map((d) => `<span class="token-box">${d}</span>`)
    .join('');

  const emailType: Record<TokenType, { subject: string; message: string }> = {
    [TokenType.EMAIL_VERIFICATION]: {
      subject: 'Confirmação de e-mail',
      message: 'Utilize o código abaixo para validar seu acesso:',
    },
    [TokenType.PASSWORD_RESET]: {
      subject: 'Redefinição de senha',
      message: 'Utilize o código abaixo para redefinir sua senha:',
    },
  };

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"  />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${emailType[type].subject}</title>
  <link href="https://fonts.googleapis.com/css2?family=Geologica:ital,wght@0,500&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Geologica', cursive;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-weight: 500;
      font-size: 14px;
      line-height: 1.25;
    }
    .container {
      max-width: 500px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
    }
    .header {
      background-color: #202020;
      color: #ffffff;
      padding: 25px;
      text-align: left;
    }
    .logo {
      display: block;
      width: 80px;
      margin-bottom: 25px;
    }
    .header-info {
      display: flex;
      align-items: center;
    }
    .header-bar {
      width: 2px;
      height: 20px;
      background-color: #8E24EB;
      margin-right: 10px;
    }
    .header-text {
      font-size: 16px;
      font-weight: 500;
      margin: 0;
    }
    .content {
      padding: 25px;
      color: #000000;
    }
    .content h1 {
      font-size: 20px;
      margin-top: 0;
    }
    .token {
      display: flex;
      justify-content: center;
      margin: 20px 0;
      position: relative;
    }
    .token-box {
      display: inline-block;
      background-color: #E6E6E6;
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 20px;
      font-weight: bold;
      text-align: center;
      width: 38px;
      margin-right: 6px;
      white-space: nowrap;
    }
    .token-box:last-child {
      margin-right: 0;
    }
    .footer {
      background-color: #202020;
      color: #B8B8B8;
      text-align: left;
      font-size: 11px;
      padding: 12px 25px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://url-shortener-auth.s3.us-east-1.amazonaws.com/logo.png" alt="Logo Reduza.me" class="logo">
      <div class="header-info">
        <div class="header-bar"></div>
        <p class="header-text">${emailType[type].subject}</p>
        <div style="display:none; font-size:1px; color:#fff; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">
          Código de acesso: 
        </div>
      </div>
    </div>
    <div class="content">
      <h1>Olá, ${capitalizeName}</h1>
      <p>Esperamos que esteja bem!</p>
      <p>${emailType[type].message}</p>
      <div class="token">
        ${tokenDigits}
      </div>
      <p><strong>Atenção!</strong> Esse código expira em 30 minutos!</p>
      <p>Estamos te esperando!<br>Equipe Reduza.me</p>
    </div>
    <div class="footer">
      <p><strong>Não compartilhe este e-mail</strong></p>
      <p>Para sua segurança, não compartilhe este e-mail com ninguém.</p>
    </div>
  </div>
</body>
</html>
  `;
}
