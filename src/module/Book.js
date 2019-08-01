import React, {Component} from 'react';
import $ from 'jquery';
import CustomInput from '../components/CustomInput.js'
import PubSub from 'pubsub-js'
import ErrorTratament from './ErrorTratament.js'

class BookForm extends Component{

  constructor() {
    super()
    this.state = {id:'', titulo:'', autorId:''}
    this.sendForm = this.sendForm.bind(this)
  }

  sendForm( event ){
    event.preventDefault();
    $.ajax({
      url:"https://cdc-react.herokuapp.com/api/livros",
      contentType: 'application/json',
      dataType: 'json',
      type: 'post',
      data: JSON.stringify({titulo: this.state.titulo, preco: this.state.preco, autorId: this.state.autorId}),
      success: function( newList ){
        PubSub.publish( 'updateBookList', newList )
        this.setState({ titulo:'', preco:'', autorId:'' })
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
          <CustomInput label="Título" id="titulo" type="text" name="titulo" value={this.state.titulo} onChange={this.saveState.bind(this, 'titulo')} />
          <CustomInput label="preco" id="preco" type="text" name="preco" value={this.state.preco} onChange={this.saveState.bind(this, 'preco')} />
          <div className="pure-control-group">
            <label>Autor</label>
            <select value={ this.state.autorId } name="autorId" onChange={ this.saveState.bind(this, 'autorId') }>
              <option value="">Selecione</option>
              { 
                this.props.autores.map(function(autor) {
                  return <option key={ autor.id } value={ autor.id }>
                      { autor.nome }
                    </option>;
                })
              }
            </select>
          </div>
          <CustomInput className="pure-button pure-button-primary" id="submit" type="submit" name="submit" value="Enviar" />
          
        </form>             
      </div>
    )
  } 

}

class BookTable extends Component{

  render() {
    return(
      <div>            
        <table className="pure-table">
          <thead>
            <tr>
              <th>Titulo</th>
              <th>Preço</th>
              <th>Autor</th>
            </tr>
          </thead>
          <tbody>
          {
            this.props.list.map(function ( book ) {
              return(
                <tr key={book.id}>
                  <td>{book.titulo}</td>
                  <td>{book.preco}</td>
                  <td>{book.autor.nome}</td>
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

export default class BookBox extends Component{
  constructor() {
    super()
    this.state = {list : [], autores : []}
  }

  componentDidMount(){
    $.ajax({
      url:"https://cdc-react.herokuapp.com/api/livros",
      dataType: 'json',
      success:function( response ){
        this.setState({ list: response })
      }.bind(this)
    })

    $.ajax({
      url:"https://cdc-react.herokuapp.com/api/autores",
      dataType: 'json',
      success:function( response ){
        this.setState({ autores: response })
      }.bind(this)
    })

    PubSub.subscribe( 'updateBookList', function(topic, newList ) {
      this.setState({ list: newList })
    }.bind(this))
  }

  render() {
    return (
      <div>
        <div className="header">
          <h1>Cadastro Livro</h1>
        </div>
        <div className="content" id="content">             
          <BookForm autores={this.state.autores}/>
          <BookTable list={this.state.list}/> 
        </div>  
      </div>     
    )
  }
}