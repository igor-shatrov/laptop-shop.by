import React from 'react';
import { connect } from 'react-redux';
import UserList from './UserList/UserList';
import AdminCatalog from './AdminCatalog/AdminCatalog';
import Orders from './Orders/Orders';

class AdminPanel extends React.Component {
  constructor(props) {
    super(props);
    this.status = this.testCookie();
  }

  sendRequest(method, url, body = null) {
    return fetch(url, {
      method: method,
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return response.then(error => {
          const e = new Error('Что-то пошло не так')
          e.data = error;
          throw e;
        })
      }
    })
  }

  testCookie = () => {
    this.props.changePage();
    let cookieId = this.getCookie('laptopId');
    let cookieHash = this.getCookie('laptopHash');
    let body = {
      id: cookieId,
      hash: cookieHash
    }

    this.sendRequest("POST", "http://api.laptop-shop.by/loginCookie.php", body)
      .then(response => {
        if (response === 'not found') {
          document.location.href = ('/');
        } else if (response.privileges !== "admin") {
          document.location.href = ('/');
        }
      })
  }

  getCookie(name) {
    var matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([$?*|{}\]\\^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  slide = (elementId, componentId) => {
    document.querySelectorAll('.nav-link').forEach((elem) => { elem.classList.remove('active') });
    document.querySelectorAll('.nav-link').forEach((elem) => { elem.classList.add('border-bottom') });
    document.querySelector('#' + elementId).classList.toggle('active');
    document.querySelector('#' + elementId).classList.toggle('border-bottom');
    document.querySelectorAll('.component').forEach((elem) => { elem.style.display = 'none' });
    document.querySelector('#' + componentId).style.display = 'block';
  }

  render() {

    return (
      <div className="adminPanel">
        <div className="container">
          <h1>AdminPanel</h1>
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button className="nav-link btn btn-link active" id="user-list" onClick={() => { this.slide('user-list', 'UserList') }}>Список пользователей</button>
            </li>
            <li className="nav-item">
              <button className="nav-link border-bottom btn btn-link" id="catalog" onClick={() => { this.slide('catalog', 'AdminCatalog') }}>Каталог</button>
            </li>
            <li className="nav-item">
              <button className="nav-link border-bottom btn btn-link" id="orders" onClick={() => { this.slide('orders', 'Orders') }}>Заказы</button>
            </li>
            <li className="nav-item">
              <button className="nav-link disabled" tabIndex="-1" aria-disabled="true">Disabled</button>
            </li>
          </ul>
          <div className="user-list"></div>
          <div className="catalog-edit"></div>
          <div className="orders"></div>
        </div>
        <div className="component" id="UserList">
          <UserList />
        </div>
        <div className="component" id="AdminCatalog" style={{ display: 'none' }}>
          <AdminCatalog />
        </div>
        <div className="component" id="Orders" style={{ display: 'none' }}>
          <Orders />
        </div>
      </div>
    );
  }
}



function mapDispatchToProps(dispatch) {
  return {
    changePage: () => dispatch({ type: 'CHANGE', page: '/admin-panel' })
  }
}

export default connect(null, mapDispatchToProps)(AdminPanel);