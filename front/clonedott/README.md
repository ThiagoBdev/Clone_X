# Clone X (Twitter Clone)

Este é um projeto **Fullstack** que recria funcionalidades básicas de uma rede social estilo **Twitter/X**, com **backend em Django + Django REST Framework** e **frontend em Next.js (React)**.

---

## 🚀 Tecnologias

- **Backend**
  - Python 3.12+
  - Django 5
  - Django REST Framework (DRF)
  - SimpleJWT (Autenticação com Tokens)
  - MySQL (PythonAnywhere) (produção)

- **Frontend**
  - Next.js 15
  - React 19
  - Axios
  - CSS

- **Deploy**
  - Backend: [PythonAnywhere](https://thiagobdev.pythonanywhere.com)
  - Frontend: [Vercel](https://clone-x-three.vercel.app)

---

## ⚙️ Configuração do Backend

```bash
# Clone o repositório
git clone https://github.com/ThiagoBdev/Clone_X.git
cd Clone_X/back


#### Front ####
Navegue até o diretório do projeto:

cd front
cd clonedott

Instale as dependências:

npm install

Crie um arquivo .env:

NEXT_PUBLIC_API_URL=http://localhost:8000  #esta é a chave que esta refereniada na api, você consegue ver em front\clonedott\src\lib\api.ts

Inicie o servidor de desenvolvimento:

npm run dev

### Agora abra outro terminal:


#### Backend ####

Navegue até o diretório do backend:

cd back

Crie um ambiente virtual:

python -m venv env
source env/bin/activate   # Linux/Mac
env\Scripts\activate      # Windows

# Instale as dependências
pip install -r requirements.txt

Crie o arquivo .env:

SECRET_KEY=sua-chave-secreta-unica  # Gere com: python -c "import secrets; print(secrets.token_urlsafe(50))"
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3  #utilize SQLite ja que é um banco default
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000

(Opcional) Crie um superusuário para o admin:

python manage.py createsuperuser

Rode as migrações:

python manage.py makemigrations
python manage.py migrate

python manage.py runserver


5. Resolução de Problemas Comuns:

Limpe o localStorage no navegador (DevTools > Application > Local Storage) antes de testar o registro.

Caso alguns estilos no registro ou login estejam desalinhados apenas de um Reaload


Contribuição

Fork o repositório.

Crie uma branch: git checkout -b minha-feature.

Commit: git commit -m "Adiciona feature X".

Push: git push origin minha-feature.

Abra um Pull Request.


