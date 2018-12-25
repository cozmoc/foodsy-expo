import React from 'react';
import {View, Text, ListView} from 'react-native';
import { SearchBar } from 'react-native-elements';
import { getCities } from '../../services/locationService';

export default class SearchAddress extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      suggestions: null,
      value: ''
    }
  }

  onChangeText(text) {
    this.setState({
      value: text
    });
    getCities(text)
      .then((suggestions) => {
        if (!suggestions.length) {
          return;
        }
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({
          suggestions: ds.cloneWithRows(suggestions)
        });
      }).catch(e => {});
  }

  selected(text) {
    this.props.navigation.getParam('onChangeText')(text);
    this.props.navigation.goBack();
  }

  pressedEnter() {
    this.selected(this.state.value);
  }

  render() {
    const {suggestions} = this.state;
    return(
      <View style={{marginTop: 50}}>
        <SearchBar
          round
          lightTheme
          onChangeText={this.onChangeText.bind(this)}
          onClear={() => {}}
          placeholder='Type Here...'
          returnKeyType='search'
          autoFocus={true}
          onSubmitEditing={this.pressedEnter.bind(this)}
        />
        {suggestions && <ListView
          dataSource={suggestions}
          renderRow={(rowData) => <Text style={styles.row} onPress={_ => this.selected(rowData)}>{rowData}</Text>}  
        />}
      </View>
    )
  }
}

const styles = {
  row: {
    width: '100%',
    height: 50,
    fontSize: 25,
    color: 'white',
    backgroundColor: 'rgb(125, 125, 125)',
    borderColor: 'white',
    borderWidth: 1,
  }
};
