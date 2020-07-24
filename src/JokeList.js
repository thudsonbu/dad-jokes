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
            jokes: [],
        };
    }
    async componentDidMount() {
        let gotJokes = []; // empty array that will be used to set state later
        while(gotJokes.length < this.props.numJokesToGet){
            let res = await axios.get("https://icanhazdadjoke.com/", { headers: { Accept: "application/json" }});
            gotJokes.push({
                id: uuid(),
                joke: res.data.joke,
                votes: 0
            });
        };
        this.setState({
            jokes: gotJokes,
        });
    }
    handleVote(id, delta){
        this.setState( 
            st => ({
                jokes: st.jokes.map(joke =>
                    joke.id === id ? {...joke, votes: joke.votes + delta} : joke)
            })
        )
    }
    render() {
        return(
            <div className="JokeList">
                <div className="JokeList-sidebar">
                    <h1 className="JokeList-title"><span>Dad</span> Jokes</h1>
                    <img src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' />
                    <button className="JokeList-getmore">New Joke</button>
                </div>
                <div className="JokeList-jokes">
                    {this.state.jokes.map(joke => (
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