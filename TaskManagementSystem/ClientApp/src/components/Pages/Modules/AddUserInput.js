import React, { Component } from 'react';
import axios from 'axios';

export class AddUserInput extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return ( 
            <input type={this.props.inputType} className='add-user-form__input' onChange={(e)=> {
                let currentValue = e.target.value;

                this.props.validate(this.props.inputType, currentValue)
            }}/>
        )
    }
}