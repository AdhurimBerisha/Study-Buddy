export const showNewMessageNotification = (sender: string, content: string) => {
  // Check if the browser supports notifications
  if (!("Notification" in window)) {
    return;
  }

  // Check if we have permission
  if (Notification.permission === "granted") {
    new Notification("New Message", {
      body: `${sender}: ${content}`,
      icon: "/logo.svg",
      tag: "new-message",
    });
  } else if (Notification.permission !== "denied") {
    // Request permission
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification("New Message", {
          body: `${sender}: ${content}`,
          icon: "/logo.svg",
          tag: "new-message",
        });
      }
    });
  }
};

export const requestNotificationPermission = () => {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
};
