import React from 'react';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router';
import './App.css';

const App: React.FC = () => {
  // we need to call forceUpdate if SciGateway tells us to rerender
  // but there's no forceUpdate in functional components, so this is the hooks equivalent
  // see https://reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate

  const [_, forceUpdate] = React.useReducer((x) => x + 1, 0);

  function handler(e: Event): void {
    // attempt to re-render the plugin if we get told to
    const action = (e as CustomEvent).detail;
    if ('scigateway:api:plugin_rerender'.match(action)) {
      forceUpdate();
    }
  }

  React.useEffect(() => {
    document.addEventListener('scigateway', handler);
    return () => {
      document.removeEventListener('scigateway', handler);
    };
  }, []);

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
          <Routes>
            <Route path="/plugin1" element={<h2>/plugin1</h2>} />
            <Route
              path="/plugin1/analysis/"
              element={<h2>/plugin1/analysis</h2>}
            />
            <Route
              path="/plugin1/redirect/"
              element={
                <Link to="/login">
                  <button type="button">Go to login</button>
                </Link>
              }
            />
            <Route
              path="/plugin1/invalidatetoken/"
              element={
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
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
