﻿import { getSignalRConnection, storeSignalRConnection } from '../helpers/signalRHelper';
import { UserIsValid, TryGetToken } from '../helpers/authHelper';
import { withRouter, Link, Redirect } from 'react-router-dom';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import config from '../config.json';
import Cookies from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

class JoinTheFun extends Component {
	static displayName = JoinTheFun.name;

	constructor(props) {
		super(props);
		this.state = {
			inputName: '',
			nameValidationError: '',
			status: 0,
		};
		this.checkForm = this.checkForm.bind(this);
		this.postForm = this.postForm.bind(this);
	}

	checkForm(event) {
		event.preventDefault();

		//if (UserIsValid(this.props.auth)) {
			event.target.myButton.disabled = true;
			event.target.myButton.value = "Please wait...";
			this.postForm(event);
		//}
		//else {
			//alert('There was an issue when you logged in. Please logout and try again.');
		//}
	}

	postForm(event) {
		var nameValidation = '';
		var validate = false;

		if (this.state.inputName === '') {
			event.target.myButton.disabled = false;
			nameValidation = 'Please enter your name.';
			validate = true;
		}

		if (validate) {
			this.setState({
				nameValidationError: nameValidation
			});
			return false;
		}

		fetch(config.JOIN_THE_FUN_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'//,
				//'Authorization': TryGetToken(this.props.auth.user)
			},
			body: JSON.stringify({ Name: this.state.inputName })
		})
		.then((response) => {
			return response.json();
		})
		.then(data => {
			var nameError = '';
			if (data === 2) {
				document.getElementById("myButton").disabled = false;
				nameError = 'Someone has already entered with that name. Please add an initial.';
			}
            this.setState({
                nameValidationError: nameError,
                status: data
            });
            this.props.signalR.connection.invoke(config.SIGNALR_SANTA_HUB_GET_PARTICIPANTS)
		})
		.catch(error => {
			console.error(error);
			document.getElementById("myButton").disabled = false;
			document.getElementById("myButton").value = 'Draw Name';
			//alert('There was an issue when you logged in. Please logout and try again.');
			alert('An error occurred. Please try again.');
		});
	}

	render() {
		const date = new Date();
		const classes = makeStyles(theme => ({
			root: {
				flexGrow: 1
			}
		}));
		return (
			<div className={classes.root}>
				<Card>
					<CardContent>
						{/**UserIsValid(this.props.auth) ? (
							<div>**/}
						{this.state.status === 0 || this.state.status === 2 ? (
									<form onSubmit={this.checkForm}>
										<div className="form-horizontal">
											<h2>Participate in {date.getFullYear()}'s Secret Santa!</h2>

											<br />

											{/**Cookies.get('User-Email') == null ? (<p>Welcome!</p>) : (<p>Welcome, <strong>{Cookies.get('User-Email')}</strong>!</p>)**/}
											<p>Please enter your name to join in on the fun this year!</p>

											<hr />

											<div className="form-group">
												<label className="control-label col-md-2 christmas-label">Your Name:</label>
												<div className="col-md-10">
													<input
														className="form-control text-box single-line user-input"
														id="Name"
														name="Name"
														placeholder="Santa Claus"
														type="text"
														value={this.state.inputName}
														maxLength="50"
														onChange={(e) => this.setState({ inputName: e.target.value.slice(0, 50) })} />
													<div style={{ color: 'red', marginTop: '5px' }}>
														{this.state.nameValidationError}
													</div>
												</div>
											</div>

											<div className="form-group">
												<div className="col-md-offset-2 col-md-10">
													<input type="submit" value="Join" name="myButton" id="myButton" className="btn btn-default christmas-green" />
												</div>
											</div>
										</div>
									</form>
								) : (
										<div className="form-horizontal">
											<h2>Thanks for joining!</h2>

											<br />

											<p>You can now draw a name by visiting <Link to="/">this link</Link>.</p>
										</div>
									)}
						{/**</div>
						) : (
								<Redirect
									to={{
										pathname: '/login',
										state:
										{
											from: this.props.location
										}
									}}
								/>
							)}**/}
					</CardContent>
				</Card>
			</div>
		);
    }

    componentDidMount = () => {
        getSignalRConnection(this.props.signalR, config.SIGNALR_SANTA_HUB)
            .then((conn) => {
                this.props.storeSignalRConnection(conn);
			})
			.catch(error => console.error(error));
    }
};

const mapStateToProps = (state) => {
	return {
        auth: state.auth,
        signalR: state.signalR
	};
};

const mapDispatchToProps = (dispatch) => {
    return {
        storeSignalRConnection: (connection) => {
            dispatch(storeSignalRConnection(connection));
        }
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(JoinTheFun));