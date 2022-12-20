import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './index.css';
import App from './App';
// import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

const DATA = [
  { name: 'My Playlist #1', id: 1 },
  { name: 'My Playlist #2', id: 2 },
  { name: 'My Playlist #3', id: 3 },
];

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <App userPlaylists={DATA} />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
