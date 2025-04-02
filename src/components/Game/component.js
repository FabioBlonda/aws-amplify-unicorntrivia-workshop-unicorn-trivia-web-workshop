import React, { Component } from 'react';
import { Amplify } from 'aws-amplify';
import { API, graphqlOperation } from 'aws-amplify';
import { print as gqlToString } from 'graphql/language';
import { onCreateQuestion, onUpdateQuestion } from '../../graphql/subscriptions';
import { createAnswer, updateAnswer } from '../../graphql/mutations';
import winner from '../../images/winner.png';
import loser from '../../images/loser.png';
import Video from '../Video';
import Modal from '../Modal';
import styles from './styles';
import awsmobile from './../../aws-exports';
/*const awsconfig = {
    aws_appsync_graphqlEndpoint: "https://sslhe7ftqvdz3f7w5uhjjeobdm.appsync-api.eu-west-1.amazonaws.com/graphql",
    aws_appsync_region: "eu-west-1",
    aws_appsync_authenticationType: 'API_KEY',
    aws_appsync_apiKey: "da2-nirzx2l2zfgr7d5avqtap3hx3a"
};*/

Amplify.configure(awsmobile);

class Game extends Component {
	constructor(props){
		super(props);
		this.questionSubscription = null;
    	this.answerSubscription = null;
		this.state = {
			modalVisible: false,
			modalBackground: "#FFFFFF",
			question: {},
			answer: {},
			questionAvailable: false,
			answerAvailable: false,
			answerChosen: "",
			selectedAnswerButton: null,
			buttonsDisabled: false,
			questionCount: 0,
			wrongQuestions: [],
			gameOver: false,
			winner: false,
			loser: false,
			username: "",
			id: null,
			maxQuestions: 12
		};
	}

	componentDidMount(){
		try {
			console.log('AppSync Config:', awsmobile);
			// Configure Amplify for this component
			Amplify.configure(awsmobile);
			this.listenForQuestions();
			this.listenForAnswers();
		} catch (error) {
			console.error('Error in componentDidMount:', error);
		}
	}

	setupClient = async (username) => {
		try {
			const response = await API.graphql({
				query: createAnswer,
				variables: {
					input: {
						username: username
					}
				},
				authMode: 'API_KEY' // Add this if you're using API key authentication
			});
	
			if (response.data.createAnswer) {
				this.setState({
					username: response.data.createAnswer.username,
					id: response.data.createAnswer.id
				});
			}
		} catch (error) {
			console.error('Error setting up client:', error);
		}
	}

	askForName = () => {
		/* CODE GOES HERE */
		return(
			<div className="username-prompt-container">
				<div className="username-prompt">
					<div className="username-prompt-header-container">
						<div className="username-prompt-header">Please provide a username</div>
					</div>
					<div className="username-prompt-input-container">
						<input
							className="username-prompt-input"
							placeholder="Provide a username... then press enter"
							onKeyUp={((e) => {
								if(e.key === "Enter" && e.target.value != ""){
									this.setupClient(e.target.value);
								}
							}).bind(this)}
						/>
					</div>
				</div>
			</div>
		);
	}

	listenForQuestions = () => {
		/* CODE GOES HERE */
		try {
			const subscription = API.graphql({
				query: onCreateQuestion,
				authMode: 'API_KEY' // Add this if you're using API key authentication
			}).subscribe({
				next: (data) => {
					if (data.value.data.onCreateQuestion) {
						this.setState({
							question: {
								onCreateQuestion: data.value.data.onCreateQuestion
							},
							answerAvailable: false,
							questionAvailable: true,
							modalVisible: true,
							buttonsDisabled: false,
							selectedAnswerButton: null
						});
					}
				},
				error: (error) => {
					console.error('Question subscription error:', error);
				}
			});
	
			this.questionSubscription = subscription;
		} catch (error) {
			console.error('Error setting up question subscription:', error);
		}
	}

	listenForAnswers = () => {
		/* CODE GOES HERE */
		let self = this;
		API.graphql(
			graphqlOperation(onUpdateQuestion)
		).subscribe({
			next: (data) => {
				setTimeout(() => {
					self.setState({
						answer: data.value.data,
						answerAvailable: true,
						questionAvailable: false,
						modalVisible: true
					});
				}, 1000);
			}
		})
	}

	answerChosen = (index) => {
		/* CODE GOES HERE */
		try {
			const answer = this.state.question.onCreateQuestion.answers[index];
			
			API.graphql({
				query: updateAnswer,
				variables: {
					input: {
						id: this.state.id,
						answer: [index]
					}
				},
				authMode: 'API_KEY' // Add this if you're using API key authentication
			});
	
			this.setState({
				questionsAnswered: true,
				selectedAnswerButton: index,
				buttonsDisabled: true,
				answerChosen: {
					index: index,
					answer: answer
				},
				questionCount: this.state.questionCount + 1
			});
		} catch (error) {
			console.error('Error submitting answer:', error);
		}
	}

	button = (index, answer) => {
		let self = this;
		let buttonBackgroundColor,
			buttonBorderColor,
			buttonTextColor;
		if(this.state.questionAvailable){
			buttonBackgroundColor = this.state.selectedAnswerButton == index ? "#666666" : "#FFFFFF";
			buttonBorderColor = this.state.selectedAnswerButton == index ? "#666666" : "#CCCCCC";
			buttonTextColor = this.state.selectedAnswerButton == index ? "#FFFFFF" : "#000";

		} else if(this.state.answerAvailable){
			if(answer == this.state.answer.onUpdateQuestion.answers[this.state.answer.onUpdateQuestion.answerId]){
				buttonBackgroundColor = "#02DC2A";
				buttonBorderColor = "#02DC2A";
				buttonTextColor = "#FFFFFF";
			} else {
				buttonBackgroundColor = this.state.answerChosen.index == index ? "#FE0000" : "#FFFFFF";
				buttonBorderColor = this.state.answerChosen.index == index ? "#FE0000" : "#CCCCCC";
				buttonTextColor = this.state.answerChosen.index == index ? "#FFFFFF" : "#000";
			}
		}
		return(
			<li>
				<button
					key={index}	
					disabled={this.state.buttonsDisabled}
					onClick={this.state.questionAvailable ? ((e) => self.answerChosen(index)) : null}
					style={{
						...styles.buttonStyle,
						backgroundColor: buttonBackgroundColor,
						borderColor: buttonBorderColor,
						color: buttonTextColor
					}}
				>{ answer }</button>
			</li>
		);
	}

	answerButtons = () => {
		let self = this;
		if(this.state.questionAvailable){
			return(
				<ul>
					{ this.state.question.onCreateQuestion.answers.map((answer, index) => {
						return self.button(index, answer);
					})}
				</ul>
			);
		} else if(this.state.answerAvailable){
			return(
				<ul>
					{ this.state.answer.onUpdateQuestion.answers.map((answer, index) => {
						return self.button(index, answer);
					})}
				</ul>
			);
		}
	}

	question = () => {
		/* CODE GOES HERE */		
		let questionId = this.state.question.onCreateQuestion.id;
		if(this.state.questionAvailable){
			setTimeout((() => {
				if(this.state.answerChosen == null){
					this.answerChosen(-1);
				}
				if (this.state.question.onCreateQuestion.id == questionId) {
					this.setState({
						modalVisible: false,
						questionAvailable: false,
						buttonsDisabled: true,
						selectedAnswerButton: null
					});
				}
			}).bind(this), 10000);
			return(
				<div className="question-container">
					<div className="question">
						<div className="question-title-container">
							<div className="question-title">{ this.state.question.onCreateQuestion.question }</div>
						</div>
						<div className="answers-container">
							<div className="answers">
								{ this.answerButtons() }
							</div>	
						</div>
					</div>
				</div>
			);
		}
	}

	answer = () => {
		/* CODE GOES HERE */	
		let self = this;
		if(this.state.answerAvailable){
			setTimeout((()=> {
				let gameOver = this.state.questionCount == this.state.maxQuestions ? true : false;
				let wrongQuestions = this.state.answerChosen.answer !== this.state.answer.onUpdateQuestion.answers[this.state.answer.onUpdateQuestion.answerId] ? [...this.state.wrongQuestions, {question: this.state.answer, answer: this.state.answerChosen.answer}] : [...this.state.wrongQuestions];
				if(gameOver){
					setTimeout(() => {
						self.setState({
							modalVisible: true,
							modalBackground: "transparent"
						})
					}, 2000);
				}
				this.setState({
					modalVisible: false,
					answerAvailable: false,
					buttonsDisabled: false,
					wrongQuestions: wrongQuestions,
					answerChosen: {},
					selectedAnswerButton: null,
					gameOver: gameOver,
					winner: gameOver == true && wrongQuestions.length == 0 ? true : false,
					loser: gameOver == true && wrongQuestions.length > 0 ? true : false
				});
			}).bind(this), 10000);
			return(
				<div className="question-container">
					<div className="question">
						<div className="question-title-container">
							<div className="question-title">{ self.state.answer.onUpdateQuestion.question }</div>
						</div>
						<div className="answers-container">
							<div className="answers">
								{ self.answerButtons() }
							</div>	
						</div>
					</div>
				</div>
			);
		}	
	}

	winner = () => {
		return(
			<div className="winner-container">
				<img src={winner} alt="winner"/>	
			</div>
		);
	}

	loser = () => {
		return(
			<div className="loser-container">
				<img src={loser} alt="loser"/>	
			</div>
		);
	}

	game = () => {
		if(this.state.questionAvailable && !this.state.answerAvailable)
			return this.question();
		else if(this.state.answerAvailable && !this.state.questionAvailable)
			return this.answer();
		else if(this.state.gameOver)
			if(this.state.winner)
				return this.winner()
			else if(this.state.loser)
				return this.loser();
	}

	render(){
		if(this.state.username == ""){
			return this.askForName();	
		} else {
			return(
				<div className="game-container">
					<Video />
					<Modal class={this.state.modalVisible ? "show" : ""} backgroundColor={this.state.modalBackground}>
						{ this.game() }
					</Modal>
				</div>
			);
		}
	}
}

export default Game;