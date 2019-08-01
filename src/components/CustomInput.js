import React, {Component} from 'react';
import PubSub from 'pubsub-js'

export default class CustomInput extends Component{
  constructor() {
    super();
    this.state = {errorMsg:''};
  }

  render() {
    return(
      <div className="pure-control-group">
        <label htmlFor={this.props.id}>{this.props.label}</label> 
        <input {...this.props} />                  
        <span className="error">{this.state.errorMsg}</span>
      </div>
    )
  }

  componentDidMount(){
    PubSub.subscribe( "error-validation", function( topic, error ) {
      if( error.field === this.props.name ) {
        this.setState( {errorMsg: error.defaultMessage} )
      }
    }.bind(this))

    PubSub.subscribe( "clearErrors", function( topic ) {
      this.setState( {errorMsg: ''} )
    }.bind(this))
  }
}