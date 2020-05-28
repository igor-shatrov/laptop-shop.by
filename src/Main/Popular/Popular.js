import React from 'react';
import './Popular.css';
import Card from '../Card/Card';

class Popular extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        }
    }

    componentDidMount() {
        this.showPopularProduct();
    }

    showPopularProduct = () => {
        this.sendRequest('POST', 'http://api.laptop-shop.by/showPopularProducts.php')
            .then(response => {
                let gCodes = {};
                let names = {};
                let firstImages = {};
                let prices = {};
                let shortInfos = {};
                Object.keys(response).forEach(elem => {
                    gCodes[elem] = response[elem].gCode;
                    names[elem] = response[elem].name;
                    firstImages[elem] = response[elem].firstImage;
                    prices[elem] = response[elem].price;
                    shortInfos[elem] = {};
                    response[elem].shortInfo.split(',').forEach(e => {
                        shortInfos[elem][e.slice(0, e.indexOf(':'))] = e.slice(e.indexOf(':')+1);
                    })
                })
                this.setState(() => {
                    return {
                        gCodes: gCodes,
                        names: names,
                        firstImages: firstImages,
                        prices: prices,
                        shortInfos: shortInfos,
                        isLoaded: true
                    }
                })
            })
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
                    const e = new Error('Что-то пошло не так');
                    e.data = error;
                    throw e;
                })
            }
        })
    }

    render() {
        const { isLoaded, gCodes, names, firstImages, prices, shortInfos } = this.state;
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
                <div className="container">
                    <h2 className="text-center mt-5 mb-5">Популярные товары</h2>
                    <div className="row">
                        {Object.keys(gCodes).map(elem => {
                            return (
                                <Card className="col-6" key={gCodes[elem]} gCode={gCodes[elem]} name={names[elem]} firstImage={firstImages[elem]} price={prices[elem]} shortInfo={shortInfos[elem]} />
                            )
                        })}
                    </div>
                </div>
            );
        }
    }
}

export default Popular;
