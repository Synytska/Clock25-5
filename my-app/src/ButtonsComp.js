import React from "react";

const ButtonsComp = (prop) => {
return (
    <>
    <button id={prop.id} onClick={prop.onClick}>
            {prop.text}
          </button>
    
    </>
)
}

export default ButtonsComp;