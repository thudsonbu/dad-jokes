import React, { Component } from 'react';
import Joke from './Joke';
import './JokeList.css';
import axios from 'axios';
import uuid from 'uuid/v4';

class JokeList extends Component{
    static defaultProps = {
        numJokesToGet: 10, // number of jokes that will be requested
    };
    constructor(props) {
        super(props);
        this.state = {
            jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]" ),
            loading: false
        };
        this.seenJokes = new Set(this.state.jokes.map(joke => joke.joke));
        this.getJokes = this.getJokes.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount() {
        if(this.state.jokes.length === 0){
            this.getJokes();
        }
    }
    async getJokes(){
        try{
            let gotJokes = []; // empty array that will be used to set state later
            while(gotJokes.length < this.props.numJokesToGet){
                let res = await axios.get("https://icanhazdadjoke.com/", { headers: { Accept: "application/json" }});
                if(!this.seenJokes.has(res.data.joke)){
                    gotJokes.push({
                        id: uuid(),
                        joke: res.data.joke,
                        votes: 0
                    });
                } else {
                    console.log("Found duplicate");
                }
            }
            this.setState(
                st => ({
                    loading: false,
                    jokes: [...st.jokes, ...gotJokes]
                }),
                () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
            );
        } catch(e){
            alert(e);
            this.setState({loading: false})
        }
    }
    handleVote(id, delta){
        this.setState( 
            st => ({
                jokes: st.jokes.map(joke =>
                    joke.id === id ? {...joke, votes: joke.votes + delta} : joke)
            }),
            () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
        )
    }
    handleClick(){
        this.setState({loading: true}, this.getJokes);
    }
    render() {
        if(this.state.loading){
            return(
                <div className="JokeList-spinner">
                    <i className="far fa-8x fa-laugh fa-spin"></i>
                    <h1 className="JokeList-title">Loading...</h1>
                </div>
            )
        }
        let jokes = this.state.jokes.sort((a,b) => b.votes - a.votes);
        return(
            <div className="JokeList">
                <div className="JokeList-sidebar">
                    <h1 className="JokeList-title"><span>Dad</span> Jokes</h1>
                    <img src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' />
                    <button className="JokeList-getmore" onClick={this.handleClick}>New Joke</button>
                </div>
                <div className="JokeList-jokes">
                    {jokes.map(joke => (
                        <Joke 
                            key = {joke.id}
                            joke={joke.joke}
                            votes={joke.votes}
                            upVote={() => this.handleVote(joke.id, 1)}
                            downVote={() => this.handleVote(joke.id, -1)}
                        />
                    ))}
                </div>
            </div>
        )
    }
}

export default JokeList;