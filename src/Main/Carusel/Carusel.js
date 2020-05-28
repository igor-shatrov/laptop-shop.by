import React from 'react';
import './Carusel.css';

class Carusel extends React.Component {
  render() {
    return (
      <div id="carouselExampleControls" className="carousel slide container mt-5" data-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <a href="/product"><img src="images/Carusel/q.png" className="d-block w-100" alt="..."></img></a>
          </div>
          <div className="carousel-item">
            <a href="/product"><img src="images/Carusel/860х200_Баннеры с игровыми ноутбуками (1).png" className="d-block w-100" alt="..."></img></a>
          </div>
        </div>
        <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="sr-only">Previous</span>
        </a>
        <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="sr-only">Next</span>
        </a>
      </div>
    );
  }
}

export default Carusel;
