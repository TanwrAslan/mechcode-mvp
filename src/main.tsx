import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {PublicPortfolio} from './components/PublicPortfolio.tsx';
import './index.css';

// Basit yönlendirme: /public-portfolio/[kullanici_id] herkese açık portföy sayfasını açar.
const portfolioMatch = window.location.pathname.match(/^\/public-portfolio\/([^/]+)\/?$/);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {portfolioMatch ? <PublicPortfolio userId={decodeURIComponent(portfolioMatch[1])} /> : <App />}
  </StrictMode>,
);
