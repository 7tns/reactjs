import React from "react";
import axios from 'axios';



class SignUp extends React.Component{
  constructor(props){
    super(props);
      this.state = {
        Name : "",
        Password : "",
        eMail : ""
      };
      this.handlechange = this.handlechange.bind(this);
      this.handlechange2 = this.handlechange2.bind(this);
      this.handlechange3 = this.handlechange3.bind(this);
  }
    handlechange(event){
      this.setState({Name: event.target.value});
      console.log(this.state.Name);
    }
    handlechange2(event){
      this.setState({Password: event.target.value});
      console.log(this.state.Password);
    }
    handlechange3(event){
      this.setState({eMail: event.target.value});
      console.log(this.state.eMail);
    }


  render(){
    return <div className="container">
    <form method="post">
            <input type="texte" name="Name" onChange={this.handlechange} placeholder='Name' id="Name"/>
            <br></br>
            <input type="password" name="Password"   onChange={this.handlechange2} placeholder='Password'  id="Password" />
            <br></br>
            <input type="email" name="eMail"   onChange={this.handlechange3} placeholder='eMail'  id="eMail" />
            <br></br>
    </form>
            <button onClick={(e)=>{
                                              e.preventDefault();
                                              axios.post('http://localhost:27017/SignUp', {Name : this.state.Name, Password :this.state.Name,eMail : this.state.eMail})
                                              .then((res)=>{
                                              console.log('ping');
                                              if (res.data.message ==='Utilisateur enregistré'){
                                                window.location.replace('http://localhost:3000/');
                                              }
                                            });

            }}>
            Inscription</button>
            <br></br>
   
  </div>

}
}

export default SignUp;