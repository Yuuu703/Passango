import React from 'react';


function Modal(props){
  return (props.trigger)? (
    <div className="modal-overlay" >
      <div className="modal-content" >
        <button className="modal-close-btn" onClick={()=>props.setTrigger(false)}>
          ×
        </button>
        {props.children}
      </div>
    </div>
  ):"";
}

export default Modal;