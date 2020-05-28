import React from 'react';

class Card extends React.Component {

    render() {
        return (
            <div className=" container " >
                <div className="row no-gutters align-items-center">
                    <div className="col-md-4" style={{ maxWidth:'150px'}}>
                        <a href={"/product?" + this.props.gCode}><img src={"images/product/" + this.props.image} className="card-img" alt="..."></img></a>
                    </div>
                    <div className="col-md-6">
                        <div className="card-body">
                            <a href={"/product?" + this.props.gCode}><h5 className="card-title">{this.props.name}</h5></a>
                        </div>
                    </div>
                    <div className="col-mb-2">
                        <p className="card-text">{this.props.price} руб</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Card;
