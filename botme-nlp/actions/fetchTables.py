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
            table_id = result.get('payload')[0].get('tableId')
            area_name = result.get('payload')[0].get('area').get('areaName')

            dispatcher.utter_message(text="Please proceed to the table labeled {0} on {1}".format(table_id, area_name))
        else:
            dispatcher.utter_message(text="Table with the asked capacity is not available at the moment")
        return []
