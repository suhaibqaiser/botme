from requests.structures import CaseInsensitiveDict
import requests

url = "http://localhost:3000/nlp/export"

headers = CaseInsensitiveDict()
headers["Accept"] = "application/json"
headers["Authorization"] = "Bearer ea2d3aeaad77865f9769974a920892f5"

resp = requests.get(url, headers=headers).json()

nlu = open("data/nlu.yml", "w")
nlu.writelines(resp['payload'])
nlu.close()
