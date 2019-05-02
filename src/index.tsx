import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import singleSpaReact from 'single-spa-react';
import TestBedComponent from './testbed/testbed.component';
import * as log from 'loglevel';
import { createRoute } from './routes';
import { createWebsocketClient } from './websocket';

if (process.env.NODE_ENV === `development`) {
  ReactDOM.render(
    <TestBedComponent pluginName="Demo Plugin">
      <App />
    </TestBedComponent>,
    document.getElementById('demo_plugin')
  );
  log.setDefaultLevel(log.levels.DEBUG);
} else {
  log.setDefaultLevel(log.levels.ERROR);
}

function domElementGetter(): HTMLElement {
  // Make sure there is a div for us to render into
  let el = document.getElementById('demo_plugin');
  if (!el) {
    el = document.createElement('div');
  }
  return el;
}

// Create WebSocket client to respond to listen for pushed notifications
createWebsocketClient('ws://localhost:3210/');

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: App,
  domElementGetter,
});

// these are examples of route registration events being fired back to the parent
createRoute('Data', 'Demo Plugin', '/plugin1', 10);
createRoute('Analysis', 'Demo Plugin Analysis', '/plugin1/analysis', 4);

const render = () => {
  let el = document.getElementById('demo_plugin');
  if (el) {
    ReactDOM.render(<App />, document.getElementById('demo_plugin'));
  }
};

window.addEventListener('single-spa:routing-event', () => {
  // attempt to re-render the plugin if the corresponding div is present
  render();
});

document.addEventListener('daaas-frontend', e => {
  // attempt to re-render the plugin if the corresponding div is present
  const action = (e as CustomEvent).detail;
  if (action.type === 'daaas:api:plugin_rerender') {
    render();
  }
});

/* eslint-disable @typescript-eslint/no-explicit-any */
// Single-SPA bootstrap methods have no idea what type of inputs may be
// pushed down from the parent app
export function bootstrap(props: any): Promise<void> {
  return reactLifecycles
    .bootstrap(props)
    .then(() => {
      log.info('demo_plugin has been successfully bootstrapped');
    })
    .catch(error => {
      log.error('demo_plugin failed whilst bootstrapping: ' + error);
    });
}

export function mount(props: any): Promise<void> {
  return reactLifecycles
    .mount(props)
    .then(() => {
      log.info('demo_plugin has been successfully mounted');
    })
    .catch(error => {
      log.error('demo_plugin failed whilst mounting: ' + error);
    });
}

export function unmount(props: any): Promise<void> {
  return reactLifecycles
    .unmount(props)
    .then(() => {
      log.info('demo_plugin has been successfully unmounted');
    })
    .catch(error => {
      log.error('demo_plugin failed whilst unmounting: ' + error);
    });
}
/* eslint-enable @typescript-eslint/no-explicit-any */
