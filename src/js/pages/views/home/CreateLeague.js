import React from 'react';
import PropTypes from 'prop-types';

import inject from '../../../services/inject';
import {
  withRouter
} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SuggestBox from '../../../widgets/SuggestBox';

@inject('LeagueService', 'AuthService')
class CreateLeague extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      invitations: [],
      leagueName: '',
      activeGolfers: 4,
      selections: [],
      searchString: '',
      teamName: '',
      userList: []
    };
  }

  async componentDidMount() {
    const users = await this.props.AuthService.getUsers();

    this.setState({
      ...this.state,
      userList: users.users
    });
  }

  activeGolfersChanged = ($event) => {
    this.setState({
      ...this.state,
      activeGolfers: $event.target.value
    });
  }

  leagueNameChanged = ($event) => {
    this.setState({
      ...this.state,
      leagueName: $event.target.value
    });
  }

  teamNameChanged = ($event) => {
    this.setState({
      ...this.state,
      teamName: $event.target.value
    });
  }

  searchStringChanged = ($event) => {
    this.setState({
      ...this.state,
      searchString: $event.target.value
    });
  }

  getSuggestions = () => {
    return this.state.userList.map( (user) => {
      return {
        value: user._id,
        label: `${user.name} (${user.email})`
      };
    });
  }

  selectionAdded = (selection) => {

    this.state.selections.push(selection);

    this.setState({
      ...this.state,
      selections: this.state.selections,
      searchString: ''
    });
  }

  selectionRemoved = (selection) => {
    const selectionIndex = this.state.selections.findIndex( (item) => {
      return item.value === selection.value;
    });

    if (selectionIndex === -1) {
      return;
    }

    const newList = this.state.selections;
    newList.splice(selectionIndex, 1);

    this.setState({
      ...this.state,
      selections: newList
    });
  }

  createLeague = async () => {

    const leagueObj = {
      name: this.state.leagueName,
      commissioner: {
        id: this.props.AuthService.me._id,
        name: this.props.AuthService.me.name
      },
      activeGolfers: this.state.activeGolfers,
      invitations: this.state.selections.map( (sel) => {
        return { email: sel.label.trim(), id: sel.value.trim() };
      }),
      teams: [
        {
          user: this.props.AuthService.me._id,
          name: this.state.teamName,
          currentRoster: [],
          draftList: []
        }
      ]
    };

    await this.props.LeagueService.createLeague(leagueObj);

    this.props.history.push('/mfg/home');
  }

  render() {
    return (
      <div className="create-league page">
        <div className="title">
          Create a League
        </div>
        <div className="field">
          <TextField
            label="League Name"
            value={this.state.leagueName}
            onChange={this.leagueNameChanged}
            fullWidth={true}
          />
        </div>
        <div className="field">
          <TextField
            label="Active Golfers Per Tournament"
            value={this.state.activeGolfers}
            onChange={this.activeGolfersChanged}
            type="number"
            fullWidth={true}
          />
        </div>
        <div className="field">
          <SuggestBox
            label="Invite Friends"
            fullWidth={true}
            searchString={this.state.searchString}
            suggestions={this.getSuggestions}
            searchStringChanged={this.searchStringChanged}
            selectionAdded={this.selectionAdded}
            selectionRemoved={this.selectionRemoved}
            selections={this.state.selections}
          />
        </div>
        <div className="field">
          <TextField
            label="My Team Name"
            fullWidth={true}
            value={this.state.teamName}
            onChange={this.teamNameChanged}
          />
        </div>
        <Button
          variant="raised"
          color="primary"
          onClick={this.createLeague}
        >
          Create League
        </Button>
      </div>
    );
  }
}

CreateLeague.propTypes = {
  history: PropTypes.object,
  AuthService: PropTypes.object,
  LeagueService: PropTypes.object
};

export default withRouter(CreateLeague);
