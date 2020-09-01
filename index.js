import React from 'react';
import ReactDOM from 'react-dom';
import Main from './src/Main'
import {Provider} from 'react-redux'
import { store } from './store';

console.log = console.warn = console.error = () => {};

ReactDOM.render(<Provider store={store}>
    <Main />
</Provider>, document.getElementById('app'));



