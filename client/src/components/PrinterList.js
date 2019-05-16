import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { Pagination, PaginationItem, PaginationLink, Table } from 'reactstrap';
import { getItems } from '../actions/itemActions';
class PrinterList extends Component {
  componentDidMount = () => {
    this.props.getItems();
  };

  render() {
    const { items } = this.props.item;
    return (

      <div>
        <div>
          <Pagination aria-label="Page navigation example">
            <PaginationItem>
              <PaginationLink first href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink previous href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                1
          </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                2
          </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                3
          </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                4
          </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">
                5
          </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink next href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink last href="#" />
            </PaginationItem>
          </Pagination>
        </div>
        <Table>
          <thead>
            <tr>
              <th>Модель</th>
              <th>Серийный номер</th>
              <th>Дата</th>
              <th>Страницы</th>
              <th>Локация</th>
              <th>IP</th>
              <th>Филиал</th>
              <th>Стр. за неделю</th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ _id, model, ip, location, pages, serial, date, filial, diff }) => (
              <tr key={_id}>
                <td>{model}</td>
                <td>{serial}</td>
                <td>
                  <Moment format="DD.MM.YYYY">{date}</Moment>
                </td>
                <td>{pages}</td>
                <td>{location}</td>
                <td>
                  <a href={'http://' + ip}>{ip}</a>
                </td>
                <td>{filial}</td>
                <td>{diff}</td>
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
