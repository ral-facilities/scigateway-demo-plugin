import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter,
} from 'react-router-dom';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <div
          style={{
            padding: 20,
            background: 'green',
            color: 'white',
            margin: 5,
          }}
        >
          Demo Plugin
          <nav>
            <ul>
              <li>
                <Link to="/plugin1">/plugin1</Link>
              </li>
              <li>
                <Link to="/plugin1/analysis/">/plugin1/analysis</Link>
              </li>
              <li>
                <Link to="/plugin1/redirect/">Redirect test</Link>
              </li>
              <li>
                <Link to="/plugin1/invalidatetoken/">
                  Token Invalidation test
                </Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </ul>
          </nav>
          <Route path="/plugin1" exact render={() => <h2>/plugin1</h2>} />
          <Route
            path="/plugin1/analysis/"
            render={() => <h2>/plugin1/analysis</h2>}
          />
          <Route
            path="/plugin1/redirect/"
            component={withRouter(({ history }) => (
              <button
                type="button"
                onClick={() => {
                  history.push('/login');
                }}
              >
                Go to login
              </button>
            ))}
          />
          <Route
            path="/plugin1/invalidatetoken/"
            component={() => (
              <button
                type="button"
                onClick={() => {
                  document.dispatchEvent(
                    new CustomEvent('scigateway', {
                      detail: { type: 'scigateway:api:invalidate_token' },
                    })
                  );
                }}
              >
                Invalidate token
              </button>
            )}
          />
        </div>
      </div>
    </Router>
  );
};

export default App;
