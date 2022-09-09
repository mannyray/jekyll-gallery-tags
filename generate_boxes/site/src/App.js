import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import  useWindowDimensions from './windows.js';
import Upload from './Upload';

const url_backend='http://127.0.0.1:5000';

const App = () => {
	const { height, width } = useWindowDimensions();

	return (
		<BrowserRouter>
			<Switch>
				<Route path="/">
					<div>
						<Upload url_backend={url_backend} height={height} width={width}/>
					</div>
				</Route>
			</Switch>
		</BrowserRouter>
	);
};
export default App;
