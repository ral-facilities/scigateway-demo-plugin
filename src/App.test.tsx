import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  // it('displays fallback UI if error thrown', () => {
  //   const wrapper = mount(<App />);
  //   wrapper.setState({ hasError: true });
  //   expect(wrapper.find('.error').length).toBe(1);
  // });
});
