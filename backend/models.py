from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Messages(db.Model):
    message_id = db.Column(db.Integer, primary_key=True)
    prompt = db.Column(db.String(255), nullable=False)
    response = db.Column(db.Text, nullable=False)
    role = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {
            "message_id": self.message_id,
            "prompt": self.prompt,
            "response": self.response,
            "role": self.role,
        }
