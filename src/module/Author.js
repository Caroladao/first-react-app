import React, {Component} from 'react';
import $ from 'jquery';
import CustomInput from '../components/CustomInput.js'
import PubSub from 'pubsub-js'
import ErrorTratament from './ErrorTratament.js'

class AuthorForm extends Component{

  constructor() {
    super()
    this.state = {nome:'', email:'', senha:''}
    this.sendForm = this.sendForm.bind(this)
  }

  sendForm( event ){
    event.preventDefault();
    $.ajax({
      url:"http://cdc-react.herokuapp.com/api/autores",
      contentType: 'application/json',
      dataType: 'json',
      type: 'post',
      data: JSON.stringify({nome: this.state.nome, email: this.state.email, senha: this.state.senha}),
      success: function( newList ){
        PubSub.publish( 'updateAuthorList', newList )
        this.setState({nome:'', email:'', senha:''})
      }.bind(this),
      error: function( response ){
        if( response.status === 400 ) {
          new ErrorTratament().showError( response.responseJSON )
        }
      },
      beforeSend: function() {
        PubSub.publish( "clearErrors", {} )
      }
    })
  }

  saveState( input, event ){
    this.setState({ [input]: event.target.value })
  }

  render() {
    return(
      <div className="pure-form pure-form-aligned">
        <form className="pure-form pure-form-aligned" onSubmit={this.sendForm} method="POST">
          <CustomInput label="Nome" id="nome" type="text" name="nome" value={this.state.nome} onChange={this.saveState.bind(this, 'nome')} />
          <CustomInput label="Email" id="email" type="email" name="email" value={this.state.email} onChange={this.saveState.bind(this, 'email')} />
          <CustomInput label="Senha" id="senha" type="password" name="senha" value={this.state.senha} onChange={this.saveState.bind(this, 'senha')} />

          <CustomInput className="pure-button pure-button-primary" id="submit" type="submit" name="submit" value="Enviar" />
          
        </form>             
      </div>
    )
  } 

}

class AuthorTable extends Component{

  render() {
    return(
      <div>            
        <table className="pure-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>email</th>
            </tr>
          </thead>
          <tbody>
          {
            this.props.list.map(function (author) {
              return(
                <tr key={author.id}>
                  <td>{author.nome}</td>
                  <td>{author.email}</td>
                </tr>
              )
            })
          }
          </tbody>
        </table> 
      </div>
    )
  } 

}

export default class AuthorBox extends Component{
  constructor() {
    super()
    this.state = {list : []}
  }

  componentDidMount(){
    $.ajax({
      url:"http://cdc-react.herokuapp.com/api/autores",
      dataType: 'json',
      success:function( response ){
        this.setState({ list:response })
      }.bind(this)
    })

    PubSub.subscribe( 'updateAuthorList', function(topic, newList ) {
      this.setState({ list: newList })
    }.bind(this))
  }

  render() {
    return (
      <div>
        <div className="header">
          <h1>Welcome Author</h1>
        </div>
        <div className="content" id="content">             
          <AuthorForm/>
          <AuthorTable list={this.state.list}/> 
        </div>  
      </div>     
    )
  }
}