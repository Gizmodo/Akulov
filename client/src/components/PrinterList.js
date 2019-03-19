import PropTypes from 'prop-types';
import React, { Component } from 'react';
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
            </tr>
          </thead>
          <tbody>
            {items.map(({ _id, model, ip, location, pages }) => (
              <tr key={_id}>
                <td>{model}</td>
                <td>{pages}</td>
                <td>
                  <a href={'http://' + ip}>{ip}</a>
                </td>
                <td>{location}</td>
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
