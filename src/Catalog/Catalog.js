import React from 'react';
import Filter from './Filter/Filter';
import Content from './Content/Content';


class Catalog extends React.Component {
  render() {
    return (
      <div className="container">
      <div className="row">
          <div className="col-3"><Filter/></div>
          <div className="col-9"><Content/></div>
      </div>
  </div>
      
    );
  }
}

export default Catalog;