import React from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Main from './Main/Main';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import About from './About/About';
import How from './How/How';
import UserPanel from './UserPanel/UserPanel';
import AdminPanel from './AdminPanel/AdminPanel';
import Catalog from './Catalog/Catalog'; 
import Cart from './Cart/Cart';
import Registration from './Registration/Registration';
import Product from './Product/Product';

import './App.css';

class App extends React.Component {
  render() {
    return (
      <React.StrictMode>
      <Header />
      <Router>
              <Switch>
                <Route exact path="/" component={Main} />
                <Route path="/about" component={About} />
                <Route path="/how" component={How} />
                <Route path="/user-panel" component={UserPanel} />
                <Route path="/admin-panel" component={AdminPanel} />
                <Route path="/catalog" component={Catalog} />
                <Route path="/cart" component={Cart}/>
                <Route path="/registration" component={Registration}/>
                <Route path="/product" component={Product}/>
              </Switch>
            </Router>
     


      <Footer/>
    </React.StrictMode>

    )
  }
}

export default App;
