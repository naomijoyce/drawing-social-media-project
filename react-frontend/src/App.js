import React, { Component } from 'react';
import { Route, Switch, withRouter } from "react-router-dom";
import './App.css';
import DrawingPage from './containers/DrawingPage.js';
import DrawingContainer from "./containers/DrawingContainer";
import DrawingInfo from "./components/DrawingInfo";
import Nav from "./components/Nav.js";

class App extends Component {
  state={
    drawings: [],
    showInfo: false,
    clickedDrawing: [],
    types: []
  }

  componentDidMount(){
    fetch("http://localhost:3000/api/v1/drawings")
    .then(response=> response.json())
    .then(data=>{
      this.setState({
        drawings: data
      })
    })

    fetch('http://localhost:3000/api/v1/types')
    .then(response => response.json())
    .then(data =>{
      this.setState({
        types: data
      })
    })
  }

  clickHandler = (drawing) => {
    this.setState({
      showInfo: !this.state.showInfo,
      clickedDrawing: drawing.drawing
    })
  }

  closeHandler = () => {
    this.setState({
      showInfo: !this.state.showInfo,
      clickedDrawing: []
    })
  }

  deleteHandler = (drawing) => {
    console.log(drawing);
    
    fetch(`http://localhost:3000/api/v1/drawings/${drawing.id}`,{
      method: 'DELETE'
    }).then(response => response.json())
    .then(data => 
      this.setState({
        drawings: data, 
        showInfo: !this.state.showInfo
      })
    )

  }

  editSubmitHandler = (event, drawingInfo, drawing) => {
    event.preventDefault();

    fetch(`http://localhost:3000/api/v1/drawings/${drawing.id}`, {
      method: 'PATCH', 
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        title: drawingInfo.title,
        description: drawingInfo.description,
        artist: drawingInfo.artist
      })
    }) .then(response => response.json())
    .then(data => {
      let newDrawings = [...this.state.drawings]

      newDrawings = newDrawings.map(drawing => {
        if(drawing.id === data.id){
          return data
        } else {
          return drawing
        }
      })

      this.setState({
        drawings: newDrawings
      })
      
    })
    
    
  }

  submitHandler = (event, drawing) => {
    event.preventDefault();

    fetch('http://localhost:3000/api/v1/drawings', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: drawing.title,
        image: drawing.canvas, 
        description: drawing.description,
        artist: drawing.artist
      })
    })
    .then(response=>response.json())
    .then(data=> {
        let newDrawings = [...this.state.drawings, data]
        this.setState({
          drawings: newDrawings
        })

        drawing.pickedCategories.map(category => {
          fetch('http://localhost:3000/api/v1/types', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              drawing_id: data.id,
              category_id: category.id
            })
          }).then(response => response.json())
          .then(data => {
            let newTypes = [...this.state.types, data]
            this.setState({
              types: newTypes
            })            
            
          })
        })

    }).catch(error => console.log(error) )
    
  }

  render() {
    
    let drawings = this.state.drawings.map(drawing => 
      <DrawingContainer className="container" key={drawing.id} drawing={drawing} onClick={this.clickHandler} />
    )

    let drawPage = <DrawingPage onSubmit={this.submitHandler} />

    return (
      <div className="App">
        <Nav />
  
        {this.state.showInfo ? 
        <DrawingInfo 
        drawing={this.state.clickedDrawing} 
        types={this.state.types}
        onClick={this.closeHandler}
        deleteOnClick={this.deleteHandler}
        editOnSubmit={this.editSubmitHandler} /> 
        : null}

        <Switch>
          <Route exact path="/" render={() => drawings } />   
          <Route path="/drawingpage" render={()=> drawPage}/>
        </Switch>
        
      </div>
    );
  }
}

export default withRouter(App);
