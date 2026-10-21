# TaskFlow

Aplicativo demonstrativo em Python, Flask e SQLite.

## Rodar localmente

```bash
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Abra http://127.0.0.1:5000

## Hospedagem

Requer hospedagem com suporte a aplicações Python/WSGI (por exemplo, cPanel com Setup Python App). Crie a aplicação apontando para a pasta do projeto, com arquivo de inicialização `passenger_wsgi.py` e entry point `application`. Instale `requirements.txt` no ambiente virtual disponibilizado pela hospedagem e reinicie a aplicação. Verifique com o suporte se seu plano oferece esse recurso. A pasta do banco SQLite precisa ter permissão de escrita. Para uso público com múltiplos usuários, adicione autenticação, proteção CSRF e banco apropriado; esta versão é um projeto didático compartilhado por todos os visitantes.
