import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';
import { getItems } from '../actions/itemActions';
class PrinterList extends Component {
  componentDidMount = () => {
    this.props.getItems();
  };

  render() {
    const { items } = this.props.item;
    return (
      <div>
        <Table>
          <thead>
            <tr>
              <th>Модель</th>
              <th>Страницы</th>
              <th>IP</th>
              <th>Локация</th>
              <th>Серийный номер</th>
              <th>Филиал</th>
              <th>Дата</th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ _id, model, ip, location, pages, serial, date, filial }) => (
              <tr key={_id}>
                <td>{model}</td>
                <td>{pages}</td>
                <td>
                  <a href={'http://' + ip}>{ip}</a>
                </td>
                <td>{location}</td>
                <td>{serial}</td>
                <td>{filial}</td>
                <td>
                  <Moment format="DD.MM.YYYY">{date}</Moment>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}

PrinterList.propTypes = {
  getItems: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  item: state.item
});
export default connect(
  mapStateToProps,
  { getItems }
)(PrinterList);
