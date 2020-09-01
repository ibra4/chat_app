import React, { Component } from 'react'
import { db, auth } from "../../services/firebase"
import { get } from '../../services/providers';
import { allUsers } from '../../services/routes';
import Rooms from './Rooms';
import Loading from 'components/Loading/Loading';

export default class RoomsIndex extends Component {

    constructor(props) {
        super(props)

        this.state = {
            status: 'loading',
            data: []
        }
    }


    componentDidMount() {
        this.getData();
    }

    handleResponse(response, data) {
        switch (response.status) {
            case 200:
                this.setState({
                    data: data,
                    status: 'success'
                })
                break;
            default:
                this.setState({
                    status: 'error'
                })
        }
    }

    async getData() {
        const options = {
            route: allUsers
        }
        const response = await get(options);
        await response.json().then(data => {
            this.handleResponse(response, data);
        })
    }

    renderTemplate() {
        const status = this.state.status;
            switch (status) {
            case 'loading':
                return <Loading />
            case 'success':
                const props = {
                    data: this.state.data
                }
                return <Rooms props={props} />
            default:
                return "Opps... Something wents wrong, Please contact website administrator."
        }
    }

    render() {
        return this.renderTemplate();
    }
}
