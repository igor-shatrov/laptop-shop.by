import React from 'react';
import './Card.css';

class Card extends React.Component {

    render() {
        const { gCode, name, firstImage, price, shortInfo } = this.props;

        return (
            <div className="card mb-3 container" style={{ maxWidth: '540px' }}>
                <div className="row no-gutters">
                    <div className="col-md-4 mt-4">
                        <a href="/product"><img src={"images/product/" + firstImage} className="card-img" alt="..."></img></a>
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                            <a href="/product"><h5 className="card-title">{name}</h5></a>
                            <table>
                                <tbody>
                                    {Object.keys(shortInfo).map(keyName => {
                                        return (
                                            <tr key={keyName}>
                                                <td className="m-0 p-0"><small>{keyName}</small></td>
                                                <td className="m-0 p-0"><small>{this.props.shortInfo[keyName]}</small></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            <div className="row mt-3">
                                <p className="card-text col-6"><small className="text-muted">{gCode.slice(0, 3) + "." + gCode.slice(3)+" код товара"}</small></p>
                                <h6 className="card-text col-6">{price + ' р'}</h6>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Card;
