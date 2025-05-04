import { v4 as uuid } from "uuid";
import { STATES } from "../utils/constants";

let socket;
const receive = {};
let state = "disconnected";
let noReconnect = false;
const wssUrl = process.env.REACT_APP_WSS_URL;

const setState = (_state) => {
  state = _state;
};

const getState = () => {
  return state;
};

const isDisconnected = () => {
  return getState() === STATES.disconnected;
};

const isConnecting = () => {
  return getState() === STATES.connecting;
};

const isConnected = () => {
  return getState() === STATES.connected;
};

export const reconnect = () => {
  return connect();
};

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
  if (!isDisconnected()) {
    console.log("debug already connected");
    return () => {};
  }
  setState(STATES.connecting);

  socket = new WebSocket(`${wssUrl}`);

  socket.onopen = (event) => {
    console.log("debug connected", event);
    setState(STATES.connected);
    onMessage({ route: "connected", connected: true });
  };

  socket.onerror = (event) => {
    console.log("debug error", event);
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  socket.onclose = () => {
    console.log("debug close");
    setState(STATES.disconnected);
    onMessage({ route: "close", reconnect: !noReconnect });
  };

  return () => {
    if (isConnected()) {
      noReconnect = true;
      socket.close();
    }
  };
};

export const send = (route, data) => {
  const message = JSON.stringify({ action: "process", route, ...data });
  console.log("debug send", message);
  if (isConnected()) {
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
