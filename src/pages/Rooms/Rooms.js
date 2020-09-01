import React, { useEffect, useState } from 'react'
import { Col, Row, Container } from 'react-bootstrap'
import { useHistory, Link, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { db } from "../../services/firebase"

import Loading from 'components/Loading/Loading';
import Chat from 'pages/Chat'

function Rooms({ props }) {

    const history = useHistory();

    const currentUser = useSelector(state => state.user.user)

    const [currentChat, setCurrentChat] = useState(null)

    const [currentChatUser, setCurrentChatUser] = useState(null)

    const [notifications, setNotifications] = useState(null)
    const [status, setStatus] = useState("loading")

    useEffect(() => {
        db.ref("notifications/" + currentUser.id).on("value", snapshot => {
            let notifications = [];
            snapshot.forEach((snap) => {
                notifications.push(snap.val());
            });
            setNotifications(notifications)
            setStatus("success")
        });
    }, [])

    useEffect(() => {
        // console.log("notifications : ", notifications)
    }, [notifications])


    const createChatroom = async (id) => {
        var ref = db.ref("rooms/" + id + '/' + currentUser.id);
        ref.set({
            chat_url: id + '_' + currentUser.id,
            from: currentUser.id
        });
    }

    const openNotification = (id) => {
        // console.log("Opening")
        var ref = db.ref("notifications/" + currentUser.id + '/' + id);
        ref.update({ opened: true, from: id })
    }

    const addNotification = (id) => {
        // console.log("Adding")
        var ref = db.ref("notifications/" + id + '/' + currentUser.id);
        ref.update({ opened: false, from: currentUser.id })
    }

    const handleChatCreate = user => {
        setCurrentChatUser(user);
        var ref = db.ref("rooms/" + currentUser.id + '/' + user.id);
        ref.on('value', (snapshot) => {
            if (snapshot.exists()) {
                const chat = snapshot.child('chat_url').val()
                openNotification(user.id);
                setCurrentChat(chat);
            } else {
                createChatroom(user.id)
                openNotification(user.id);
                setCurrentChat(`${user.id}_${currentUser.id}`);
            }
        })
    }

    const renderUser = (user) => {
        return user.id != currentUser.id && (
            <Col md={12}
                onClick={() => handleChatCreate(user)} key={user.id} id={user.id}
                className={`d-flex flex-start align-items-center justify-content-between p-3 user-item ${currentChatUser && currentChatUser.id === user.id && 'active'}`}>
                <div className="d-flex flex-start align-items-center w-100">
                    <div className="user-item-image">
                        <img src={user.profile.image ? user.profile.image : "https://simpleicon.com/wp-content/uploads/user1.png"} className={`${user.profile.image && 'fit-image'}`} />
                    </div>
                    <div className="ml-2 user-email">{user.email}</div>
                </div>
                    {notifications.filter(item => item.from == user.id).map(not => (
                        !not.opened && <div class="bluedot"></div>
                    ))}
            </Col>
        )
    }

    return (status === 'success') ? (
        <Container fluid={true} className="my-2">
            <Row>
                <Col md={4} className="border-right px-0">
                    <div className="h-100 users-container">
                        {props.data.map(user => renderUser(user))}
                    </div>
                </Col>
                <Col md={8} className="px-0 chat-section">
                    <Chat url={currentChat}
                        key={currentChat}
                        currentChatUser={currentChatUser}
                        openNotification={openNotification}
                        addNotification={addNotification} />
                </Col>
            </Row>
        </Container>
    ) : <Loading />

}

export default Rooms
