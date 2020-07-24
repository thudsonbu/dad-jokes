import React, { Component } from 'react';
import axios from 'axios';

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
            gotJokes.push(res.data.joke);
        };
        this.setState({
            jokes: gotJokes,
        });
    }
    render() {
        return(
            <div>
                <h1>Dad Jokes</h1>
            </div>
        )
    }
}

export default JokeList;