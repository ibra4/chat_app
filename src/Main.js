import React, { Component } from 'react'

import { auth, db } from './services/firebase'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";

import Chat from './pages/Chat';
import Home from './pages/Home';
import RoomsIndex from './pages/Rooms/RoomsIndex';

import Layout from './components/Layout/default'

import { get } from './services/providers'
import { currentUser } from './services/routes';
import { connect } from 'react-redux';
import { setUser } from 'actions';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/styles.css'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

class Main extends Component {

  constructor(props) {
    super(props)

    this.state = {
      user: null,
      status: 'loading'
    }
  }

  async signInUser() {
    await auth().signInAnonymously()
  }

  async getCurrentUser() {
    const options = {
      route: currentUser
    }
    const response = await get(options);
    await response.json().then(data => this.props.setUser(data))
  }

  async componentDidMount() {

    this.getCurrentUser();

    await this.signInUser();
    auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authenticated: true,
          status: 'success'
        });
      } else {
        this.setState({
          authenticated: false,
        });
      }
    })
  }

  render() {
    return this.state.status === 'success' && (
      <Router>
        <Layout>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/chat/rooms" exact component={RoomsIndex} />
            <Route path="/chat/chatroom/:id" exact component={Chat} />
          </Switch>
        </Layout>
      </Router>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.user,
    loggedIn: state.user.loggedIn
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setUser: user => dispatch(setUser(user))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)
