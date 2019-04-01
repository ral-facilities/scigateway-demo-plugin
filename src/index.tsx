import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import singleSpaReact from 'single-spa-react';
import TestBedComponent from './testbed/testbed.component';
import * as log from 'loglevel';

function domElementGetter(): HTMLElement {
  // Make sure there is a div for us to render into
  let el = document.getElementById('demo_plugin');
  if (!el) {
    el = document.createElement('div');
    el.id = 'demo_plugin';
    document.body.appendChild(el);
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

/* eslint-disable @typescript-eslint/no-explicit-any */
// Single-SPA bootstrap methods have no idea what type of inputs may be
// pushed down from the parent app
export function bootstrap(props: any): Promise<void> {
  // this is an example of a message being fired back to the
  // parent and should be updated as part of the navigation story
  const action = {
    type: 'REGISTER_ROUTE',
    payload: {
      section: 'Data',
      link: '/plugin1',
      plugin: 'demo_plugin',
    },
  };
  document.dispatchEvent(new CustomEvent('daaas-frontend', { detail: action }));

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
