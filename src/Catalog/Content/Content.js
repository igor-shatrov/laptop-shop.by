import React from 'react';
import CardContent from './CardContent/CardContent';


class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ids: [],
            names: {},
            shortInfos: {},
            firstImages: {},
            gCodes: {},
            prices: {},
            isLoaded: false
        }
    }

    componentDidMount() {
        this.showCatalog();
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

    showCatalog = () => {
        let body = {};
        let arrayOptions = window.location.search.slice(1).split('&');
        let minPrice = "";
        let maxPrice = "";
        let arrayProducers = [];
        arrayOptions.forEach(elem => {
            if (elem.includes('producer')) {
                arrayProducers.push(elem.slice(9));
            } else if (elem.includes('minPrice')) {
                minPrice = elem.slice(9);
            } else if (elem.includes('maxPrice')) {
                maxPrice = elem.slice(9);
            }
        })
        if (arrayProducers[0]) {
            body.producer = arrayProducers;
        }
        if (minPrice !== '') {
            body.minPrice = minPrice;
        }
        if (maxPrice !== '') {
            body.maxPrice = maxPrice;
        }
        console.log(body);

        this.sendRequest('POST', "http://api.laptop-shop.by/showCatalog.php", body)
            .then(response => {
                let ids = [];
                let names = {};
                let shortInfos = {};
                let firstImages = {};
                let gCodes = {};
                let prices = {};
                Object.keys(response).forEach(key => {
                    ids.push(key);
                    names[key] = response[key].name;
                    firstImages[key] = response[key].firstImage;
                    gCodes[key] = response[key].gCode;
                    prices[key] = response[key].price;
                    shortInfos[key] = response[key].shortInfo.split(', ');
                })
                Object.keys(shortInfos).forEach(key => {
                    let info = {};
                    shortInfos[key].forEach(elem => {
                        info[elem.slice(0, elem.indexOf(':'))] = elem.slice(elem.indexOf(":") + 1);
                    })
                    shortInfos[key] = info;
                })
                this.setState((state) => {
                    return {
                        ids: ids,
                        names: names,
                        shortInfos: shortInfos,
                        firstImages: firstImages,
                        gCodes: gCodes,
                        prices: prices,
                        isLoaded: true
                    }
                });
            })
    }

    render() {
        const { isLoaded, ids, names, shortInfos, firstImages, gCodes, prices } = this.state;
        if (!isLoaded) {
            return (
                <div className="text-center mt-5">
                    <div className="spinner-grow" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )
        } else if(ids.length===0){
            return (
                <div className="container">
                    <h5>Извините, по вашему запросу ничего не найдено</h5>
                </div>
            )
        }else {
            return (
                <div className="container">{ids.map(id => {
                    return <CardContent key={id} id={id} name={names[id]} shortInfo={shortInfos[id]} firstImage={'/images/product/' + firstImages[id]} gCode={gCodes[id]} price={prices[id]} />
                })}</div>
            )
        }
    }
}

export default Content;