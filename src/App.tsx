import React, { Component } from 'react';
import './App.css';

class App extends Component {
  public render(): React.ReactNode {
    return (
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
        </div>
      </div>
    );
  }
}

export default App;
