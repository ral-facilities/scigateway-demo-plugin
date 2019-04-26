import * as log from 'loglevel';

export function createWebsocketClient(url: string): WebSocket {
  // Connect plugin to WebSocket backend server
  const ws = new WebSocket(url, ['json']);

  ws.addEventListener('message', event => {
    const data = JSON.parse(event.data);
    log.info(
      `Received notification from WebSocket to dispatch ${data.message}`
    );
    console.log(
      `Received notification from WebSocket to dispatch ${data.message}`
    );
    const action = {
      type: 'daaas:api:notification',
      payload: {
        message: data.message,
        severity: data.severity,
      },
    };
    document.dispatchEvent(
      new CustomEvent('daaas-frontend', { detail: action })
    );
  });

  return ws;
}
