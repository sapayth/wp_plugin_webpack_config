import '../styles/main.css';
import { render } from '@wordpress/element';
import { createRoot } from 'react-dom/client';
import App from '../components/App';

const container = document.getElementById('plugin-page');
const root = createRoot(container);
root.render(<App tab="home" />);