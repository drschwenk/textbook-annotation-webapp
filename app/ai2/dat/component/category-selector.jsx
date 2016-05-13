'use strict';

const React = require('react');

const AnnotationManager = require('../model/annotation-manager');
// const Annotator = require('./annotator.jsx');

class CategorySelector extends React.Component {

    doStuff(){
        console.log('stuff');
    }

    render() {
        return (
            <div className="annotation-pane-overlay">
                <div className="annotation-pane-dialog">
                    <div className="annotation-pane-dialog-header flex-row">
                        <span>Select Category</span>
                        <a className="icon-x flex-align-right"
                           onClick={this.doStuff()}></a>
                    </div>
                    <div className="annotation-pane-dialog-content">
                        <p>
                            <input type="text"
                                   onChange={this.doStuff()}
                                   onKeyDown={this.doStuff()}
                                   ref="text"/>
                        </p>
                        <button onClick={this.doStuff()} className="btn-green">Definition</button>
                    </div>
                </div>
            </div>
        );
    }

    // render() {
    //     return (
    //         <div>
    //
    //         </div>
    //     );
    // }

}

module.exports = CategorySelector;