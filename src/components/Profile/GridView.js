import React from 'react';
import { useHistory } from 'react-router-dom';
import './styles/GridView.css';

const GridView = (props) => {

    const history = useHistory();

    function viewPost(id) {
        history.push("/posts/false/" + id);
    }

    function Photo(cvalue, index) {
        return (
            <div key={index} className="item">
                <img src={cvalue.image} alt={cvalue.id} onClick={() => viewPost(cvalue.postid)} />
            </div>
        );
    }

    if(Photo){
        return (
            <div className="grid-container">
                {props.img.map(Photo)}
            </div>
        );
    }else{
        return (
            <p>No posts to show.</p>
        );
    }
   
}

export default GridView;