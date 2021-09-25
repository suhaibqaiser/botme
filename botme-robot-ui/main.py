from http.client import BAD_GATEWAY
import tkinter as tk
from tkinter import Label, Scrollbar, Text, Entry
from tkinter.constants import BOTH, DISABLED, END, N, NORMAL, TRUE
# from tkinter.font import Font
# from typing import Text
from libraries.ui import fade
from libraries.speech_services import listen,speak
import random
from libraries.sockets import Sockets
from PIL import Image, ImageTk

# Class Initialization for Socket Communication
socket = Sockets()

# Main app window
app_root = tk.Tk()
app_root.title("Sofia Robot")

# Canvas to hold display elements
canvas = tk.Canvas(app_root, width=500, height=600)
canvas.pack(fill="both", expand=True)

# Variables and Declarations
text_color = ["#fff", "#ff001e", "#ffa000", "#25ff00"]
text_font = ("Inter", 10, 'bold')
sub_text_font = ("Inter", 22, 'bold')
text_background = "#000"
foreground = "#fff"
border_width = 25
background_color = ["#ff9aa2", "#ffb7b2",
                    "#ffdac1", "#e2f0cb", "#b5ead7", "#c7ceea"]
# Image imports
bot_eyes_open = Image.open("images/open.png")
bot_eyes_open = bot_eyes_open.resize((150, 150), Image.ANTIALIAS)
bot_eyes_open = ImageTk.PhotoImage(bot_eyes_open)
bot_eyes_closed = Image.open("images/closed.png")
bot_eyes_closed = bot_eyes_closed.resize((150, 150), Image.ANTIALIAS)
bot_eyes_closed = ImageTk.PhotoImage(bot_eyes_closed)
bot_image = "bot_eyes_closed"

# Main display
main = tk.Canvas(canvas, bg='#000')
main.pack(side="top")
# main.place(relx=0.5,rely=0.5)

main1 = tk.Canvas(canvas,bg='#000')
main1.pack(side="bottom",fill=BOTH)
# Bot Image
label = tk.Label(main, font=text_font, image=bot_eyes_closed,
                 fg=foreground, bd=border_width)
label.grid(column=0, row=0,  padx=20, pady=20)
# head label

head_label = Label(main1,bg='#000',fg='#000',text="CHAT-BOT",font=text_font,pady=10)
head_label.place(relwidth=0)

#tiny divider
line = tk.Label(main1,width=450,bg='#000')
line.place(relwidth=1,rely=0.07,relheight=0.012)

# text widget
text_widget = Text(main1,width=21,height=3,bg="#000",fg='#808080',font=text_font, padx=5,pady=5)
text_widget.place(relheight=0.745,relwidth=1,rely=0.08)
text_widget.configure(state=DISABLED)


# Text from backend
# sub_titles = tk.Label(main, font=sub_text_font, bg=text_background, text="Press Talk",
#                       fg=foreground, bd=border_width)
# sub_titles.grid(column=0, row=1, padx=80, pady=40)

#scrollbar

scrollbar = Scrollbar(text_widget)
scrollbar.place(relheight=1,relx=0.974)
scrollbar.configure(command=text_widget.yview)

#bottom label
bottom_label = Label(main1,bg='#808080',height=80)
bottom_label.place(relwidth=1,rely=0.825)
# Talk Button
talk_btn = tk.Button(bottom_label, text="Talk", command=lambda: btn_action())
talk_btn.grid(column=0, row=2, pady=10)


# Update bg color
def update_background():
    bg = random.choice(background_color)
    fade(canvas, smoothness=8, bg=bg)
    app_root.after(2000, update_background)


def update_ui():
    main.place(x=canvas.winfo_width()/2,
               y=canvas.winfo_height()/2, anchor="center")
    app_root.after(100, update_ui)


def close_eyes():
    global bot_image
    if (bot_image == 'bot_eyes_open'):
        label.config(image=bot_eyes_closed)
        bot_image = 'bot_eyes_closed'
        label.after(200, open_eyes)

def open_eyes():
    global bot_image
    if (bot_image == 'bot_eyes_closed'):
        label.config(image=bot_eyes_open)
        bot_image = 'bot_eyes_open'
    label.after(5000, close_eyes)


# Talk button action
def btn_action():
    get_message = listen()
    sub_text_disp = socket.send(get_message)
    text=sub_text_disp
    send_message(get_message,text)
    speak(sub_text_disp)

def send_message(msg,response):
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
update_ui()
open_eyes()



# Application Main Loop
app_root.mainloop()