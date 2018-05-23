import React from 'react';
import PropTypes from 'prop-types';

import isFunction from 'lodash/isFunction';
import isNil from 'lodash/isNil';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';

class SuggestBox extends React.Component {

  visibleItems = [];

  constructor(props) {
    super(props);

    this.state = {
      selectedSuggestion: null
    };
  }

  getSelections() {
    return this.props.selections.map( (item, index) => {
      return (
        <Chip
          label={item.label}
          onDelete={() => { this.props.selectionRemoved(item); }}
          key={index}
        />
      );
    });
  }

  keyUp = ($event) => {
    const code = $event.keyCode;

    if (code === 13 && !isNil(this.selectedSuggestion)) {
      this.props.selectionAdded(this.getItemFromSelection());
      return;
    }
    else if (code === 13) {
      this.props.selectionAdded({label: this.props.searchString});
      return;
    }

    if (code !== 38 && code !== 40) {
      return;
    }

    const currentIndex = this.visibleItems.findIndex( (item) => {
      return item.value === this.state.selectedSuggestion;
    });

    const newIndex =
      currentIndex === -1 ?
        0
        :
        code === 40 ?
          currentIndex < this.visibleItems.length ?
            currentIndex + 1 : currentIndex
          :
          currentIndex > 0 ?
            currentIndex - 1 : currentIndex;

    this.setState({
      ...this.state,
      selectedSuggestion: this.visibleItems[newIndex].value
    });
  }

  getItemFromSelection = () => {
    return this.visibleItems.find( (item) => {
      return item.value === this.state.selectedSuggestion;
    });
  }

  itemHovered = ($event) => {
    this.setState({
      ...this.state,
      selectedSuggestion: $event.target.value
    });
  }

  itemClicked = (item) => {
    this.setState({
      ...this.state,
      selectedSuggestion: item
    },
    () => {
      this.props.selectionAdded(this.state.selectedSuggestion);
    });
  }

  searchTyped = ($event) => {
    this.props.searchStringChanged($event);
  }

  getSuggestionList() {

    if (this.props.searchString.length < 2) {
      return;
    }

    const suggestions = isFunction(this.props.suggestions) ?
      this.props.suggestions(this.props.searchString) :
      this.props.suggestions;

    this.visibleItems = suggestions
      .filter( (option) => {
        const alreadyPicked = this.props.selections.find( (sel) => {
          return sel.value === option.value;
        });

        if (!isNil(alreadyPicked)) {
          return false;
        }

        return option.label.toLowerCase().indexOf(
          this.props.searchString.toLowerCase()) !== -1;
      });

    const itemList = this.visibleItems.map( (o, index) => {
      return (
        <MenuItem
          onMouseOver={this.itemHovered}
          onMouseLeave={this.itemLeft}
          onClick={() => { this.itemClicked(o); }}
          component="div"
          key={`${o.label}-${index}`}
          selected={o.value === this.state.selectedSuggestion}
        >
          {o.label}
        </MenuItem>
      );
    });

    return itemList.length === 0 ?
      <span /> :
      (
        <Paper className="list-items" square>
          { itemList }
        </Paper>
      );
  }

  render() {

    return (
      <div className="suggest-box">
        <TextField
          label={this.props.label}
          fullWidth={this.props.fullWidth}
          multiline
          value={this.props.searchString}
          onChange={this.searchTyped}
          onKeyUp={this.keyUp}
        />
        <div className="selected-list">
          { this.getSelections() }
        </div>
        { this.getSuggestionList() }
      </div>
    );
  }
}

SuggestBox.propTypes = {
  selections: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any,
      label: PropTypes.string
    })
  ),
  searchString: PropTypes.string,
  searchStringChanged: PropTypes.func,
  selectionAdded: PropTypes.func,
  selectionRemoved: PropTypes.func,
  suggestions: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.func
  ]),
  label: PropTypes.string,
  fullWidth: PropTypes.bool
};

SuggestBox.defaultTypes = {
  fullWidth: false
};

export default SuggestBox;
