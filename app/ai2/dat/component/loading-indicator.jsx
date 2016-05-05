'use strict';

const React = require('react');

class LoadingIndicator extends React.Component {
  render() {
    return (
      <svg  xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            width="32px"
            height="32px"
            fill="#2a75a1"
            className="loading-indicator">
        <path opacity=".25" d="M16 0 A16 16 0 0 0 16 32 A16 16 0 0 0 16 0 M16 4 A12 12 0 0 1 16 28 A12 12 0 0 1 16 4" />
        <path className="loading-indicator-progress" d="M16 0 A16 16 0 0 1 32 16 L28 16 A12 12 0 0 0 16 4z" />
      </svg>
    );
  }
}

module.exports = LoadingIndicator;