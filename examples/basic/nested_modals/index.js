import React, { Component } from 'react';
import Modal from 'react-modal';

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  toggleModal = index => event => {
    console.log("NESTED MODAL ITEM", event);
    this.setState({
      itemNumber: !this.state.isOpen ? index : null,
      isOpen: !this.state.isOpen
    });
  };

  render() {
    const { isOpen, itemNumber } = this.state;
    const { number, index } = this.props;

    const toggleModal = this.toggleModal(index);

    return (
      <div key={index} onClick={toggleModal}>
        <a href="javascript:void(0)">{number}</a>
        <Modal closeTimeoutMS={150}
               contentLabel="modalB"
               isOpen={isOpen}
               onRequestClose={toggleModal}
               aria={{
                 labelledby: "item_title",
                 describedby: "item_info"
               }}>
          <h1 id="item_title">Item: {itemNumber}</h1>
          <div id="item_info">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur pulvinar varius auctor. Aliquam maximus et justo ut faucibus. Nullam sit amet urna molestie turpis bibendum accumsan a id sem. Proin ullamcorper nisl sapien, gravida dictum nibh congue vel. Vivamus convallis dolor vitae ipsum ultricies, vitae pulvinar justo tincidunt. Maecenas a nunc elit. Phasellus fermentum, tellus ut consectetur scelerisque, eros nunc lacinia eros, aliquet efficitur tellus arcu a nibh. Praesent quis consequat nulla. Etiam dapibus ac sem vel efficitur. Nunc faucibus efficitur leo vitae vulputate. Nunc at quam vitae felis pretium vehicula vel eu quam. Quisque sapien mauris, condimentum eget dictum ut, congue id dolor. Donec vitae varius orci, eu faucibus turpis. Morbi eleifend orci non urna bibendum, ac scelerisque augue efficitur.</p>
          </div>
        </Modal>
      </div>
    );
  }
}

class List extends Component {
  render() {
    return this.props.items.map((n, index) => (
      <Item key={index} index={index} number={n} />
    ));
  }
}


class NestedModals extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      currentItem: -1,
      loading: false,
      items: []
    };
  }

  toggleModal = event => {
    event.preventDefault();
    console.log("NESTEDMODAL", event);
    this.setState({
      items: [],
      isOpen: !this.state.isOpen,
      loading: true
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

  render() {
    const { isOpen } = this.state;
    return (
      <div>
        <button type="button" className="btn btn-primary" onClick={this.toggleModal}>Open Modal A</button>
        <Modal
          id="test"
          closeTimeoutMS={150}
          contentLabel="modalA"
          isOpen={isOpen}
          onAfterOpen={this.handleOnAfterOpenModal}
          onRequestClose={this.toggleModal}>
          <h1>List of items</h1>
          {this.state.loading ? (
            <p>Loading...</p>
          ) : (
            <List items={this.state.items} />
          )}
        </Modal>
      </div>
    );
  }
}

export default {
  label: "Working with nested modals.",
  app: NestedModals
};
