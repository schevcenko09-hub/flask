
from flask import Flask, render_template, request, jsonify
from logging.handlers import RotatingFileHandler
import logging
import unittest
import os
from sqlalchemy import create_engine

logger = logging.getLogger(__name__)


DATABASE_URL = os.environ.get("DATABASE_URL")

if DATABASE_URL:
    # Render дає URL, що починається з 'postgres://', але SQLAlchemy 1.4+ вимагає 'postgresql://'
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    
    engine = create_engine(DATABASE_URL, echo=False)
else:
    # Локальні налаштування для розробки
    PG_USER = "postgres"
    PG_PASSWORD = "NewPassword123"
    PG_DBNAME = "ERD"
    engine = create_engine(
        f"postgresql+psycopg2://{PG_USER}:{PG_PASSWORD}@localhost:5432/{PG_DBNAME}", 
        echo=False
    )

app = Flask(__name__, template_folder="templates3")


app = Flask(__name__, template_folder="templates3")




file_handler = RotatingFileHandler(
    "app.log",
    maxBytes=10_000,
    backupCount=3,
    encoding="utf-8"
)

formatter = logging.Formatter(
    "[%(asctime)s] %(levelname)s у %(module)s "
    "(%(pathname)s:%(lineno)d): %(message)s"
)

file_handler.setFormatter(formatter)

app.logger.addHandler(file_handler)
app.logger.setLevel(logging.INFO)




@app.route("/")
def index():
    app.logger.info("Відкрито головну сторінку")
    return render_template("chats.html")



@app.route("/register")
def register():
    app.logger.info("Відкрито сторінку реєстрації")
    return render_template("register2.html")




@app.route("/login")
def login():
    app.logger.info("Відкрито сторінку входу")
    return render_template("login2.html")




@app.route("/chats")
def chats():
    app.logger.info("Відкрито сторінку чатів")
    return render_template("chats.html")




@app.route("/friends")
def friends():
    app.logger.info("Відкрито сторінку друзів")
    return render_template("friends.html")




@app.route("/chat/<int:id>")
def chat(id):
    app.logger.info(f"Відкрито чат з ID: {id}")

    return render_template(
        "chat.html",
        chat_id=id
    )




@app.route("/send_message", methods=["POST"])
def send_message():

    message = request.form.get("message", "").strip()

    if not message:
        app.logger.warning(
            "Користувач спробував надіслати порожнє повідомлення"
        )

        return "Повідомлення не може бути порожнім", 400

    app.logger.info(f"Отримано повідомлення: {message}")

    print("Повідомлення:", message)

    return render_template(
        "chat.html",
        message=message
    )




@app.route("/logout")
def logout():
    app.logger.info("Користувач вийшов з акаунта")
    return "Ви вийшли з акаунта"




@app.route("/status")
def status():
    app.logger.info("Перевірка статусу застосунку")

    return jsonify({
        "status": "active"
    })




class FlaskTestCase(unittest.TestCase):

    def setUp(self):
        self.client = app.test_client()

    def test_status(self):
        response = self.client.get("/status")

        self.assertEqual(response.status_code, 200)

        self.assertEqual(
            response.json,
            {"status": "active"}
        )


unittest.main(argv=[''], exit=False)

# if __name__ == "__main__":
#     app.run(debug=True)

