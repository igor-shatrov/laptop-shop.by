import React from 'react';

class OrderHistory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
        let body = {
            id: this.props.id
        }
        this.sendRequest('POST', 'http://api.laptop-shop.by/orderHistory.php', body)
            .then(response => {
                console.log(response);
                let dates = {};
                let totalPrice = {};
                let status = {};
                Object.keys(response).forEach(elem => {
                    dates[elem] = response[elem].date.slice(8, 10) + '.' + response[elem].date.slice(5, 7) + '.' + response[elem].date.slice(0, 4);
                    totalPrice[elem] = response[elem].totalPrice;
                    switch (response[elem].status) {
                        case 'not processed':
                            status[elem] = 'не обработан';
                            break;
                        case 'processed':
                            status[elem] = 'обработан';
                            break;
                        case 'shipped':
                            status[elem] = 'отправлен';
                            break;
                        case 'delivered':
                            status[elem] = 'доставлен';
                            break;
                        case 'cancelled':
                            status[elem] = 'отменен';
                            break;
                        default:
                            break;
                    }
                })
                console.log(dates);
                let quantity = {};
                Object.keys(response).forEach(elem => {
                    console.log(response[elem].quantity.slice(0, -1).split(','));
                    let productQuantity = {};
                    response[elem].quantity.slice(0, -1).split(',').forEach(product => {
                        productQuantity[product.slice(0, 6)] = product.slice(7);
                    })
                    quantity[elem] = productQuantity;
                })
                console.log(quantity);
                let names = {};
                Object.keys(response).forEach(elem => {
                    names[elem] = response[elem].names;
                })
                this.setState(() => {
                    return {
                        ids: Object.keys(response),
                        dates: dates,
                        quantity: quantity,
                        names: names,
                        totalPrice: totalPrice,
                        status: status,
                        isLoaded: true
                    }
                })
            })
    }

    showOrder = (elem) => {
        document.querySelector('#names-' + elem).classList.toggle('d-none');
    }

    render() {
        const { isLoaded, ids, dates, quantity, names, totalPrice, status } = this.state;
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
                <div className=" container " >
                    <h1>OrderHistory</h1>
                    {ids.map(elem => {
                        return (
                            <div className="order " key={elem}>
                                <div className="row" >
                                    <div className="col-2"><button className="btn btn-link" onClick={() => { this.showOrder(elem) }}><h6>{elem}</h6></button></div>
                                    <div className="col-2"><small className="my-auto">{dates[elem]}</small></div>
                                    <div className="col-2"><p className="my-aut">{totalPrice[elem] + ' р'}</p></div>
                                    <div className="col-2"><p className="my-aut">{status[elem]}</p></div>
                                </div>
                                <div className="border-top border-bottom d-none" id={'names-' + elem}>
                                    {Object.keys(names[elem]).map(e => {
                                        return (
                                            <div className="row" key={e}>
                                                <a href={'/product?' + e} className="ml-4">{names[elem][e]}</a>
                                                <p className="col-3">{quantity[elem][e]}</p>
                                            </div>
                                        )
                                    })}
                                </div>

                            </div>
                        )
                    })}
                </div>
            );
        }
    }
}

export default OrderHistory;
