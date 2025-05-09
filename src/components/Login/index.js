import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({errorMsg, showSubmitError: true})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, showSubmitError, errorMsg} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <form className="form-container" onSubmit={this.submitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="login-website-logo"
          />
          <div className="card-container">
            <div className="user-container">
              <label className="input" htmlFor="username">
                USERNAME
              </label>
              <input
                className="input-user"
                type="text"
                id="username"
                value={username}
                onChange={this.onChangeUsername}
                placeholder="Username"
              />
            </div>

            <div className="password-container">
              <label className="input" htmlFor="password">
                PASSWORD
              </label>
              <input
                className="passoword-input-user"
                type="password"
                id="password"
                value={password}
                onChange={this.onChangePassword}
                placeholder="Password"
              />
            </div>
            <br />
            <button className="login-button" type="submit">
              Login
            </button>
            {showSubmitError && <p className="">*{errorMsg}</p>}
          </div>
        </form>
      </div>
    )
  }
}
export default Login
