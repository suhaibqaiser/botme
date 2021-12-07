from http.client import BAD_GATEWAY, error
import tkinter as tk
from tkinter import Button, Label, Scrollbar, Text, Entry, Toplevel
from tkinter.constants import BOTH, BOTTOM, CENTER, DISABLED, END, N, NORMAL, S, TOP, TRUE, X, Y

import requests
from libraries.ui import fade
from libraries.speech_services import listen, speak
from libraries.sockets import Sockets
import random
from PIL import Image, ImageTk
import sys

# Main app window
app_root = tk.Tk()
app_root.withdraw()

text_color = ["#fff", "#ff001e", "#ffa000", "#25ff00"]
text_font = ("Inter", 10, 'bold')
sub_text_font = ("Inter", 22, 'bold')
text_background = "#000"
foreground = "#fff"
border_width = 25
background_color = ["#ff9aa2", "#ffb7b2",
                    "#ffdac1", "#e2f0cb", "#b5ead7", "#c7ceea"]
clientToken = ""


class Login:
    global clientToken
    # login window
    login = Toplevel()
    login.title("Login")
    login.resizable(width=False, height=False)
    login.configure(width=600, height=600)

    # create a label for login
    label_login = Label(login, text="Please login to continue",
                        justify=CENTER, font=sub_text_font)
    label_login.place(relheight=0.15, relx=0.1, rely=0.07)

    # create a label for clientID,clientSecret,clientDeviceId
    labelclientID = Label(login, text="clientID: ", font=text_font)
    labelclientID.place(relheight=0.1, relx=0.1, rely=0.2)

    labelclientSecret = Label(login, text="clientSecret: ", font=text_font)
    labelclientSecret.place(relheight=0.1, relx=0.1, rely=0.4)

    labelclientDeviceId = Label(login, text="clientDeviceId: ", font=text_font)
    labelclientDeviceId.place(relheight=0.1, relx=0.1, rely=0.6)

    # create a entry box for
    # typing the message
    clientID = Entry(login, font=text_font)
    clientID.place(relwidth=0.5, relheight=0.1, relx=0.35, rely=0.2)
    clientID.focus()

    clientSecret = Entry(login, font=text_font)
    clientSecret.place(relwidth=0.5, relheight=0.1, relx=0.35, rely=0.4)
    clientSecret.focus()

    clientDeviceId = Entry(login, font=text_font)
    clientDeviceId.place(relwidth=0.5, relheight=0.1, relx=0.35, rely=0.6)
    clientDeviceId.focus()

    # login button
    button1 = Button(login, text="Login", font=text_font,
                     command=lambda: Login.checkForClient())
    button1.place(relx=0.7, rely=0.9, relheight=0.06, relwidth=0.22)

    button2 = Button(login, text="Cancel", font=text_font,
                     command=lambda: Login.CancelButton())
    button2.place(relx=0.1, rely=0.9, relheight=0.06, relwidth=0.22)

    def checkForClient():
        
        global clientToken, socket
        try:
            body = {"clientID": Login.clientID.get(), "clientSecret": Login.clientSecret.get(
            ), "clientDeviceId": Login.clientDeviceId.get()}
            auth_token = 'ea2d3aeaad77865f9769974a920892f5'
            response = requests.post("https://api.gofindmenu.com/client/client/auth",
                                     body, headers={'Authorization': 'Bearer ' + auth_token})
        except:
            print("error in connecting client Api")

        data = response.json()
        print(data)
        if data['status'] == 'success':
            clientToken = data['payload']['clientToken']
            Login.login.destroy()
            app_root.deiconify()
            if clientToken:
                print('clientToken:', clientToken)
                socket = Sockets(clientToken)
        elif data['status'] != 'success':
            labelError = Label(
                Login.login, text=data['payload']['message'], font=text_font, fg='red')
            labelError.place(relheight=0.15, relx=0.09, rely=0.7)
        else:
            labelError = Label(
                Login.login, text=data['payload']['message'], font=text_font, fg='red')
            labelError.place(relheight=0.15, relx=0.09, rely=0.7)

    def CancelButton():
        Login.login.destroy()
        app_root.destroy()
        sys.exit()


app_root.title("Sofia Robot")
# Canvas to hold display elements
canvas = tk.Canvas(app_root, width=800, height=700)
canvas.pack(fill="both", expand=True)
# Variables and Declarations

# Image imports
imageNeutral = Image.open("images/neutral.png")
imageNeutral = imageNeutral.resize((250, 250), Image.ANTIALIAS)
imageNeutral = ImageTk.PhotoImage(imageNeutral)
bot_image = "imageNeutral"
imageHappy = Image.open("images/happy.png")
imageHappy = ImageTk.PhotoImage(imageHappy)
imageSad = Image.open("images/sad.jpeg")
imageSad = ImageTk.PhotoImage(imageSad)
imageAnnoyed = Image.open("images/annoyed.jpeg")
imageAnnoyed = ImageTk.PhotoImage(imageAnnoyed)
imageGlad = Image.open("images/glad.png")
imageGlad = ImageTk.PhotoImage(imageGlad)
imageThinking = Image.open("images/thinking.jpeg")
imageThinking = ImageTk.PhotoImage(imageThinking)
old_message = ''
# Main display
main = tk.Canvas(canvas, bg='#000')
# main.place(relx=0.5,rely=0.5)
main1 = tk.Canvas(canvas, bg='#000', width=500)
# main1.place(x=10,y=20,anchor=N)
# main1.pack(side="bottom")
# Bot Image
label = tk.Label(main, font=text_font, image=imageNeutral,
                 width=455, height=300)
label.grid(column=0, row=0,  padx=20, pady=20)
# head label
head_label = Label(main1, bg='#000', fg='#000',
                   text="CHAT-BOT", font=text_font, pady=10)
head_label.place(relwidth=0)
# #tiny divider
# line = tk.Label(main1,width=450,bg='#000')
# line.place(relwidth=1,rely=0.07,relheight=0.012)
# text widget
text_widget = Text(main1, width=21, height=3, bg="#000",
                   fg='#808080', font=text_font, padx=5, pady=5)
text_widget.place(relheight=0.745, relwidth=1, rely=0.08)
text_widget.configure(state=DISABLED)
# Text from backend
# sub_titles = tk.Label(main, font=sub_text_font, bg=text_background, text="Press Talk",
#                       fg=foreground, bd=border_width)
# sub_titles.grid(column=0, row=1, padx=80, pady=40)
# scrollbar
scrollbar = Scrollbar(text_widget)
scrollbar.place(relheight=1, relx=0.974)
scrollbar.configure(command=text_widget.yview)
# bottom label
bottom_label = Label(main1, bg='#808080', height=80)
bottom_label.place(relwidth=1, rely=0.825)
# Talk Button
talk_btn = tk.Button(bottom_label, text="Talk",
                     command=lambda: btn_action(), width=5)
talk_btn.place(anchor=CENTER, x=250, y=25)
# talk_btn.grid(column=0, row=2, pady=10)
# Update bg color


def update_background():
    bg = random.choice(background_color)
    fade(canvas, smoothness=8, bg=bg)
    app_root.after(2000, update_background)


def update_ui():
    main.place(x=canvas.winfo_width()/2,
               y=canvas.winfo_height()/2, anchor=S)
    main1.place(x=canvas.winfo_width()/2,
                y=canvas.winfo_height()/2, anchor=N)
    app_root.after(100, update_ui)


def processImage():
    global bot_image
    label.config(image=imageThinking)
    bot_image = 'imageThinking'
    main.place(x=canvas.winfo_width()/2,
               y=canvas.winfo_height()/2, anchor="center")


def defaultImage():
    global bot_image
    label.config(image=imageNeutral)
    bot_image = 'imageNeutral'


def imageOnSentiment(senti, status, text, intent):
    global bot_image
    if(-0.5 < senti < 0.5):
        if (status == "success"):
            if (intent == 'thanks'):
                print(1)
                label.config(image=imageGlad)
                bot_image = 'imageGlad'
                label.after(5000, defaultImage)
            elif (intent == 'nlu_fallback'):
                print(10)
                label.config(image=imageSad)
                bot_image = 'imageSad'
                label.after(5000, defaultImage)
            elif (intent == 'out_of_scope'):
                print(2)
                label.config(image=imageAnnoyed)
                bot_image = 'imageAnnoyed'
                label.after(5000, defaultImage)
            elif (intent == 'question'):
                label.config(image=imageThinking)
                bot_image = 'imageThinking'
                label.after(5000, defaultImage)
            elif(intent == 'Order_meal'):
                print(3)
                if (text != 'Product not available'):
                    print(3.1)
                    label.config(image=imageHappy)
                    bot_image = 'imageHappy'
                    label.after(5000, defaultImage)
                else:
                    print(3.2)
                    label.config(image=imageSad)
                    bot_image = 'imageSad'
                    label.after(5000, defaultImage)
            elif(intent == 'unreserved_table_person'):
                print(4)
                if (text != 'Sorry, All tables are occupied'):
                    print(4.1)
                    label.config(image=imageHappy)
                    bot_image = 'imageHappy'
                    label.after(5000, defaultImage)
                else:
                    print(4.2)
                    label.config(image=imageSad)
                    bot_image = 'imageSad'
                    label.after(5000, defaultImage)
            else:
                print(4)
                label.config(image=imageHappy)
                bot_image = 'imageHappy'
                label.after(5000, defaultImage)

    elif(senti >= 0.5):
        label.config(image=imageGlad)
        bot_image = 'imageGlad'
        label.after(5000, defaultImage)

    elif(senti <= -0.5):
        print(2)
        label.config(image=imageSad)
        bot_image = 'imageSad'
        label.after(5000, defaultImage)

# Talk button action


def btn_action():
    processImage()
    socketText()


text1 = ''


def socketText():
    global text1
    if clientToken:
        socket.processing_start()
        text1 = listen()
        socket.send_message('communication', text1)


def updateText():
    global old_message, text1
    if clientToken:
        message = socket.message_subject
        if old_message != message:
            old_message = message
            sub_text_disp = message['payload']
            text = sub_text_disp['text']
            imageOnSentiment(sub_text_disp['sentimentScore'], "success",
                             sub_text_disp['text'], sub_text_disp['intentName'])
            send_message(text1, text)
            speak(sub_text_disp['text'])
            socket.processing_end()
    main1.after(1000, updateText)


def send_message(msg, response):
    if not msg:
        return

    msg1 = f"{'YOU'}: {msg}\n\n"
    text_widget.insert(END, msg1)
    text_widget.configure(state=NORMAL)
    text_widget.insert(END, msg1)
    text_widget.configure(state=DISABLED)

    msg2 = f"{'SOFIA'}: {response}\n\n"
    text_widget.configure(state=NORMAL)
    text_widget.insert(END, msg2)
    text_widget.configure(state=DISABLED)

    text_widget.see(END)


# Loop call for updating UI and background
update_background()
updateText()
update_ui()
# open_eyes()


# Application Main Loop
app_root.mainloop()
