import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import singleSpaReact from 'single-spa-react';

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
  ReactDOM.render(<App />, document.getElementById('demo_plugin'));
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
    type: 'daaas:api:registerroute',
    payload: {
      section: 'Data',
      link: '/plugin1',
      plugin: 'demo_plugin',
      displayName: 'Demo Plugin',
    },
  };
  document.dispatchEvent(new CustomEvent('daaas-frontend', { detail: action }));

  return reactLifecycles.bootstrap(props);
}

export function mount(props: any): Promise<void> {
  return reactLifecycles.mount(props);
}

export function unmount(props: any): Promise<void> {
  return reactLifecycles.unmount(props);
}
/* eslint-enable @typescript-eslint/no-explicit-any */
