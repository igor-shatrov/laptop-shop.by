import React from 'react';

class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            usersInfo: [],
            statusFunction: '',
            isLoaded:false
        }
        
    }

componentDidMount(){
    this.showUserList();
}

    sendRequest(method, url, body = null) {
        return fetch(url, {
            method: method,
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.then(error => {
                    const e = new Error('Что-то пошло не так')
                    e.data = error;
                    throw e;
                })
            }
        })
    }

    showUserList = () => {
        let body = {
            function: 'list'
        }
        this.sendRequest('POST', 'http://api.laptop-shop.by/showUsers.php', body)
            .then(response => {
                this.setState({ usersInfo: response })
            })
    }

    resetUserPassword = (id) => {
        let body = {
            function: 'password reset',
            id: id
        }
        this.sendRequest('POST', 'http://api.laptop-shop.by/showUsers.php', body)
            .then(response => {
                if (response === "success") {
                    document.querySelector('#status-' + id).textContent = 'Пароль изменен и будет выслан на почту';
                    setTimeout(() => { document.querySelector('#status-' + id).textContent = '' }, 3000);
                } else {
                    document.querySelector('#status-' + id).textContent = 'Ошибка, попробуйте позднее';
                    setTimeout(() => { document.querySelector('#status-' + id).textContent = '' }, 3000);
                }
            })
    }

    deleteUser = (id) => {
        let body = {
            function: 'delete',
            id: id
        }
        this.sendRequest('POST', 'http://api.laptop-shop.by/showUsers.php', body)
            .then(response => {
                this.showUserList();
            })
    }

    makeUserAdmin = (id) => {
        let body = {
            function: 'make admin',
            id: id
        }
        this.sendRequest('POST', 'http://api.laptop-shop.by/showUsers.php', body)
            .then(response => {
                this.showUserList();
            })
    }

    makeUserUser = (id) => {
        let body = {
            function: 'make user',
            id: id
        }
        this.sendRequest('POST', 'http://api.laptop-shop.by/showUsers.php', body)
            .then(response => {
                this.showUserList();
            })
    }

    render() {
        return (
            <div className="user-list">
                <div className="container">
                    <div>
                        <table className="table table-hover mt-5">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">First name</th>
                                    <th scope="col">Last name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Privileges</th>
                                    <th scope="col">Function</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(this.state.usersInfo).map((keyName, i) => (
                                    <tr key={keyName}>
                                        <th scope="row">{keyName}</th>
                                        <td>{this.state.usersInfo[keyName].firstName}</td>
                                        <td>{this.state.usersInfo[keyName].lastName}</td>
                                        <td>{this.state.usersInfo[keyName].email}</td>
                                        <td>{this.state.usersInfo[keyName].privileges}</td>
                                        <td >
                                            <div className="row justify-content-md-center">
                                                <div className="dropdown p-1">
                                                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        <span className="material-icons">perm_identity</span>
                                                    </button>
                                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                        <button className="dropdown-item" onClick={() => this.makeUserAdmin(this.state.usersInfo[keyName].id)}>Сделать админом</button>
                                                        <button className="dropdown-item" onClick={() => this.makeUserUser(this.state.usersInfo[keyName].id)}>Сделать пользователем</button>
                                                        <button className="dropdown-item">Отмена</button>
                                                    </div>
                                                </div>
                                                <div className="dropdown p-1">
                                                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        <span className="material-icons function-icon" >create</span>
                                                    </button>
                                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                        <button className="dropdown-item" onClick={() => this.resetUserPassword(this.state.usersInfo[keyName].id)}>Сбросить пароль</button>
                                                        <button className="dropdown-item">Отмена</button>
                                                    </div>
                                                </div>
                                                <div className="dropdown p-1">
                                                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        <span className="material-icons function-icon">delete</span>
                                                    </button>
                                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                        <button className="dropdown-item" onClick={() => this.deleteUser(this.state.usersInfo[keyName].id)}>Удалить</button>
                                                        <button className="dropdown-item">Отмена</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="" id={'status-' + this.state.usersInfo[keyName].id}></p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>


                </div>

            </div >

        )
    }

}

export default UserList;