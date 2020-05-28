import React from 'react';
import './Header.css';
import { connect } from 'react-redux';


class Header extends React.Component {

  componentDidMount(){
    this.scanCartCookie();
  }

  scanCartCookie=()=>{
    console.log(document.cookie.split(';'));
    document.cookie.split(';').forEach(elem=>{
      if(elem.includes('laptopProductGCode')){
        console.log('cart active');
        document.querySelector('.cart li').classList.add('active');
        
      }
    })
    
  }

  loginValidation = () => {
    if (!document.querySelector("#login").validity.valid) {
      if (!document.querySelector('#login-btn').disabled) {
        document.querySelector('#login-btn').getAttribute("disabled");
        document.querySelector('#login-btn').disabled = true;
        document.querySelector('.login-invalid-feedback').style.display = "block";
      }
    } else {
      if (document.querySelector('#login-btn').disabled) {
        document.querySelector('#login-btn').removeAttribute("disabled");
        document.querySelector('.login-invalid-feedback').style.display = "none";
      }
    }
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

  getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([$?*|{}\]\\^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  testCookie = () => {
    let cookieId = this.getCookie('laptopId');
    let cookieHash = this.getCookie('laptopHash');
    console.log(cookieId);
    console.log(cookieHash);
    let body = {
      id: cookieId,
      hash: cookieHash
    }

    this.sendRequest("POST", "http://api.laptop-shop.by/loginCookie.php", body)
      .then(response => {
        if (response.privileges) {
          console.log(response.privileges);
          if (response.privileges === 'admin') {
            document.location.href = '/admin-panel';
          } else {
            document.location.href = '/user-panel';
          }
        }
      })
  }

  loginFunction = () => {
    let body = {
      login: document.querySelector('#login').value,
      password: document.querySelector('#password').value.trim()
    }
    this.sendRequest("POST", "http://api.laptop-shop.by/login.php", body)
      .then(response => {
        if (response.privileges) {
          console.log(response.privileges);
          document.querySelector('#wrong-password').style.display = "none";
          let date = new Date(Date.now() + 3600 * 24 * 3);
          document.cookie = "laptopHash=" + response.hash + "; expires=" + date;
          document.cookie = "laptopId=" + response.id + "; expires=" + date;
          if (response.privileges === 'admin') {
            document.location.href = '/admin-panel';
          } else {
            document.location.href = '/user-panel';
          }
        } else if (response === 'not found') {
          console.log('Неправильный логин или пароль');
          document.querySelector('#wrong-password').style.display = "block";
        }
      })
  }

  removeCookie = () => {
    document.cookie = "laptopHash=false; expires=-1";
    document.cookie = "laptopId=false; expires=-1";
    document.location.href = "/";
  }

  render() {
    return (
      <header className='Header bg-dark' >
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark container">

          <a className="navbar-brand" href="/"><span className="material-icons mr-2 align-middle"> laptop_mac</span>Laptop-shop</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <a className="nav-link" href="/">Главная<span className="sr-only">(current)</span></a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/catalog">Каталог</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/how">Как купить</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/about">О нас</a>
              </li>
            </ul>
            <ul className="navbar-nav cart">
              <li className="nav-item">
                <a className="nav-link" href="/cart">Корзина<span className="material-icons align-middle ml-1">shopping_cart</span></a>
              </li>
              <li className="nav-item">
                <button type="button" className="btn btn-primary btn-dark" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo" onClick={this.testCookie} style={{ display: this.props.signIn }}>Войти<span className="material-icons align-middle ml-1">input</span></button>
                <button type="button" className="btn btn-primary btn-dark" onClick={this.removeCookie} style={{ display: this.props.signOut }}>Выйти<span className="material-icons align-middle ml-1">call_missed_outgoing</span></button>
              </li>
            </ul>
          </div>

        </nav>
        <div className="search bg-dark container ">
          <form className="form-inline pb-3 my-2 my-lg-0 row">
            <div className="col-1"></div>
            <input className="form-control mr-sm-2 col-8" type="search" placeholder="Search" aria-label="Search"></input>
            <button className="btn btn-outline-success my-2 my-sm-0 col-2" type="submit">Search</button>
          </form>
        </div>

        <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Введите учетные данные</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form id="log">
                  <div className="form-group">
                    <label htmlFor="login" className="col-form-label">Электронная почта:</label>
                    <input type="email" className="form-control" id="login" onChange={this.loginValidation} required />
                    <div className="login-invalid-feedback">Пожалуйста, введите корректный адрес электронной почты</div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="password" className="col-form-label">Пароль:</label>
                    <input type="password" className="form-control" id="password" />
                    <p id="wrong-password">Такой логин или пароль не существуют</p>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <a href="/registration"><button type="button" className="btn btn-light">Регистрация</button></a>
                <button type="button" className="btn btn-secondary ml-auto" data-dismiss="modal">Отмена</button>
                <button type="submit" className="btn btn-primary" id="login-btn" onClick={this.loginFunction}>Войти</button>
              </div>
            </div>
          </div>
        </div>

      </header>
    );
  }
}

function mapStateToProps(state) {
  return {
    page: state.page,
    signIn: state.signIn,
    signOut: state.signOut
  }
}

export default connect(mapStateToProps)(Header);
