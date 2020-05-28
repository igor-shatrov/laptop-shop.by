import React from 'react';
import "./Product.css";

class Product extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            gCode: '',
            model: '',
            producerName: '',
            processor: {},
            ddr: {},
            screen: {},
            image: [],
            price: '',
            other: {},
            isLoaded: false
        }
    }

    componentDidMount() {
        this.showInfo();
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

    convertData = (string) => {
        let array = string.split(', ');
        let assocArray = {};
        array.forEach(elem => {
            assocArray[elem.slice(0, elem.indexOf(':'))] = elem.slice(elem.indexOf(":") + 1);
        })
        return assocArray;
    }

    showInfo = () => {
        let body = {
            gCode: window.location.search.slice(1)
        }
        this.sendRequest('POST', 'http://api.laptop-shop.by/product.php', body)
            .then(response => {
                this.setState(() => {
                    return {
                        id: response.id,
                        name: response.name,
                        gCode: response.gCode,
                        model: response.model,
                        producerName: response.producerName,
                        processor: this.convertData(response.processor),
                        ddr: this.convertData(response.processor),
                        screen: this.convertData(response.processor),
                        image: response.image.split(', '),
                        price: response.price,
                        other: {},
                        isLoaded: true
                    }
                })
            })
    }

    slider = (e) => {
        document.querySelectorAll('.img-fluid').forEach(elem => {
            elem.classList.remove('selected');
        })
        e.target.classList.toggle('selected');
        document.querySelector('#big-image').src = e.target.src;
    }

    putInCart = () => {
        document.cookie.split('; ').forEach(elem => {
            if (elem.includes('laptopProductGCode') && elem.includes(this.props.gCode)) {
            } else if (elem.includes('laptopProductGCode')) {
                let text = elem.slice(19) + '&' + this.state.gCode;
                document.cookie = `laptopProductGCode=${text}; max-age=${3600 * 24 * 14}`;
            } else {
                document.cookie = `laptopProductGCode=${this.state.gCode}; max-age=${3600 * 24 * 14}`;
            }
        })
    }

    render() {
        const { isLoaded, name, model, producerName, price, processor, ddr, screen, image } = this.state;
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
                <div className="product">
                    <div className="container">
                        <h1 className="m-5">{name}</h1>
                        <div className="row">
                            <div className="photo-slider-wrapper col-8">
                                <div className="product-image mb-5">
                                    <img className="" id="big-image" src={"/images/product/" + image[0]} alt="" />
                                </div>
                                <div className="photo-slider row ">
                                    {image.map((elem, index) => {
                                        return (<div className="photo m-1" key={index} style={{ width: "100px", height: "100px" }}><img className="img-fluid" id={"image-" + index} onClick={(e) => this.slider(e)} src={"/images/product/" + elem} alt="" /></div>)
                                    })}
                                </div>
                            </div>
                            <div className="col-4 row">
                                <div className="col-3"></div>
                                <div className="col-9">
                                    <div className="card-body">
                                        <h5 className="card-title m-3 mb-4">{this.state.gCode.slice(0,3)+'.'+this.state.gCode.slice(3)}<small> код товара</small></h5>
                                        <h3 className="card-title m-3 mb-4">{price} руб</h3>
                                        <p className="card-text m-3"><span className="material-icons  align-middle mr-1">check_circle</span>В наличии</p>
                                        <button type="button" className="btn btn-dark m-3" onClick={this.putInCart}>В корзину</button>
                                    </div>
                                </div>
                            </div>
                            <div className="attrs container">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>Производитель</td>
                                            <td className="m-0 pl-3">{producerName}</td>
                                        </tr>
                                        <tr>
                                            <td>Модель</td>
                                            <td className="m-0 pl-3">{model}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h3 className="p-3">Дисплей</h3>
                                            </td>
                                        </tr>
                                        {Object.keys(screen).map(keyName => {
                                            return (
                                                <tr key={keyName}>
                                                    <td className="m-0">{keyName}</td>
                                                    <td className="m-0 pl-3">{screen[keyName]}</td>
                                                </tr>
                                            )
                                        })}
                                        <tr>
                                            <td>
                                                <h3 className="p-3">Процессор</h3>
                                            </td>
                                        </tr>
                                        {Object.keys(processor).map(keyName => {
                                            return (
                                                <tr key={keyName}>
                                                    <td className="m-0">{keyName}</td>
                                                    <td className="m-0 pl-3">{processor[keyName]}</td>
                                                </tr>
                                            )
                                        })}
                                        <tr>
                                            <td>
                                                <h3 className="p-3">Оперативная память</h3>
                                            </td>
                                        </tr>
                                        {Object.keys(ddr).map(keyName => {
                                            return (
                                                <tr key={keyName}>
                                                    <td className="m-0">{keyName}</td>
                                                    <td className="m-0 pl-3">{ddr[keyName]}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            );
        }
    }
}

export default Product;
