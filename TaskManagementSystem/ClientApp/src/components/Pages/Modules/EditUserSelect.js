import React, { Component } from 'react';

export class EditUserSelect extends Component {

    constructor(props) {
        super(props);
    }

    renderOptions(optionStack, currOption) {
        let arr = [<option value={currOption}>{currOption}</option>]
        arr.push(optionStack.map((element)=>{
            if(element !== currOption) {

                return <option value={element}>{element}</option>
            }
        }))

        return arr
    }    

    render() {
        return ( 
            <select className='users-list__item-select' onChange={(e)=>{
                this.props.saveData(this.props.inputType, e.target.value)
            }}>
                {this.renderOptions(this.props.optionStack, this.props.currOption)}
            </select>
        )
    }
}