from typing import Any, Text, Dict, List

import requests
from rasa_sdk import Action, Tracker
from rasa_sdk.events import SlotSet
from rasa_sdk.executor import CollectingDispatcher


class ActionFetchStatus(Action):
    def name(self):
        return 'action_fetch_tables'

    def run(self, dispatcher, tracker, domain):
        person = tracker.get_slot('person')
        url = "http://localhost:3100/tables/search?seats={0}&occupied=false".format(person)
        result = requests.get(url).json()

        if result.get('status') == 'success':
            dispatcher.utter_message(text="Table is available")
        else:
            dispatcher.utter_message(text="Table with the asked capacity is not available at the moment")
        return []
