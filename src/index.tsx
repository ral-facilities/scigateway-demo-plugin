import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import singleSpaReact from 'single-spa-react';
import TestBedComponent from './testbed/testbed.component';
import * as log from 'loglevel';

// Connect plugin to WebSockeet backend server
const ws = new WebSocket('ws://localhost:3210/', ['json']);

ws.addEventListener('message', event => {
  const data = JSON.parse(event.data);
  log.info(`Received notification from WebSocket to dispatch ${data.message}`);
  const action = {
    type: 'daaas:api:notification',
    payload: {
      id: data.id,
      message: data.message,
    },
  };
  document.dispatchEvent(new CustomEvent('daaas-frontend', { detail: action }));
});

function domElementGetter(): HTMLElement {
  // Make sure there is a div for us to render into
  let el = document.getElementById('demo_plugin');
  if (!el) {
    el = document.createElement('div');
  }

  return el;
}

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

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: App,
  domElementGetter,
});

// these are examples of route registration events being fired back to the parent
const routeOneAction = {
  type: 'daaas:api:register_route',
  payload: {
    section: 'Data',
    link: '/plugin1',
    plugin: 'demo_plugin',
    displayName: 'Demo Plugin',
    order: 10,
  },
};
document.dispatchEvent(
  new CustomEvent('daaas-frontend', { detail: routeOneAction })
);

const routeTwoAction = {
  type: 'daaas:api:register_route',
  payload: {
    section: 'Analysis',
    link: '/plugin1/analysis',
    plugin: 'demo_plugin',
    displayName: 'Demo Plugin Analysis',
    order: 4,
  },
};
document.dispatchEvent(
  new CustomEvent('daaas-frontend', { detail: routeTwoAction })
);

window.addEventListener('single-spa:routing-event', () => {
  // attempt to re-render the plugin if the corresponding div is present
  let el = document.getElementById('demo_plugin');
  if (el) {
    ReactDOM.render(<App />, document.getElementById('demo_plugin'));
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
