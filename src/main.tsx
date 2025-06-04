import * as log from 'loglevel';
import React from 'react';
import ReactDOMClient from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import App from './App';
import './index.css';
import { createRoute } from './routes';
import TestBedComponent from './testbed/testbed.component';
import { createWebsocketClient } from './websocket';

export const pluginName = 'demo_plugin';

if (process.env.NODE_ENV === `development`) {
  const el = document.getElementById(pluginName);
  if (el) {
    const root = ReactDOMClient.createRoot(el);
    root.render(
      <TestBedComponent pluginName="Demo Plugin">
        <App />
      </TestBedComponent>
    );
  }
  log.setDefaultLevel(log.levels.DEBUG);
} else {
  log.setDefaultLevel(log.levels.ERROR);
}

function domElementGetter(): HTMLElement {
  // Make sure there is a div for us to render into
  let el = document.getElementById(pluginName);
  if (!el) {
    el = document.createElement('div');
  }
  return el;
}

// Create WebSocket client to respond to listen for pushed notifications
createWebsocketClient('ws://localhost:3210/');

const reactLifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: () => (document.getElementById(pluginName) ? <App /> : null),
  domElementGetter,
  errorBoundary: (error): React.ReactElement => {
    log.error(`${pluginName} failed with error: ${error}`);

    return (
      <div className="error">
        <div
          style={{
            padding: 20,
            background: 'red',
            color: 'white',
            margin: 5,
          }}
        >
          Something went wrong...
        </div>
      </div>
    );
  },
});

// these are examples of route registration events being fired back to the parent
createRoute('Data', 'Demo Plugin', '/plugin1', 10, 'Data help text');
createRoute(
  'Analysis',
  'Demo Plugin Analysis',
  '/plugin1/analysis',
  4,
  'Analysis help text'
);

// Single-SPA bootstrap methods have no idea what type of inputs may be
// pushed down from the parent app
export function bootstrap(props: unknown): Promise<void> {
  return reactLifecycles
    .bootstrap(props)
    .then(() => {
      log.info(`${pluginName} has been successfully bootstrapped`);
    })
    .catch((error: Error) => {
      log.error(`${pluginName} failed whilst bootstrapping: ${error}`);
    });
}

export function mount(props: unknown): Promise<void> {
  return reactLifecycles
    .mount(props)
    .then(() => {
      log.info(`${pluginName} has been successfully mounted`);
    })
    .catch((error: Error) => {
      log.error(`${pluginName} failed whilst mounting: ${error}`);
    });
}

export function unmount(props: unknown): Promise<void> {
  return reactLifecycles
    .unmount(props)
    .then(() => {
      log.info(`${pluginName} has been successfully unmounted`);
    })
    .catch((error: Error) => {
      log.error(`${pluginName} failed whilst unmounting: ${error}`);
    });
}
