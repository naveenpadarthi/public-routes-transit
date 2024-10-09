import './App.css';
import { Outlet } from 'react-router-dom';
import store from './Store/store'
import { Provider } from 'react-redux';
import { APIProvider } from '@vis.gl/react-google-maps';

function App() {
  return (
    <Provider store={store}>
      <APIProvider apiKey='AIzaSyC5uvToAecLTUq1ZLmy6OelB_zl_LljEVk'>
        <Outlet/>
      </APIProvider>
    </Provider>
  );
}

export default App;
