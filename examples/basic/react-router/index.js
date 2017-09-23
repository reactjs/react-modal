import PropTypes from 'prop-types';
import React, { Component } from 'react';
import createHistory from 'history/createBrowserHistory';
import { Router, Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';

const history = createHistory();

const Content = label => () => <p>{`Content ${label}`}</p>;

const shouldOpenModal = locationPath => /\bmodal\b/.test(locationPath);

const ReactRouterModal = props => (
  <Modal
    isOpen={shouldOpenModal(props.location.pathname)}
    onRequestClose={() => history.push("/basic")}>
    <div>
      <Link to="/basic/modal/a">Link A</Link><br />
      <Link to="/basic/modal/b">Link B</Link>
      <div>
        <Switch location={props.location}>
          <Route path="/basic/modal/a" component={Content('A')} />
          <Route path="/basic/modal/b" component={Content('B')} />
        </Switch>
      </div>
    </div>
  </Modal>
);

class App extends Component {
  render() {
    return (
      <Router history={history}>
        <div>
          <Link to="/basic/modal" className="btn btn-primary">Modal</Link>
          <Route path="/basic/modal" component={ReactRouterModal} />
        </div>
      </Router>
    );
  }
}

export default {
  label: "#3. react-modal and react-router.",
  app: App
};
