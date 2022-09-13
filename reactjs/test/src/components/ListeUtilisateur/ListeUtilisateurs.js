import React from "react";
import axios from "axios";


function getToken() {
  if (localStorage.getItem("token")) {
    return JSON.parse(localStorage.getItem("token"));
  }
}

function ListeUtilisateurs() {
  const [userList, setUserList] = React.useState([])

  React.useEffect(() => {
   let token = getToken();
    axios
      .get("http://localhost:27017/ListeUtilisateurs",{headers:{authorization: token}})
      .then( (res) => {  
          setUserList(res.data.userList);
      })
      .catch( (error) => {
        // handle error
        console.log(error);
      });
  }, []);

  return (
    <React.Fragment>
    <div><h1>ListeUtilisateurs</h1>
    
    <div>
      
      
      
    {userList.map((i) => {
                return (
          <p> {i} </p>
                    );
              })}
    
    
    </div>
    
    </div>
    
    </React.Fragment>
  );
}

export default ListeUtilisateurs;






























// import React from 'react';
// import axios from 'axios';


// function getToken() {
//   if (localStorage.getItem("token")) {
//     return JSON.parse(localStorage.getItem("token"));
//   }
// }
 


// class ListeUtilisateurs extends React.Component{
//   constructor(props){
//     super(props);
//     this.state={
//       Names:[]
//     };
//   }
//     render(){
//     return  <div>ListeUtilisateurs
//         <form>
//           <button onClick = {()=>{
//             // const token = getToken();
//             axios.post('http://localhost:27017/ListeUtilisateurs').then((res) => {
//                 console.log(res);
//             });
//           }}>Afficher la liste des Utilisateur</button>
//         </form>
//           <br></br>

//     </div>
// }
// }

// export default ListeUtilisateurs;
