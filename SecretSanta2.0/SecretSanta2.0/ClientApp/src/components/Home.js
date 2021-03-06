import { getSignalRConnection, storeSignalRConnection } from '../helpers/signalRHelper';
import { UserIsValid, TryGetToken } from '../helpers/authHelper';
import { withRouter, Link, Redirect } from 'react-router-dom';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import config from '../config.json';
import Cookies from 'js-cookie';
import Emoji from 'react-emoji-render';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

class Home extends Component {
	static displayName = Home.name;
	constructor(props) {
		super(props);
		this.state = {
            participantNames: [],
			secretSanta: [ '', '', '', '' ],
			selectedName: '',
			validationError: '',
			status: 0,
        };
        this._ismounted = false;
		this.checkForm = this.checkForm.bind(this);
		this.postForm = this.postForm.bind(this);
        this.printPage = this.printPage.bind(this);
	}

	printPage() {
		window.print();
	}

	checkForm(event) {
		event.preventDefault();

		//if (UserIsValid(this.props.auth)) {
			event.target.myButton.disabled = true;
			event.target.myButton.value = 'Please wait...';
			this.postForm(event);
		//}
		//else {
			//this.setState({ status: 3 });
		//}
	}

	postForm(event) {
		let inputName = event.target.FirstName.value;	

		if (!inputName || inputName === '' || inputName === 'Please Select Your Name') {
			event.target.myButton.disabled = false;
			this.setState({ validationError: "Please select your name before clicking 'Draw Name'." });
			return false;
		}

		fetch(config.GET_SECRET_SANTA_URL + '?name=' + inputName, {
			method: 'POST'//,
			//headers: {
				//'Authorization': TryGetToken(this.props.auth.user)
			//},
		})
		.then((response) => {
			return response.json();
		})
		.then(data => {
			this.setState({
				secretSanta: [
					data.title,
					data.pageDescription,
					data.header,
					data.name
				],
				status: data.response
			});
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
		const classes = makeStyles(theme => ({
			root: {
				flexGrow: 1
			}
		}));
		return (
			<div className={classes.root}>
				{this.state.status === 0 ? (
					<Grid container spacing={3}>
						<Grid item xs={12} sm={6}>
							<Card>
								<CardContent>
									<form onSubmit={this.checkForm}>
										<div className="form-horizontal">
											<h2>Welcome to the 2019 Christmas Secret Santa!</h2>
											<br />
											{/**UserIsValid(this.props.auth) && Cookies.get('User-Email') != null ? (<p>Welcome, <strong>{Cookies.get('User-Email')}</strong>!</p>) : ('')**/}
											<p>Please select your name from the dropdown so that you don't accidentally draw yourself, and then click on <strong>Draw Name</strong> to randomly pick someone from the group.</p>
											<p>If you don't see your name in the dropdown, please click <strong>Join the Fun</strong> in the header, or just click <Link to="/join-the-fun">this link</Link>.</p>
											<hr />
											<div className="form-group">
												<label className="control-label col-md-4">Your Name:</label>
												<div className="col-md-10">
													<select
														className="form-control user-input"
														id="FirstName"
														name="FirstName"
														value={this.state.selectedName}
														onChange={(e) => this.setState({
															selectedName: e.target.value,
															validationError: e.target.value === "" ? "Please select your name before clicking 'Draw Name'." : ""
														})}>
														{this.state.participantNames.map((name) => <option key={name.value} value={name.value}>{name.display}</option>)}
													</select>
													<div style={{ color: 'red', marginTop: '5px' }}>
														{this.state.validationError}
													</div>
												</div>
											</div>
											<div className="form-group">
												<div className="col-md-offset-2 col-md-10">
													<input type="submit" value="Draw Name" name="myButton" id="myButton" className="btn btn-default christmas-green" />
												</div>
											</div>
										</div>
									</form>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Card>
								<CardContent>
									<h2>Wishlists:</h2>
									<br />
									<p><Emoji text=":sparkles:" /><b>Gaston:</b><br />
										1. Rayban Original Wayfarer Remix Sunglasses - <a href="https://www.ray-ban.com/usa/sunglasses/RB2140%20UNISEX%20062-original%20wayfarer%20classic-polished%20black/805289126577?category_Id=1725706" target="_blank" rel="noopener noreferrer">Link</a>.<br />
										2. FL Kodiak Pack Xtra Backpack - <a href="https://www.sportsmans.com/camping-gear-supplies/backpacks-bags/technical-day-packs/fl-kodiak-pack-xtra/p/1389680" target="_blank" rel="noopener noreferrer">Link</a>.<br />
										3. American Endurance Men's Full Grain Leather with Roller Buckle Belt - <a href="https://www.sportsmans.com/clothing-outdoor-casual-men-women-youth/mens-casual/belts-accessories/american-endurance-mens-full-grain-leather-with-roller-buckle/p/p1361279" target="_blank" rel="noopener noreferrer">Link</a>.<br />
										4. Stealth Cam Trail Camera Combo - <a href="https://www.sportsmans.com/hunting-gear-supplies/trail-cameras-accessories/stealth-cam-trail-camera-combo/p/1469851" target="_blank" rel="noopener noreferrer">Link</a>.<br />
										5. Buck Knives Sentry Knife - <a href="https://www.sportsmans.com/knives/tactical-knives/buck-knives-sentry-knife/p/1469704" target="_blank" rel="noopener noreferrer">Link</a>.<br />
										6. Radians T-71 Safety Shooting Glasses - <a href="https://www.sportsmans.com/shooting-gear-gun-supplies/shooting-equipment/eye-protection/radians-t-71-safety-shooting-glasses/p/p42160" target="_blank" rel="noopener noreferrer">Link</a>.
									</p>
									<p><Emoji text=":airplane:" /><b>Jon:</b><br />
										1. Book - "Jeppesen Instrument Commercial" (New/Hardback) - <a href="https://www.amazon.com/Jeppesen-Instrument-Commercial-Staff/dp/0884873870/ref=pd_sbs_14_2/147-6436853-0125324" target="_blank" rel="noopener noreferrer">Amazon Link</a>.<br />
										2. Book - "Guided Flight Discovery Private Pilot Handbook" (New/Paperback) - <a href="https://www.amazon.com/Guided-Flight-Discovery-Private-Handbook/dp/0884873331/ref=sr_1_7" target="_blank" rel="noopener noreferrer">Amazon Link</a>.<br />
										3. Book - "Learn Python Programming: The no-nonsense, beginner's guide to programming, data science, and web development with Python 3.7, 2nd Edition" (New/Paperback) - <a href="https://www.amazon.com/dp/1788996666" target="_blank" rel="noopener noreferrer">Amazon Link</a>.
									</p>
									<p><Emoji text=":stars:" /><b>Tina:</b><br />
										1. Cuisinart Hand Mixer - <a href="https://www.walmart.com/ip/Cuisinart-Power-Advantage-PLUS-5-Speed-220-Watt-Hand-Mixer-White/35491906" target="_blank" rel="noopener noreferrer">Link</a>.<br />
										2. Black & Decker Citrus Juicer - <a href="https://www.walmart.com/ip/BLACK-DECKER-32oz-Citrus-Juicer-with-Self-reversing-Cone-White-CJ650W/112571551" target="_blank" rel="noopener noreferrer">Link</a>.
									</p>
									<p><Emoji text=":santa:" /><b>William:</b><br/>
										1. Javelin "Instant Read Meat Thermometer" - <a href="https://www.amazon.com/Lavatools-Javelin-Ambidextrous-Professional-Thermometer/dp/B01F59K0KA" target="_blank" rel="noopener noreferrer">Amazon Link</a>.<br />
										2. Grill Cover for Traeger Smoker - <a href="https://www.amazon.com/Traeger-BAC379-Length-Grill-Cover/dp/B01BH3RVV4" target="_blank" rel="noopener noreferrer">Amazon Link</a>.
									</p>
									<p><Emoji text=":mrs_claus:" /><b>Lisa:</b><br />
										1. Pedicure gift card for "The Polish Room" - <a href="http://www.polishroom.com/" target="_blank" rel="noopener noreferrer">Link</a>.<br />
										2. Swarovski 2019 Crystal Christmas Ornament - <a href="https://www.bedbathandbeyond.com/store/product/swarovski-reg-2019-annual-edition-star-christmas-ornament/5345286" target="_blank" rel="noopener noreferrer">Link</a>.<br />
										3. Joann's Custom Pin Cushion - <a href="https://www.joann.com/wide-leaf-succulent-pin-cushion/15954472.html" target="_blank" rel="noopener noreferrer">Link</a>.
									</p>
									<p><Emoji text=":snowman:" /><b>Trevor:</b><br />
										1. New authentic gray Vans shoes size 11 (the official color is called "pewter/black" but looks gray) - <a href="https://www.vans.com/shop/authentic-pewter-black" target="_blank" rel="noopener noreferrer">Link</a>.
									</p>
									<p><Emoji text=":star2:" /><b>Wilhelmina:</b><br />
										1. Size medium sweater (or multiple sweaters if they're cheap), with a collar, and not low cut. Pastel colors are good (soft blue, pink, red, lavender).
									</p>
									<p><Emoji text=":christmas_tree:" /><b>Paul:</b><br />
										1. Book - "Witch Hunt" by Gregg Jarrett - <a href="https://www.amazon.com/Witch-Hunt-Greatest-Delusion-Political/dp/0062960091" target="_blank" rel="noopener noreferrer">Amazon Link</a>.<br />
										2. Book - "Liars, Leakers, and Liberals" by Jeanine Pirro - <a href="https://www.amazon.com/Liars-Leakers-Liberals-Anti-Trump-Conspiracy/dp/1546083421" target="_blank" rel="noopener noreferrer">Amazon Link</a>.<br />
										3. Large pepperoni pizza (bring/order to be delivered to Desert Winds on the day of Christmas).
									</p>
									<p><Emoji text=":snowflake:" /><b>Marla Kay:</b><br />
										1. DVD Player - <a href="https://www.amazon.com/Sony-DVPSR210P-DVD-Player/dp/B07RYRF1FF/ref=zg_bs_1036922_1?_encoding=UTF8&refRID=22QB40HHG2EV1Z1V6ZVB&th=1" target="_blank" rel="noopener noreferrer">Amazon Link</a>.<br />
										2. "Very Cherry" Jelly Belly's (the red ones) - <a href="https://www.amazon.com/Very-Cherry-Jelly-Beans-Re-Sealable/dp/B0015D43NQ" target="_blank" rel="noopener noreferrer">Amazon Link</a>.
									</p>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				) : ('')}
				{this.state.status === 1 || this.state.status === 2 ? (
					<div className="form-horizontal">
						<h2>{this.state.secretSanta[0]}</h2>
						<p>{this.state.secretSanta[1]}</p>
						<p><b>{this.state.secretSanta[2] ? this.state.secretSanta[2] : ''}</b> {this.state.secretSanta[3] ? [<Emoji text=":christmas_tree:" />, this.state.secretSanta[3], <Emoji text=":star2:" />] : ''}</p>
						<center>
							<button className="btn btn-primary hidden-print christmas-green" onClick={this.printPage}><span className="glyphicon glyphicon-print" aria-hidden="true"></span> Print</button>
						</center>
					</div>
				) : ('')}
				{/**this.state.status === 3 ? (
					<Redirect
						to={{
							pathname: '/login',
							state:
							{
								from: this.props.location
							}
						}}
					/>
				) : ('')**/}
			</div>
		);
	}
    
    componentDidMount = () => {
        this._ismounted = true;
        getSignalRConnection(this.props.signalR, config.SIGNALR_SANTA_HUB)
            .then((conn) => {
                this.props.storeSignalRConnection(conn);
				conn.on(config.SIGNALR_SANTA_HUB_GET_PARTICIPANTS, (data) => {
					if (this._ismounted) {
						let participants = data.participants.map(name => { return { value: name, display: name } })
						this.setState({ participantNames: [{ value: '', display: 'Please Select Your Name' }].concat(participants) });
					}
				});
                conn.invoke(config.SIGNALR_SANTA_HUB_GET_PARTICIPANTS);
            })
            .catch(error => console.error(error));
    }

    componentWillUnmount() {
        this._ismounted = false;
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
        storeSignalRConnection: (url) => {
            dispatch(storeSignalRConnection(url));
        }
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
