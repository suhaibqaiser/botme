import json
from typing import Any, Text, Dict, List

import requests
from rasa_sdk import Action, Tracker
from rasa_sdk.events import SlotSet
from rasa_sdk.executor import CollectingDispatcher
from datetime import datetime


class ActionFetchTables(Action):
    def name(self):
        return 'action_fetch_tables'

    def run(self, dispatcher, tracker, domain):
        person = tracker.get_slot('person')
        url = "http://localhost:3100/tables/search?seats={0}&occupied=false".format(
            person)
        result = requests.get(url).json()

        if result.get('status') == 'success':
            table_id = result.get('payload')[0].get('tableId')
            table_objectid = result.get('payload')[0].get('_id')
            area_name = result.get('payload')[0].get('area').get('areaName')

            # dispatcher.utter_message(
            #     text=f"{customerName}, please proceed to the table labeled {table_id} on {area_name}")
            return [SlotSet("tableObjectId", table_objectid), SlotSet("tableId", table_id), SlotSet("areaName", area_name)]
        else:
            dispatcher.utter_message(
                text="Table with the requested capacity is not available at the moment")


class ActionFetchCustomer(Action):
    def name(self):
        return 'action_fetch_customer'

    def run(self, dispatcher, tracker, domain):
        customer_name = ''
        newCustomer = None
        phone = tracker.get_slot('phoneNumber')
        url = f"http://localhost:3100/customer/search?phone={phone}"
        result = requests.get(url).json()

        if result.get('status') == 'success':
            customerObject_id = result.get('payload').get('_id')
            customer_id = result.get('payload').get('customerId')
            customer_name = result.get('payload').get('customerName')
        else:
            newCustomer = "true"
            url = f"http://localhost:3100/customer/add"
            headers = {"Content-Type": "application/json"}
            body = {
                "customer": {
                    "customerId": "",
                    "customerName": "",
                    "customerEmail": "",
                    "customerPhone": phone,
                    "customerActive": "true"
                }
            }
            post = requests.put(url, json=body, headers=headers).json()
            customer_id = post.get('payload').get('customerId')
            customerObject_id = post.get('payload').get('_id')

        return [SlotSet("customerId", customer_id),
                SlotSet("customerName", customer_name),
                SlotSet("newCustomer", newCustomer),
                SlotSet("customerObjectId", customerObject_id)
                ]


class ActionSetName(Action):
    def name(self):
        return 'action_set_name'

    def run(self, dispatcher, tracker, domain):
        customerId = tracker.get_slot('customerId')
        customer_name = tracker.get_slot('customerName')
        customer_phone = tracker.get_slot('phoneNumber')
        url = f"http://localhost:3100/customer/update"
        headers = {"Content-Type": "application/json"}
        body = {
            "customer": {
                "customerId": customerId,
                "customerName": customer_name,
                "customerEmail": "",
                "customerPhone": customer_phone,
                "customerActive": "true"
            }
        }
        requests.post(url, json=body, headers=headers).json()
        dispatcher.utter_message(text="All set...")


class ActionAddReservation(Action):
    def name(self):
        return 'action_add_reservation'

    def run(self, dispatcher, tracker, domain):
        now = datetime.now()
        tableObjectId = tracker.get_slot('tableObjectId')
        customerObjectId = tracker.get_slot('customerObjectId')
        reservationSeats = tracker.get_slot('person')
        reservationType = "Walk-in"
        reservationSource = "Sofia"
        reservationDatetime = now.strftime("%m/%d/%Y, %H:%M:%S")

        url = f"http://localhost:3100/reservation/add"
        headers = {"Content-Type": "application/json"}
        body = {
            "reservation": {
                "reservationSeats": reservationSeats,
                "reservationDatetime": reservationDatetime,
                "reservationType": reservationType,
                "reservationSource": reservationSource,
                "customer": customerObjectId,
                "table": tableObjectId
            }
        }
        put = requests.put(url, json=body, headers=headers).json()
        if put.get('status') == 'success':
            reservationId = put.get('payload').get('reservationId')
        #dispatcher.utter_message(text="All set...")
        return [SlotSet("reservationId", reservationId)]
