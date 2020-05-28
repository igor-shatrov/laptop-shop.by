import React from 'react';
import Card from './Card/Card';


class Cart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            city: '',
            street: '',
            house: '',
            phone: '',
            userId: '',
            products: {},
            quantity: {},
            totalQuantity: 0,
            totalPrice: 0
        }
    }

    componentDidMount() {
        this.showCart();
        this.showAdress();
    }

    showAdress = () => {
        if (document.cookie.includes('laptopId') && document.cookie.includes('laptopHash')) {
            console.log('hash exist');
            let id = '';
            let hash = '';
            document.cookie.split(';').forEach(elem => {
                if (elem.includes('laptopId')) {
                    id = elem.slice(10);
                }
                if (elem.includes('laptopHash')) {
                    hash = elem.slice(11);
                }
            })
            let body = {
                id: id,
                hash: hash
            }
            this.sendRequest('POST', 'http://api.laptop-shop.by/showAdress.php', body)
                .then(response => {
                    if (response !== 'not exist') {
                        this.setState(() => {
                            return {
                                city: response.city,
                                street: response.street,
                                house: response.house,
                                phone: response.phone,
                                userId: response.id
                            }
                        })
                        console.log(this.state);
                    }
                })
        } else {
            this.setState(() => { return { phone: '+375' } })
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

    showCart = () => {
        let productGCodes = [];
        document.cookie.split('; ').forEach(elem => {
            if (elem.includes('laptopProductGCode')) {
                productGCodes = elem.slice(19).split('&');
            }
        })
        let body = {
            gCode: productGCodes
        }
        if (productGCodes[0]) {
            this.sendRequest('POST', 'http://api.laptop-shop.by/cart.php', body)
                .then(response => {
                    console.log(response);
                    if (response !== 'not exist') {
                        let totalPrice = 0;
                        let quantity = {};
                        Object.keys(response).forEach(elem => {
                            console.log(response[elem].price);
                            totalPrice = totalPrice + Number(response[elem].price);
                            quantity[elem] = 1;
                        })
                        this.setState(state => {
                            return {
                                length: Object.keys(response),
                                info: response,
                                quantity: quantity,
                                totalQuantity: Object.keys(response).length,
                                totalPrice: totalPrice,
                                phone: state.phone,
                                isLoaded: true
                            }
                        })
                        console.log(this.state);
                    } else {
                        document.cookie = 'laptopProductGCode=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
                        window.location.href = '/cart';
                    }
                }
                )
        } else {
            console.log('Пусто в корзине');
        }
    }

    filterInputQuantity = (e) => {
        if (e.charCode < 48 || e.charCode > 57) {
            return e.preventDefault();
        }
    }

    plusMinusButtons = (value, gCode) => {
        document.querySelector('#quantity' + gCode).value = Number(document.querySelector('#quantity' + gCode).value) + value;
        this.newQuality(gCode, document.querySelector('#quantity' + gCode).value);
    }

    changeQuantity = (gCode) => {
        this.newQuality(gCode, document.querySelector('#quantity' + gCode).value);

    }

    newQuality = (gCode, value) => {
        let quantity = this.state.quantity;
        quantity[gCode] = value;
        let totalPrice = Object.keys(quantity).reduce((totalPrice, elem) => {
            return (Number(totalPrice) + Number(this.state.info[elem].price) * quantity[elem]);
        }, 0);
        let totalQuantity = Object.keys(quantity).reduce((totalQuantity, elem) => {
            return Number(totalQuantity) + Number(quantity[elem]);
        }, 0)
        this.setState(() => {
            return {
                quantity: quantity,
                totalQuantity: totalQuantity,
                totalPrice: totalPrice
            }
        })
    }

    order = () => {
        let city = document.querySelector('#city').value;
        let street = document.querySelector('#street').value;
        let house = document.querySelector('#house').value;
        let phone = document.querySelector('#phone').value;
        let payment;
        document.querySelectorAll('.payment').forEach(elem => {
            console.log(elem.checked);
            if (elem.checked) {
                payment = elem.value;
            }
        })
        if (city.length < 3) {
            document.querySelector('#warning-city').classList.toggle('invisible');
        } else if (street.length < 3) {
            document.querySelector('#warning-street').classList.toggle('invisible');
        } else if (house.length < 1) {
            document.querySelector('#warning-house').classList.toggle('invisible');
        } else if (phone.length < 13) {
            document.querySelector('#warning-phone').classList.toggle('invisible');
        } else {
            let body = {
                city: city,
                street: street,
                house: house,
                phone: phone,
                payment: payment,
                userId: this.state.userId,
                totalPrice: this.state.totalPrice,
                quantity: this.state.quantity,
            }
            console.log(body);
            this.sendRequest('POST', 'http://api.laptop-shop.by/order.php', body)
                .then(response => {
                    console.log(response);
                    if (response === 'succes') {
                        document.cookie = 'laptopProductGCode=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
                        document.querySelector('#order-menu').classList.toggle('d-none');
                        document.querySelector('.order-success').classList.toggle('d-none');
                        document.querySelector('.products').classList.toggle('d-none');
                        setTimeout(this.href(), 3000);
                    }
                })
        }
    }

    href = () => {
        window.location.href = "/";
    }

    render() {
        const { length, info, isLoaded, city, street, house } = this.state;
        if (isLoaded) {
            return (
                <div className="cart mb-auto mt-5">
                    <div className="container">
                        <div className="order-success d-none">
                            <div className="row justify-content-md-center"><h2 className="text-success">Ваш заказ принят</h2></div>
                            <div className="row justify-content-md-center"><h4>Наш менеджер свяжется с вами в ближайшее время</h4></div>
                        </div>
                        <div className="products border-bottom border-dark">
                            {length.map(elem => {
                                return (
                                    <div className="row justify-content-start mt-2 mb-4" key={info[elem].id}>
                                        <input type="checkbox" defaultChecked={true} />
                                        <div className="container row">
                                            <div className="col-9">
                                                <Card id={info[elem].id} image={info[elem].firstImage} name={info[elem].name} price={info[elem].price} gCode={info[elem].gCode} />
                                            </div>
                                            <div className="col-3 my-auto">
                                                <div className="quantity row">
                                                    <div className="minus"><span className="material-icons" style={{ cursor: 'pointer' }} onClick={() => this.plusMinusButtons(-1, elem)}>remove</span></div>
                                                    <input type="text" style={{ width: '50px' }} id={'quantity' + elem} onKeyPress={this.filterInputQuantity} defaultValue={1} onChange={() => this.changeQuantity(elem)} />
                                                    <div className="plus"><span className="material-icons" style={{ cursor: 'pointer' }} onClick={() => this.plusMinusButtons(1, elem)}>add</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>)
                            })}
                        </div>
                        <div id="order-menu">
                            <div className="total row">
                                <div className="col-9"></div>
                                <div className="col-1">{this.state.totalQuantity}</div>
                                <div className="col-2">{this.state.totalPrice} руб</div>
                            </div>
                            <div className="adress m-5">
                                <div className="row mt-2">
                                    <label htmlFor="city" className="col-1"> Город</label><input type="text" id="city" className="col-lg-3" defaultValue={city} /><label htmlFor="city" className="col-3 invisible text-danger" id="warning-city"> Неправильные данные</label>
                                </div>
                                <div className="row mt-2">
                                    <label htmlFor="street" className="col-1"> Улица</label><input type="text" id="street" className="col-lg-3" defaultValue={street} /><label htmlFor="street" className="col-3 invisible text-danger" id="warning-street"> Неправильные данные</label>
                                </div>
                                <div className="row mt-2">
                                    <label htmlFor="house" className="col-1"> Дом</label><input type="text" id="house" className="col-lg-3" defaultValue={house} /><label htmlFor="street" className="col-3 invisible text-danger" id="warning-house"> Неправильные данные</label>
                                </div>
                                <div className="row mt-2">
                                    <label htmlFor="phone" className="col-1"> Телефон</label><input type="text" id="phone" className="col-lg-3" defaultValue={this.state.phone} maxLength={15} /><label htmlFor="street" className="col-3 invisible text-danger" id="warning-phone"> Неправильные данные</label>
                                </div>
                                <div className="mt-4 payment">
                                    <div className="form-check">
                                        <input className="form-check-input payment" type="radio" name="exampleRadios" id="cash" value="cash" defaultChecked />
                                        <label className="form-check-label" forhtml="cash">Наличными при получении</label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input payment" type="radio" name="exampleRadios" id="card" value="card" />
                                        <label className="form-check-label" forhtml="card">Карточкой при получении</label>
                                    </div>
                                </div>
                            </div>
                            <div className="send row">
                                <div className="col-9"></div>
                                <button type="button" className="btn btn-primary col-3" onClick={this.order}>Оформить заказ</button>
                            </div>
                        </div>

                    </div>
                </div >
            )
        } else {
            return (
                <div className="cart">
                    <div className="container">
                        <h4>Корзина пуста</h4>
                    </div>
                </div>
            )
        }

    }
}

export default Cart;
