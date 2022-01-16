from requests.structures import CaseInsensitiveDict
import requests
import sys


def main():
    corpusId = sys.argv[1:]
    if not corpusId:
        print("[Error] Exiting...: No corpusId specified")
        return
    url = "http://localhost:3000/nlp/export?corpusId=" + corpusId[0]
    headers = CaseInsensitiveDict()
    headers["Accept"] = "application/json"
    headers["Authorization"] = "Bearer ea2d3aeaad77865f9769974a920892f5"
    resp = requests.get(url, headers=headers).json()
    nlu = open("data/nlu.yml", "w")
    nlu.writelines(resp['payload'])
    nlu.close()


if __name__ == "__main__":
    main()
