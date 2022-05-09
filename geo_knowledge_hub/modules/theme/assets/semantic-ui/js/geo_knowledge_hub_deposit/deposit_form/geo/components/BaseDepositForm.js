import { Component } from "react";


export class BaseDepositForm extends Component {
    constructor(props) {  
      super(props);

      // defining configuration properties
      this.depositConfigHandler = props.depositConfigHandler || {};
      this.libraryVocabulariesHandler = props.libraryVocabulariesHandler || {};
    }
};
