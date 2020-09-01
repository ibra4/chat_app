import React, { Component } from "react";
import { auth } from "../services/firebase";
import { db, storage } from "../services/firebase"
import { connect } from 'react-redux';
import { Row, Form, Container, Button } from 'react-bootstrap'
import TextArea from "components/TextArea/TextArea";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import Loading from 'components/Loading/Loading';
import DOC from '../assets/images/docx.png'
import PDF from '../assets/images/pdf.png'
import TXT from '../assets/images/txt.png'
import XLS from '../assets/images/xls.png'

// 20 MB
const maxAllowedSize = 30000000

const allowedFileTypes = {
    video: ['flv', 'webm', 'avi', 'ogg', 'mp4', 'wmv'],
    image: ['png', 'jpg', 'jpeg', 'gif'],
    doc: ['doc', 'docx', 'xls', 'xlsx', 'pdf', 'txt', 'csv']
}

const getDocIcon = (ext) => {
    switch (ext) {
        case 'doc':
        case 'docx':
            return <img src={DOC} />;
        case 'xls':
        case 'xlsx':
            return <img src={XLS} />
        case 'pdf':
            return <img src={PDF} />;
        case 'txt':
            return <img src={TXT} />;
    }
}

const getFileType = (ext) => {
    let type = null;
    Object.keys(allowedFileTypes).map(item => {
        if (allowedFileTypes[item].includes(ext)) {
            type = item
        }
    })
    return type
}

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            chats: [],
            content: '',
            readError: null,
            writeError: null,
            status: 'loading',
            fileLoading: false
        };
        this.myRef = React.createRef()
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {

        await this.setState({
            user: auth().currentUser,
        });
        this.setState({ readError: null });
        this.setState({
            status: 'success'
        })
        try {
            db.ref("chats/" + this.props.url).on("value", snapshot => {
                let chats = [];
                snapshot.forEach((snap) => {
                    chats.push(snap.val());
                });
                this.setState({ chats });
                if (this.props.currentChatUser) {
                    this.scrollToMyRef();
                }
            });
        } catch (error) {
            this.setState({ readError: error.message });
        }
    }

    handleChange(event) {
        this.setState({
            content: event.target.value
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        this.setState({ writeError: null });
        let userText = this.state.content.replace(/^\s+/, '').replace(/\s+$/, '');
        if (userText != "") {
            try {
                await db.ref("chats/" + this.props.url).push({
                    content: this.state.content,
                    timestamp: Date.now(),
                    type: 'text',
                    from: this.props.user.id,
                    uid: this.props.user.email
                });
                this.setState({ content: '' });
                this.props.addNotification(this.props.currentChatUser.id)
            } catch (error) {
                this.setState({ writeError: error.message });
            }
            this.scrollToMyRef();
        }
    }

    async handleSendFile(fileUrl, type, extension, fileName) {
        this.setState({ writeError: null });
        try {
            await db.ref("chats/" + this.props.url).push({
                content: fileUrl,
                timestamp: Date.now(),
                type: type,
                fileExtension: extension,
                fileName: fileName,
                from: this.props.user.id,
                uid: this.props.user.email
            });
            this.setState({
                fileLoading: false
            })
            this.props.addNotification(this.props.currentChatUser.id)
            this.scrollToMyRef(600);
        } catch (error) {
            this.setState({ writeError: error.message });
        }
    }

    handleFireBaseUpload(e) {
        this.setState({
            fileLoading: true
        })
        let error = false;
        const file = e.target.files[0]
        let parts = file.name.split('.');
        const extension = parts[parts.length - 1].toLowerCase();
        const size = file.size;
        if (size > maxAllowedSize) {
            error = true;
            alert("Max upload size : 20MB");
            this.setState({
                fileLoading: false
            })
        }
        const type = getFileType(extension);
        if (!type || type == null) {
            error = true;
            alert("Extension not allowed");
            this.setState({
                fileLoading: false
            })
        }
        if (file === '') {
            // console.error(`not an file, the file file is a ${typeof (file)}`)
        }
        if (error == false) {
            const uploadTask = storage.ref(`/files/${type}/${file.name}`).put(file)
            uploadTask.on('state_changed',
                (snapShot) => {
                    // console.log(snapShot)
                }, (err) => {
                    // console.log(err)
                }, () => {
                    storage.ref(`files/${type}`).child(file.name).getDownloadURL()
                        .then(fireBaseUrl => {
                            this.handleSendFile(fireBaseUrl, type, extension, file.name)
                        })
                })
        }
    }

    scrollToMyRef(amount = 300) {
        this.myRef.current.scrollTop = this.myRef.current.scrollHeight + amount
    }

    renderChatMessage(chat) {
        // console.log("chat : ", chat)
        switch (chat.type) {
            case 'text':
                return chat.content;
            case 'video':
                return <video controls>
                    <source src={chat.content} type={`video/${chat.fileExtension}`}></source>
                </video>
            case 'image':
                return <a target="_blank" href={chat.content} className={`media-container ${chat.type}`}>
                    <img src={chat.content} />
                </a>
            case 'doc':
                return <a target="_blank" href={chat.content} className={`media-container ${chat.type}`}>
                    <div className="icon-image-container m-auto">{getDocIcon(chat.fileExtension)}</div>
                    <div className="color-white download-text">
                        <span className="download-text">{chat.fileName}</span>
                        <FontAwesomeIcon icon={faDownload} />
                    </div>
                </a>
            default: return 'text'
        }

    }

    handleKeyPress(e) {
        if (e.keyCode == 13 && e.shiftKey == false) {
            e.preventDefault();
            this.handleSubmit(e)
        }
    }
    
    render() {
        return this.state.status == 'success' && this.props.url != null ? (
            <Container fluid={true} className="h-100 d-flex flex-column justify-content-between" onClick={() => this.props.openNotification(this.props.currentChatUser.id)}>
                <Row className="flex-start align-items-center chat-header border-bottom p-2">
                    <div className="user-image">
                        <img src={this.props.currentChatUser.profile.image ? this.props.currentChatUser.profile.image : "https://simpleicon.com/wp-content/uploads/user1.png"} className={`${this.props.currentChatUser.profile.image && 'fit-image'}`} />
                    </div>
                    <div className="ml-3">{this.props.currentChatUser.email}</div>
                </Row>
                <div className="chat-container px-2" id="chat-container" ref={this.myRef}>
                    {this.state.chats.map(chat => {
                        return <div key={chat.timestamp} className={`chat-message ${chat.from === this.props.user.id ? "from_me" : "from_him"}`}>
                            <span>
                                {this.renderChatMessage(chat)}
                            </span>
                        </div>
                    })}
                </div>
                <Form onSubmit={this.handleSubmit} className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Group className="w-100 m-0">
                        <TextArea onChange={this.handleChange} value={this.state.content} onKeyDown={e => this.handleKeyPress(e)} />
                    </Form.Group>
                    <div className="file-container">
                        {this.state.fileLoading ? <Loading height="20" width="20" small={true} /> : <FontAwesomeIcon icon={faImage} />}
                        <input type="file" onChange={e => this.handleFireBaseUpload(e)} />
                    </div>
                    <Button variant="link" type="submit">
                        <FontAwesomeIcon icon={faPaperPlane} />
                    </Button>
                </Form>
            </Container>
        ) : <div className="d-flex justify-content-center align-items-center h-100">
                <h1 className="text-muted">Select a user</h1>
            </div>;
    }
}

function mapStateToProps(state) {
    return {
        user: state.user.user
    }
}

export default connect(mapStateToProps)(Chat)