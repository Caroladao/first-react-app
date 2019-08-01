import PubSub from 'pubsub-js'

export default class ErrorTratament{
  showError( obj ){
    for( var i = 0; i < obj.errors.length; i++ ){
      var error = obj.errors[i]
      PubSub.publish( "error-validation", error )
    }
  }
}