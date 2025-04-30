import { v4 as uuid } from "uuid";

let socket;
const receive = {};
let connected = false;
const wssUrl = process.env.REACT_APP_WSS_URL;

export const onMessage = (data) => {
  const { route } = data;
  const callbacks = receive[route] || {};
  Object.values(callbacks).forEach((callback) => {
    if (typeof callback === "function") {
      callback(data);
    } else {
      console.log("debug no callback", route);
    }
  });
};

export const connect = () => {
  socket = new WebSocket(`${wssUrl}`);

  socket.onopen = (event) => {
    console.log("debug connected", event);
    connected = true;
    onMessage({ route: "connected", connected });
  };

  socket.onerror = (event) => {
    console.log("debug error", event);
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  return () => {
    connected = false;
    socket.close();
  };
};

export const send = (route, data) => {
  const message = JSON.stringify({ action: "process", route, ...data });
  console.log("debug send", message);
  if (connected) {
    socket.send(message);
  } else {
    console.log("debug not connected");
  }
};

export const subscribe = (action, callback) => {
  const key = uuid();
  if (!receive[action]) {
    receive[action] = {};
  }
  receive[action][key] = callback;
  return () => {
    delete receive[action][key];
  };
};

export const isConnected = async () => {
  let count = 0;

  return new Promise((resolve, reject) => {
    setInterval(() => {
      if (connected) {
        resolve();
      } else if (count > 50) {
        reject();
      }
    }, 100);
  });
};
