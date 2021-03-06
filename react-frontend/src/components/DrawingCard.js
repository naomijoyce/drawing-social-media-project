import React from 'react';

const DrawingCard = (props) => {
  const {drawing, onClick} =props
  return (
    <div className="drawing" onClick={()=> onClick({drawing})}>
      <img src={drawing.image} alt=""/>
      <h4>{drawing.title}</h4>
      <i>by {drawing.artist}</i>
    </div>
  );
};

export default DrawingCard;