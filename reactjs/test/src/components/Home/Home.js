import {Link} from 'react-router-dom';
import React from 'react';
import axios from 'axios';




class Home extends React.Component {

  constructor(props){
    super(props);
      this.state = {
        eMail : "",
        Password : "",
      };
      this.handlechange = this.handlechange.bind(this);
      this.handlechange2 = this.handlechange2.bind(this);
  }

handlechange(event){
    this.setState({eMail : event.target.value});
      console.log(this.state.eMail);
}
handlechange2(event){
  this.setState({Password : event.target.value});
      console.log(this.state.Password);
}

  render(){
    return  <div className='container'>
  <form method='post'>
  <input type="email" name="eMail" onChange={this.handlechange} placeholder="eMail" id="eMail" />
  <br></br>
  <input type="password" name="Password" onChange={this.handlechange2} placeholder="Password" id="Password" />
  <br></br>
  </form >
  <button onClick = {(e)=>{

                                              e.preventDefault(); 
                                              axios.post('http://localhost:27017/login',{ Password :this.state.Password , eMail : this.state.eMail })
                                              .then((res) =>{
                                              console.log('ping');
                                              console.log(res);
                                              if (res.data.msg === "user connected" ){
                                                localStorage.setItem('token', JSON.stringify(res.data.token));
                                                window.location.replace('http://localhost:3000/ListeUtilisateurs');
                                              }else{
                                                console.log("Mauvais mot de passe");
                                              }
                                            });        
                                            }                       
  }>
            Connexion</button>
  <br></br>
  <label>Vous n'avez pas de compte ? :<Link to="/SignUp">S'inscrire </Link></label>
</div>
}
}


export default Home