import React, { Component } from 'react';

class Joke extends Component{
    render() { 
        return (
            <div className="Joke">
                <div className="Joke-buttons">
                    <i className="fas fa-arrow-up" onClick={this.props.upVote}></i>
                    <span>{this.props.votes}</span>
                    <i className="fas fa-arrow-down" onClick={this.props.downVote}></i>
                </div>
                <div className="Joke-text">
                    {this.props.joke}
                </div>
            </div>
        )
    }
}

export default Joke;