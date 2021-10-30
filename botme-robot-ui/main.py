import tkinter as tk

from asyncio.tasks import sleep
from libraries.ui import fade
from libraries.speech_services import listen, speak
import random
from libraries.sockets import Sockets
from PIL import Image, ImageTk

# Class Initialization for Socket Communication
socket = Sockets()

# Main app window
app_root = tk.Tk()
app_root.title("Sofia Robot")

# Canvas to hold display elements
canvas = tk.Canvas(app_root, width=640, height=480)
canvas.pack(fill="both", expand=True)

# Variables and Declarations
text_color = ["#fff", "#ff001e", "#ffa000", "#25ff00"]
text_font = ("Inter", 34, 'bold')
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

old_message = ''

# Main display
main = tk.Canvas(canvas, bg='#000')

# Bot Image
label = tk.Label(main, font=text_font, image=bot_eyes_closed,
                 fg=foreground, bd=border_width)
label.grid(column=0, row=0, padx=20, pady=20)

# Text from backend
sub_titles = tk.Label(main, font=sub_text_font, bg=text_background, text="Press Talk",
                      fg=foreground, bd=border_width)
sub_titles.grid(column=0, row=1, padx=80, pady=40)

# Talk Button
talk_btn = tk.Button(main, text="Talk", command=lambda: btn_action())
talk_btn.grid(column=0, row=2, pady=10)


# Update bg color
def update_background():
    bg = random.choice(background_color)
    fade(canvas, smoothness=8, bg=bg)
    app_root.after(2000, update_background)


def update_ui():
    main.place(x=canvas.winfo_width() / 2,
               y=canvas.winfo_height() / 2, anchor="center")
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
    socket.processing_start()
    socket.send_message(listen())




def update_text():
    global old_message
    message = socket.message_subject
    if old_message != message:
        old_message = message
        sub_text_disp = message
        sub_titles.config(text=sub_text_disp)
        speak(sub_text_disp)
        socket.processing_end()
    sub_titles.after(1000, update_text)



# Loop call for updating UI and background
update_background()
update_ui()
open_eyes()
update_text()

# Application Main Loop
app_root.mainloop()
