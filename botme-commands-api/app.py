from flask import Flask
from flask_restful import Api, Resource

app = Flask(__name__)
api=Api(app)

data = {"hi":{"response":"welcome to our restaurant"}}
class CommandApi(Resource):
    def get(self,text):
        return data[text]

api.add_resource(CommandApi, '/response/<string:text>')

if __name__ == "__main__":
    app.run(debug=True)