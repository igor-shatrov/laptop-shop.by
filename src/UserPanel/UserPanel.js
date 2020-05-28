import React from 'react';
import { connect } from 'react-redux';
import OrderHistory from './OrderHistory/OrderHistory';
import PrivateData from './PrivateData/PrivateData';

class UserPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      isLoaded: false
    }
  }

  componentDidMount() {
    this.testCookie();
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
        } else if (response.privileges !== "user") {
          document.location.href = ('/');
        }
        this.setState(() => {
          return {
            id: cookieId,
            isLoaded: true
          }
        })
      })
  }

  getCookie(name) {
    var matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([$?*|{}\]\\^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  showPrivateData = () => {
    document.querySelector('#private-data').classList.remove('d-none');
    document.querySelector('#order-history').classList.add('d-none');
  }

  showOrderHistory = () => {
    document.querySelector('#private-data').classList.add('d-none');
    document.querySelector('#order-history').classList.remove('d-none');
  }

  render() {
    const { id, isLoaded } = this.state;
    if (!isLoaded) {
      return (
        <div className="text-center mt-5">
          <div className="spinner-grow" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )
    } else {
      return (
        <div className="user-panel mb-auto mt-5">
          <div className="container">
            <h1>UserPanel</h1>
            <div className="row">
              <div className="col-3 btn-group-vertical align-items-top">
                <button type="button" className="btn btn-link p-0 mt-3" style={{ flex: '0' }} onClick={this.showPrivateData}>Личные данные</button>
                <button type="button" className="btn btn-link p-0 mb-auto" style={{ flex: '0' }} onClick={this.showOrderHistory}>История заказов</button>

              </div>
              <div className="col-9">
                <div className="container" id="private-data"><PrivateData id={id} /></div>
                <div className="container d-none" id="order-history"><OrderHistory id={id} /></div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}
function mapDispatchToProps(dispatch) {
  return {
    changePage: () => dispatch({ type: 'CHANGE', page: '/user-panel' })
  }
}

export default connect(null, mapDispatchToProps)(UserPanel);