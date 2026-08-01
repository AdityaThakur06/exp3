import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import App from './App';
import './index.css';

/**
 * index.js
 * ------------------------------------------------------------------
 * PURPOSE
 * The entry point. Two providers wrap <App />:
 *   - <Provider store={store}> makes Redux state/useSelector/
 *     useDispatch available anywhere in the tree.
 *   - <BrowserRouter> enables client-side routing via react-router-dom
 *     (useNavigate, <Routes>, <Route>, <Navigate>, etc.), which is
 *     what ProtectedRoute and Navbar rely on.
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
