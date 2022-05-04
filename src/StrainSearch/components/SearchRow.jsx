/* eslint react/prop-types: 0 */
import React, {useState} from 'react';
import { IconButton } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import styles from '../styles.css'
import { Link } from 'react-router-dom';
import downloadStrainDocument from "../../commons/utils";

const SearchRow = ({strainName, strainId}) => {
  const [hovered, setHovered] = useState(false);

  return(
    <div
      className='search-row'
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/strain/${strainId}`} style={{color: 'black'}} target='_blank'>{strainName}</Link>
      {hovered &&
      <IconButton
        className='search-button-download'
        onClick={() => downloadStrainDocument(strainName, strainId)}
      >
        <DownloadIcon/>
      </IconButton>

      }
    </div>
  );
};

export default SearchRow;