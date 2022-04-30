import React from "react";
import {utilsList} from "./constants";
import UtilListElement from "./components/UtilListelement.jsx";
import PageHeader from "../commons/components/PageHeader";

const Utils = () => {
  return(
    <div>
      <PageHeader header='Служебные утилиты:'/>
      {
        utilsList.map((util, index) => {
          return (<UtilListElement label={util.label} link={util.link} key={`util-${index}`}/>)
        })
      }
    </div>
  )
}

export default Utils;