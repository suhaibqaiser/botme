// self.addEventListener("install",(evt) => {
//     console.log("event=>",evt)
//     self.skipWaiting();
// });
// self.addEventListener("push",(evt) => {
//     const data = evt.data.json();
//     console.log("Push==>", evt.data.json());
//     console.log("hello")
//     self.registration.showNotification(data.title, {
//         body: data.body,
//         icon: "/assets/images/logo/logo.png",
//     });
// });