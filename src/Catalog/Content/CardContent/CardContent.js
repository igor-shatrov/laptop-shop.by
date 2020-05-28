import React from 'react';



class CardContent extends React.Component {

    putInCart = () => {
        document.cookie.split('; ').forEach(elem => {
            if (elem.includes('laptopProductGCode') && elem.includes(this.props.gCode)) {
            } else if (elem.includes('laptopProductGCode')) {
                let text = elem.slice(19) + '&' + this.props.gCode;
                document.cookie = `laptopProductGCode=${text}; max-age=${3600 * 24 * 14}`;
            } else {
                document.cookie = `laptopProductGCode=${this.props.gCode}; max-age=${3600 * 24 * 14}`;
            }
        })
    }

    render() {
        return (
            <div className="card-content mt-3">
                <div className="card mb-3 container" style={{ maxWidth: '900px' }}>
                    <div className="row no-gutters">
                        <div className="col-md-3">
                            <a href={"/product?" + this.props.gCode}><img src={this.props.firstImage} className="card-img mt-4" alt="..."></img></a>
                        </div>
                        <div className="col-md-6">
                            <div className="card-body">
                                <a href={"/product?" + this.props.gCode}><h5 className="card-title">{this.props.name}</h5></a>
                                <table>
                                    <tbody>
                                        {Object.keys(this.props.shortInfo).map(keyName => {
                                            return (
                                                <tr key={keyName}>
                                                    <td className="m-0"><small>{keyName}</small></td>
                                                    <td className="m-0"><small>{this.props.shortInfo[keyName]}</small></td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card-body">
                                <h6 className="card-text mb-3">{this.props.gCode}</h6>
                                <h5 className="card-title">{this.props.price + " руб"}</h5>
                                <p className="card-text"><span className="material-icons  align-middle mr-1">check_circle</span>В наличии</p>
                                <button type="button" className="btn btn-dark" onClick={this.putInCart}>В корзину</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CardContent;