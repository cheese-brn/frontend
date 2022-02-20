import React from "react";

const CenteredElement = ({children}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      {children}
    </div>
  )
}

export default CenteredElement;