import React from 'react';

class PrivateData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        }
    }

    componentDidMount() {
        this.showData();
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

    showData = () => {
        let body = {
            action: "show",
            id: this.props.id
        }
        this.sendRequest('POST', 'http://api.laptop-shop.by/privateData.php', body)
            .then(response => {
                this.setState(() => {
                    return {
                        firstName: response.firstName,
                        lastName: response.lastName,
                        email: response.email,
                        city: response.city,
                        street: response.street,
                        house: response.house,
                        phone: response.phone,
                        isLoaded: true
                    }
                })
            })
    }

    change = (e) => {
        document.querySelector("#" + e.target.dataset.property + "-label").classList.toggle("d-none");
        document.querySelector("#" + e.target.dataset.property + "-edit").classList.toggle("d-none");
    }

    enter = (e) => {
        console.log(e.target.dataset.property);
        if (e.target.dataset.property !== "password") {
            if (e.target.dataset.property !== "password") {
                document.querySelector("#" + e.target.dataset.property + "-label").classList.toggle("d-none");
                document.querySelector("#" + e.target.dataset.property + "-edit").classList.toggle("d-none");
            }
            let body = {
                action: "change",
                id: this.props.id,
                property: e.target.dataset.property,
                value: document.querySelector('#' + e.target.dataset.property + '-edit input').value
            }
            this.sendRequest('POST', 'http://api.laptop-shop.by/privateData.php', body)
                .then(response => {
                    this.showData();
                })
        } else {
            let body = {
                action: "changePassword",
                id: this.props.id,
                newPassword: document.querySelector('#password-edit input').value
            }
            this.sendRequest('POST', 'http://api.laptop-shop.by/privateData.php', body)
                .then(response => {
                    if (response === 'success') {
                        document.querySelector('#password-edit button').classList.remove('btn-light');
                        document.querySelector('#password-edit button').classList.add('btn-success');
                        setTimeout(this.buttonStatusBack, 5000);
                    } else if (response === 'error') {
                        document.querySelector('#password-edit button').classList.remove('btn-light');
                        document.querySelector('#password-edit button').classList.add('btn-success');
                    }
                    console.log(response);
                })
        }
    }

    buttonStatusBack = () => {
        document.querySelector('#password-edit button').classList.remove('btn-success');
        document.querySelector('#password-edit button').classList.add('btn-light');
    }

    render() {
        const { isLoaded, } = this.state;

        if (isLoaded) {
            return (
                <div className=" container " >
                    <h1>PrivateData</h1>
                    <form>
                        <div className="row m-3" id="firstName-label">
                            <label htmlFor="firstName" className="col-3">Имя</label>
                            <label htmlFor="firstName" className="col-6">{this.state.firstName}</label>
                            <button type="button" className="btn btn-light" onClick={this.change} data-property="firstName"><span className="material-icons" data-property="firstName">create</span></button>
                        </div>
                        <div className="row m-3 d-none" id="firstName-edit">
                            <label htmlFor="first-name" className="col-3">Имя</label>
                            <input type="text" className="col-6" defaultValue={this.state.firstName} />
                            <button type="button" className="btn btn-light" onClick={this.enter} data-property="firstName"><span className="material-icons" data-property="firstName">check</span></button>
                        </div>
                        <div className="row m-3" id="lastName-label">
                            <label htmlFor="lastName" className="col-3">Фамилия</label>
                            <label htmlFor="lastName" className="col-6">{this.state.lastName}</label>
                            <button type="button" className="btn btn-light" onClick={this.change} data-property="lastName"><span className="material-icons" data-property="lastName">create</span></button>
                        </div>
                        <div className="row m-3 d-none" id="lastName-edit">
                            <label htmlFor="lastName" className="col-3">Фамилия</label>
                            <input type="text" className="col-6" defaultValue={this.state.lastName} />
                            <button type="button" className="btn btn-light" onClick={this.enter} data-property="lastName"><span className="material-icons" data-property="lastName">check</span></button>
                        </div>
                        <div className="row m-3" id="email-label">
                            <label htmlFor="email" className="col-3">Электронная почта</label>
                            <label htmlFor="email" className="col-6">{this.state.email}</label>
                            <button type="button" className="btn btn-light" onClick={this.change} data-property="email"><span className="material-icons" data-property="email">create</span></button>
                        </div>
                        <div className="row m-3 d-none" id="email-edit">
                            <label htmlFor="email" className="col-3">Электронная почта</label>
                            <input type="text" className="col-6" defaultValue={this.state.email} />
                            <button type="button" className="btn btn-light" onClick={this.enter} data-property="email"><span className="material-icons" data-property="email">check</span></button>
                        </div>
                        <div className="row m-3" id="city-label">
                            <label htmlFor="city" className="col-3">Город</label>
                            <label htmlFor="city" className="col-6">{this.state.city}</label>
                            <button type="button" className="btn btn-light" onClick={this.change} data-property="city"><span className="material-icons" data-property="city">create</span></button>
                        </div>
                        <div className="row m-3 d-none" id="city-edit">
                            <label htmlFor="city" className="col-3">Город</label>
                            <input type="text" className="col-6" defaultValue={this.state.city} />
                            <button type="button" className="btn btn-light" onClick={this.enter} data-property="city"><span className="material-icons" data-property="city">check</span></button>
                        </div>
                        <div className="row m-3" id="street-label">
                            <label htmlFor="street" className="col-3">Улица</label>
                            <label htmlFor="street" className="col-6">{this.state.street}</label>
                            <button type="button" className="btn btn-light" onClick={this.change} data-property="street"><span className="material-icons" data-property="street">create</span></button>
                        </div>
                        <div className="row m-3 d-none" id="street-edit">
                            <label htmlFor="street" className="col-3">Улица</label>
                            <input type="text" className="col-6" defaultValue={this.state.street} />
                            <button type="button" className="btn btn-light" onClick={this.enter} data-property="street"><span className="material-icons" data-property="street">check</span></button>
                        </div>
                        <div className="row m-3" id="house-label">
                            <label htmlFor="house" className="col-3">Дом</label>
                            <label htmlFor="house" className="col-6">{this.state.house}</label>
                            <button type="button" className="btn btn-light" onClick={this.change} data-property="house"><span className="material-icons" data-property="house">create</span></button>
                        </div>
                        <div className="row m-3 d-none" id="house-edit">
                            <label htmlFor="house" className="col-3">Дом</label>
                            <input type="text" className="col-6" defaultValue={this.state.house} />
                            <button type="button" className="btn btn-light" onClick={this.enter} data-property="house"><span className="material-icons" data-property="house">check</span></button>
                        </div>
                        <div className="row m-3" id="phone-label">
                            <label htmlFor="phone" className="col-3">Телефон</label>
                            <label htmlFor="phone" className="col-6">{this.state.phone}</label>
                            <button type="button" className="btn btn-light" onClick={this.change} data-property="phone"><span className="material-icons" data-property="phone">create</span></button>
                        </div>
                        <div className="row m-3 d-none" id="phone-edit">
                            <label htmlFor="phone" className="col-3">Телефон</label>
                            <input type="text" className="col-6" defaultValue={this.state.phone} />
                            <button type="button" className="btn btn-light" onClick={this.enter} data-property="phone"><span className="material-icons" data-property="phone">check</span></button>
                        </div>
                        <div className="row m-3 " id="password-edit">
                            <label htmlFor="password" className="col-3">Сменить пароль</label>
                            <input type="text" className="col-6"  />
                            <button type="button" className="btn btn-light" onClick={this.enter} data-property="password"><span className="material-icons" data-property="password">check</span></button>
                        </div>
                    </form>
                </div>
            );
        } else {
            return (
                <div className="text-center mt-5">
                    <div className="spinner-grow" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )
        }
    }
}

export default PrivateData;
