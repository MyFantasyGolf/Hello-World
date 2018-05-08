import React from 'react';
import PropTypes from 'prop-types';

import isNil from 'lodash/isNil';

const PlayerRow = ({
  player,
  add,
  remove,
  move,
  drag,
  moveUpClicked,
  moveDownClicked,
  addClicked,
  removeClicked
}) => {
  const buttons = [];

  if (move === true) {
    buttons.push(
      <span key="up" className="golf-icons-chevron-up"
        onClick={ () => {
          moveUpClicked(player);
        }}/>
    );
    buttons.push(
      <span key="down"
        className="golf-icons-chevron-down"
        onClick={ () => {
          moveDownClicked(player);
        }}/>
    );
  }

  if (add === true) {
    buttons.push(
      <span key="add" className="golf-icons-plus2"
        onClick={ () => {
          addClicked(player);
        }}/>
    );
  }

  if (remove === true) {
    buttons.push(
      <span key="remove" className="golf-icons-cross2"
        onClick={ () => {
          removeClicked(player);
        }}/>
    );
  }

  const playerString = isNil(player.lastName) ?
    player.firstName :
    `${player.lastName}, ${player.firstName}`;

  return (
    <div className="player" draggable={drag}>
      <div>{playerString}</div>
      <div className="buttons">
        { buttons }
      </div>
    </div>
  );
};

PlayerRow.propTypes = {
  player: PropTypes.shape({
    lastName: PropTypes.string,
    firstName: PropTypes.string
  }),
  add: PropTypes.bool,
  remove: PropTypes.bool,
  move: PropTypes.bool,
  drag: PropTypes.bool,
  addClicked: PropTypes.func,
  removeClicked: PropTypes.func,
  moveUpClicked: PropTypes.func,
  moveDownClicked: PropTypes.func
};

PlayerRow.defaultProps = {
  add: false,
  remove: false,
  move: true,
  drag: true,
  addClicked: () => {},
  removeClicked: () => {},
  moveUpClicked: () => {},
  moveDownClicked: () => {}
};

export default PlayerRow;
