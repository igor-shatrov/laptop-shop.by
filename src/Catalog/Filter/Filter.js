import React from 'react';


class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      producer: [],
      isLoaded: false
    }
  }

  componentDidMount() {
    this.showFilter();
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

  showFilter = () => {
    let body = {
      action: 'show'
    }
    this.sendRequest('post', 'http://api.laptop-shop.by/filter.php', body)
      .then(response => {

        this.setState({
          producer: response.producer,
          smallestPrice: response.smallestPrice,
          largestPrice: response.largestPrice,
          isLoaded: true
        });
        console.log(this.state);
        console.log(window.location.search.slice(1));
      let search =window.location.search.slice(1).split('&');
      console.log(search);
      search.forEach(elem=>{
        if(elem.includes('producer')){
          console.log('#'+elem.slice(9));
          document.querySelector('#'+elem.slice(9)).checked=true;          
        }
        if(elem.includes('minPrice')){
          console.log(elem.slice(9));
          document.querySelector('#minPrice').value=elem.slice(9);
        }
        if(elem.includes('maxPrice')){
          console.log(elem.slice(9));
          document.querySelector('#maxPrice').value=elem.slice(9);
        }
      })
      })
      
      

      
  }

  filter = () => {
    let data = '';
    if (document.querySelector('#minPrice').value) {
      data = data + 'minPrice=' + document.querySelector('#minPrice').value + '&';
    }
    if (document.querySelector('#maxPrice').value) {
      data = data + 'maxPrice=' + document.querySelector('#maxPrice').value + '&';
    }
    document.querySelectorAll('.producer').forEach(elem => {
      if (elem.checked) {
        console.log(elem.value);
        data = data + 'producer=' + elem.value + '&';
      }
    })
    window.location.href = '/catalog?' + data;
  }

  render() {
    const { isLoaded } = this.state;
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
        <div className="filter mt-3">
          <div className="price m-3">
            <label htmlFor="price">Ценовой диапазон</label>
            <div className="row">
              <div className="col-5 p-0">от<input className="w-75 ml-1" id='minPrice' type="number" name="price[from]" placeholder={this.state.smallestPrice}></input></div>
              <div className="col-5 p-0">до<input className="w-75 ml-1" id='maxPrice' type="number" name="price[to]" placeholder={this.state.largestPrice}></input></div>
            </div>
          </div>
          <div className="producer m-3">
            <label htmlFor="price">Производитель</label>
            {this.state.producer.map(elem => {
              return (
                <div key={elem} className="overflow-auto">
                  <input className="form-check-input producer" type="checkbox" value={elem} id={elem} />
                  <label className="form-check-label" htmlFor={elem}>{elem}</label>
                </div>
              )
            })}


          </div>
          <div className="submit mt-4 text-right">
            <button type="button" className="btn btn-success" onClick={this.filter}>Показать товары</button>
          </div>
        </div>



      );
    }
  }
}

export default Filter;