import React, { Component } from 'react';
import Modal from 'react-modal';

class List extends React.Component {
  render() {
    return (
      <div>
        {this.props.items.map((x, i) => (
          <div key={i} onClick={this.props.onItemClick(i)}>
            <a href="javascript:void(0)">{x}</a>
          </div>))}
      </div>
    );
  }
}

class MultipleModals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listItemsIsOpen: false,
      currentItem: -1,
      loading: false,
      items: []
    };
  }

  toggleModal = event => {
    event.preventDefault();
    if (this.state.listItemsIsOpen) {
      this.handleModalCloseRequest();
      return;
    }
    this.setState({
      items: [],
      listItemsIsOpen: true,
      loading: true
    });
  }

  handleModalCloseRequest = () => {
    // opportunity to validate something and keep the modal open even if it
    // requested to be closed
    this.setState({
      listItemsIsOpen: false,
      loading: false
    });
  }

  handleOnAfterOpenModal = () => {
    // when ready, we can access the available refs.
    (new Promise((resolve, reject) => {
      setTimeout(() => resolve(true), 500);
    })).then(res => {
      this.setState({
        items: [1, 2, 3, 4, 5].map(x => `Item ${x}`),
        loading: false
      });
    });
  }

  onItemClick = index => event => {
    this.setState({ currentItem: index });
  }

  cleanCurrentItem = () => {
    this.setState({ currentItem: -1 });
  }

  render() {
    const { listItemsIsOpen } = this.state;
    return (
      <div>
        <button type="button" className="btn btn-primary" onClick={this.toggleModal}>Open Modal A</button>
        <Modal
          id="test"
          closeTimeoutMS={150}
          contentLabel="modalA"
          isOpen={listItemsIsOpen}
          onAfterOpen={this.handleOnAfterOpenModal}
          onRequestClose={this.toggleModal}>
          <h1>List of items</h1>
          {this.state.loading ? (
            <p>Loading...</p>
          ) : (
            <List onItemClick={this.onItemClick} items={this.state.items} />
          )}
        </Modal>
        <Modal
          id="test2"
          closeTimeoutMS={150}
          contentLabel="modalB"
          isOpen={this.state.currentItem > -1}
          onRequestClose={this.cleanCurrentItem}
          aria={{
            labelledby: "item_title",
            describedby: "item_info"
          }}>
          <h1 id="item_title">Item: {this.state.items[this.state.currentItem]}</h1>
          <div id="item_info">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur pulvinar varius auctor. Aliquam maximus et justo ut faucibus. Nullam sit amet urna molestie turpis bibendum accumsan a id sem. Proin ullamcorper nisl sapien, gravida dictum nibh congue vel. Vivamus convallis dolor vitae ipsum ultricies, vitae pulvinar justo tincidunt. Maecenas a nunc elit. Phasellus fermentum, tellus ut consectetur scelerisque, eros nunc lacinia eros, aliquet efficitur tellus arcu a nibh. Praesent quis consequat nulla. Etiam dapibus ac sem vel efficitur. Nunc faucibus efficitur leo vitae vulputate. Nunc at quam vitae felis pretium vehicula vel eu quam. Quisque sapien mauris, condimentum eget dictum ut, congue id dolor. Donec vitae varius orci, eu faucibus turpis. Morbi eleifend orci non urna bibendum, ac scelerisque augue efficitur.</p>

            <p>Maecenas justo justo, laoreet vitae odio quis, lacinia porttitor arcu. Nunc nisl est, ultricies sed laoreet eu, semper in nisi. Phasellus lacinia porta purus, eu luctus neque. Nullam quis mi malesuada, vestibulum sem id, rhoncus purus. Aliquam erat volutpat. Duis nec turpis mi. Pellentesque eleifend nisl sed risus aliquet, eu feugiat elit auctor. Suspendisse ac neque vitae ligula consequat aliquam. Vivamus sit amet eros et ante mollis porta.</p>
          </div>
        </Modal>
      </div>
    );
  }
}

export default {
  label: "Working with many modal.",
  app: MultipleModals
};
