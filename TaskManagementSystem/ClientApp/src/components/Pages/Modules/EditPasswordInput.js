import React, { Component } from 'react';

export class EditPasswordInput extends Component {

    constructor(props) {
        super(props);
    }

    

    render() {

        return ( 
            <input type={'password'} className='pass-modal__input' onChange={(e)=>{
                console.log(e.target.value)
                this.props.receivePass(this.props.inputType, e.target.value)
            }}/>
        )
    }
}