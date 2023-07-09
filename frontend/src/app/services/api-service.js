import { v4 as uuid } from 'uuid';

let socket;
const receive = {};
let connected = false;
const wssUrl = process.env.REACT_APP_WSS_URL;

export const onMessage = (data) => {
  const { action } = data;
  console.log('debug receive', receive);
  const callbacks = receive[action] || {};
  Object.values(callbacks).forEach((callback) => {
    if (typeof callback === 'function') {
      callback(data);
    } else {
      console.log('debug no callback', action);
    }
  });
};

export const connect = () => {
  socket = new WebSocket(`${wssUrl}`);

  socket.onopen = (event) => {
    console.log('debug connected', event);
    connected = true;
  };

  socket.onerror = (error) => {
    console.log('debug error', error.message);
  };

  socket.onmessage = (response) => {
    const data = JSON.parse(response.data);
    onMessage(data);
  };

  return () => {
    connected = false;
    socket.close();
  };
};

export const send = (route, data) => {
  const input = { action: route };
  const message = JSON.stringify({ ...input, ...data });
  console.log('debug send', message);
  if (connected) {
    socket.send(message);
  } else {
    console.log('debug not connected');
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
