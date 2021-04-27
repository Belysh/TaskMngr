import React, { Component } from 'react';

export class EditUserInput extends Component {

    constructor(props) {
        super(props);
    }

    

    render() {

        let className = 'users-list__item-input';
        if (this.props.isCorrect) {
            className += '--active'
        }        

        return ( 
            <input className={className} defaultValue={this.props.value} onChange={(e)=> {

                this.props.saveData(this.props.inputType, e.target.value)
                
                //this.props.validate(this.props.inputType, currentValue)
            }}/>
        )
    }
}