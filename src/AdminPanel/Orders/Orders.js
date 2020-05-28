import React from 'react';


class Orders extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ids: [],
            quantity: {},
            totalPrice: {},
            date: {},
            city: {},
            street: {},
            house: {},
            phone: {},
            status: {},
            statusButtons: {},
            isLoaded: false
        }
    }

    componentDidMount() {
        this.showOrders();
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

    showOrders = () => {
        this.sendRequest('POST', 'http://api.laptop-shop.by/ordersForAdmin.php')
            .then(response => {
                let quantity = {};
                let totalPrice = {};
                let date = {};
                let city = {};
                let street = {};
                let house = {};
                let phone = {};
                let status = {};
                let statusButtons = {};
                Object.keys(response).forEach(elem => {
                    quantity[elem] = {};
                    response[elem].quantity.slice(0, -1).split(',').forEach(e => {
                        quantity[elem][e.slice(0, e.indexOf(':'))] = e.slice(e.indexOf(':') + 1);
                    })
                    totalPrice[elem] = response[elem].totalPrice;
                    date[elem] = response[elem].date;
                    city[elem] = response[elem].city;
                    street[elem] = response[elem].street;
                    house[elem] = response[elem].house;
                    phone[elem] = response[elem].phone;
                    let statusButtonsElem = {
                        processed: 'd-none',
                        shipped: 'd-none',
                        delivered: 'd-none',
                        cancel: 'd-none'
                    }
                    switch (response[elem].status) {
                        case 'not processed':
                            statusButtonsElem['processed'] = '';
                            statusButtonsElem['cancel'] = '';
                            break;
                        case 'processed':
                            statusButtonsElem['shipped'] = '';
                            statusButtonsElem['cancel'] = '';
                            break;
                        case 'shipped':
                            statusButtonsElem['delivered'] = '';
                            statusButtonsElem['cancel'] = '';
                            break;
                        default:
                            break;
                    }
                    statusButtons[elem] = statusButtonsElem;
                    switch (response[elem].status) {
                        case 'not processed':
                            status[elem] = 'Не обработан';
                            break;
                        case 'processed':
                            status[elem] = 'Обработан';
                            break;
                        case 'shipped':
                            status[elem] = 'Отправлен';
                            break;
                        case 'delivered':
                            status[elem] = 'Доставлен';
                            break;
                        case 'canceled':
                            status[elem] = 'Отменен';
                            break;
                        default:
                            break;
                    }
                })

                let ids = [];
                Object.keys(response).forEach(elem => {
                    ids.push(Number(elem));
                })
                this.setState(state => {
                    return {
                        ids: ids.sort(function (a, b) {
                            return b - a;
                        }),
                        quantity: quantity,
                        totalPrice: totalPrice,
                        date: date,
                        city: city,
                        street: street,
                        house: house,
                        phone: phone,
                        status: status,
                        statusButtons: statusButtons,
                        isLoaded: true
                    }
                })
                console.log(this.state);
            })
    }

    changeStatus = (id, action) => {
        console.log(id, action);
        let body = {
            id: id,
            action: action
        }
        this.sendRequest('POST', 'http://api.laptop-shop.by/changeOrderStatus.php', body)
            .then(response => {
                if (response === "success") {
                    this.showOrders();
                } else {
                    alert('Ошибка сервера');
                }
            })
    }

    showOrderInfo = (orderId) => {
        document.querySelector('#product-info-' + orderId).classList.remove('d-none');
        document.querySelector('#show-info-' + orderId).classList.add('d-none');
        document.querySelector('#hide-info-' + orderId).classList.remove('d-none');
    }

    hideOrderInfo = (orderId) => {
        document.querySelector('#product-info-' + orderId).classList.add('d-none');
        document.querySelector('#show-info-' + orderId).classList.remove('d-none');
        document.querySelector('#hide-info-' + orderId).classList.add('d-none');
    }

    render() {
        const { ids, quantity, totalPrice, date, city, street, house, phone, status, isLoaded, statusButtons } = this.state;
        if (!isLoaded) {
            return (
                <div className="text-center mt-5">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="Orders">
                    <div className="container">
                        <div className="row m-1 mb-4 mt-3">
                            <div className="col-2"><h6>Номер заказа</h6></div>
                            <div className="col-2">Дата</div>
                            <div className="col-2">Сумма</div>
                            <div className="col-2">Статус</div>
                        </div>
                        {ids.map(elem => {
                            return (
                                <div key={elem}>
                                    <div className="row m-1" >
                                        <div className="col-2"><h6>{elem}</h6></div>
                                        <div className="col-2">{date[elem]}</div>
                                        <div className="col-2">{totalPrice[elem]}</div>
                                        <div className="col-2">{status[elem]}</div>
                                        <div className="col-3">
                                            <div className="row" style={{ height: "40px" }}>
                                                <button className={'col-5 ml-1 mr-1 btn btn-success ' + statusButtons[elem].processed} id={elem + '-processed'} onClick={() => { this.changeStatus(elem, 'processed') }} >Обработан</button>
                                                <button className={'col-5 ml-1 mr-1 btn btn-success ' + statusButtons[elem].shipped} id={elem + '-shipped'} onClick={() => { this.changeStatus(elem, 'shipped') }}>Отправлен</button>
                                                <button className={'col-5 ml-1 mr-1 btn btn-success ' + statusButtons[elem].delivered} id={elem + '-delivered'} onClick={() => { this.changeStatus(elem, 'delivered') }}>Доставлен</button>
                                                <button className={'col-5 ml-1 mr-1 btn btn-danger ' + statusButtons[elem].cancel} id={elem + '-cancel'} onClick={() => { this.changeStatus(elem, 'canceled') }}>Отменить</button>
                                            </div>
                                        </div>
                                        <div className="col-1" id={'show-info-' + elem}><button className="btn btn-light" onClick={() => { this.showOrderInfo(elem) }}><span className="material-icons">keyboard_arrow_down</span></button></div>
                                        <div className="col-1 d-none" id={'hide-info-' + elem}><button className="btn btn-light" onClick={() => { this.hideOrderInfo(elem) }}><span className="material-icons">keyboard_arrow_up</span></button></div>
                                    </div>
                                    <div className="border-top border-bottom m-1 d-none" id={"product-info-" + elem}>
                                        <h6>Заказанные товары</h6>
                                        {Object.keys(quantity[elem]).map(e => {
                                            return (
                                                <div className="quantity row" key={e}>
                                                    <p className="col-1"></p>
                                                    <p className="col-2">{e}</p>
                                                    <p className="col-2">{quantity[elem][e] + ' шт'}</p>
                                                </div>
                                            )
                                        })}
                                        <div className="adress">
                                            <h6>Адрес</h6>
                                            <div className="row">
                                                <p className="col-1"></p>
                                                <p className="col-2">Город</p>
                                                <p className="col-3">{city[elem]}</p>
                                            </div>
                                            <div className="row">
                                                <p className="col-1"></p>
                                                <p className="col-2">Улица</p>
                                                <p className="col-3">{street[elem]}</p>
                                            </div>
                                            <div className="row">
                                                <p className="col-1"></p>
                                                <p className="col-2">Дом</p>
                                                <p className="col-3">{house[elem]}</p>
                                            </div>
                                            <div className="row">
                                                <p className="col-1"></p>
                                                <p className="col-2">Телефон</p>
                                                <p className="col-3">{phone[elem]}</p>
                                                <p className="col-5"></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            )
                        })

                        }
                    </div>
                </div>
            )


        }
    }
}

export default Orders;