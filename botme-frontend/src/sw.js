self.addEventListener("install",(evt) => {
    console.log(evt)
    self.skipWaiting();
});
self.addEventListener("push",(evt) => {
    const data = evt.data.json();
    console.log("Push", data);
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon,
        image: data.image
    });
});