import React from "react";
// import logo from './logo.svg';
import { HashRouter, Route, Switch } from "react-router-dom";
import "./App.css";

import demo from "./view/test/demo.jsx";

import routesList from "./routes/index";
const DeepApiShape = Component => {
    return class extends React.Component {
        render() {
            return <Component {...this.props} />;
        }
    };
};

@DeepApiShape
class App extends React.Component {
    componentDidMount() {}
    render() {
        return (
            <div className="App">
                <HashRouter>
                    <Switch>
                        {routesList.map(({ path, name, exact = true, component }) => (
                            <Route
                                key={path}
                                name={name}
                                path={path}
                                exact={exact}
                                component={component}
                            />
                        ))}
                        {/* demo */}
                        <Route path="/demo" exact component={demo} />
                    </Switch>
                </HashRouter>
            </div>
        );
    }
}

export default App;
