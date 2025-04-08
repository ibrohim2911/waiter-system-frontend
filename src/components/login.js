import React, {useEffect} from "react";
import { Link } from 'react-router-dom';
export default function Header() {
        useEffect(() => {
          fetch("localhost:8000/", {
            method: 'GET',
            mode: 'cors',
            dataType: 'json',
            headers: {
              'Accept': 'application/json'
            }
          })
            .then((response) => response.json())
            .then((data) => {
              setAllProducts(data);
              setResults(data);
            })
            .catch((error) => {
              console.error(error);
            });
        }, [])
  return (
    <div>
        <div>
        <input placeholder="search"></input>
        <div className="boxed">
            <div className="boxess">name</div>
        </div>
        </div>
        <div>
            <p>login with phonenum and password</p>
        </div>




    </div>



  )}