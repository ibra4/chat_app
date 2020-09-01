import React from 'react'
import Loader from 'react-loader-spinner'
import { Row } from 'react-bootstrap'

function Loading({ height = 100, width = 100, small=false }) {
    return <Row className={`${small == false  && 'loader-container'} justify-content-center align-items-center`}>
        <Loader
            type="Puff"
            color="#00BFFF"
            height={height}
            width={width}
        />
    </Row>
}

export default Loading
