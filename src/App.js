import "./App.css";
import Main from "./components/main";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "./store/store";

function App() {
    return (
        <Provider store={store}>
            <div className="App">
                <Toaster />
                <Main />
            </div>
        </Provider>
    );
}

export default App;
