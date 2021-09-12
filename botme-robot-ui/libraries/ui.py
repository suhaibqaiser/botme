import tkinter as tk
import colour

def fade(widget, smoothness=4, cnf={}, **kw):
    """This function will show faded effect on widget's different color options.

    Args:
        widget (tk.Widget): Passed by the bind function.
        smoothness (int): Set the smoothness of the fading (1-10).
        background (str): Fade background color to.
        foreground (str): Fade foreground color to."""

    kw = tk._cnfmerge((cnf, kw))
    if not kw:
        raise ValueError("No option given, -bg, -fg, etc")
    if len(kw) > 1:
        return [fade(widget, smoothness, {k: v}) for k, v in kw.items()][0]
    if not getattr(widget, '_after_ids', None):
        widget._after_ids = {}
    widget.after_cancel(widget._after_ids.get(list(kw)[0], ' '))

    c1 = tuple(map(lambda a: a/(65535), widget.winfo_rgb(widget[list(kw)[0]])))
    c2 = tuple(map(lambda a: a/(65535),
               widget.winfo_rgb(list(kw.values())[0])))
    colors = tuple(colour.rgb2hex(c, force_long=True)
                   for c in colour.color_scale(c1, c2, max(1, smoothness*100)))

    def worker(count=0):
        if len(colors)-1 <= count:
            return
        widget.config({list(kw)[0]: colors[count]})
        widget._after_ids.update({list(kw)[0]: widget.after(
            max(1, int(smoothness/10)), worker, count+1)})
    worker()

