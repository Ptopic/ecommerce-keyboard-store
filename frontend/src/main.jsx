import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

// Redux
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { CookiesProvider } from 'react-cookie';

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<CookiesProvider defaultSetOptions={{ path: '/' }}>
					<App />
				</CookiesProvider>
			</PersistGate>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);
