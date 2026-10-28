import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/styles.css';
import './styles/themes.css';
import './styles/product.css';
import './styles/hero.css';
import './styles/docs.css';
import './styles/header.css';
import './styles/page-banners.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
