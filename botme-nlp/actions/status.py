from typing import Any, Text, Dict, List

import requests
from rasa_sdk import Action, Tracker
from rasa_sdk.events import SlotSet
from rasa_sdk.executor import CollectingDispatcher


class ActionFetchStatus(Action):
    def name(self):
        return 'action_fetch_status'

    def run(self, dispatcher, tracker, domain):
        url = "http://localhost:3100/tables/search?seats=30"
        status = requests.get(url).json()
        print(status.get('status'))
        dispatcher.utter_message(text="Status is " + status.get('status'))
        return []
