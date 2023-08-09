import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import './index.css';

import App from './components/App';

const root = ReactDOM.createRoot(document.getElementById('root'));

if (process.env.NODE_ENV === 'production') {
  // disable the console log feature under the production mode.
  console.log = function () { };

  root.render(
    <App />
  );

} else {

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

reportWebVitals(console.log);
