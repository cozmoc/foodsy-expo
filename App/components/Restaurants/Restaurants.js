import React from 'react';
import Carousel from 'react-native-snap-carousel';
import { View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Restaurant from '../Restaurant/Restaurant';
import { getAddress } from '../../services/locationService';

import { Query } from 'react-apollo';
import { RESTAURANT_SEARCH_QUERY } from '../../graphql/queries';
import { AsyncStorage } from "react-native"

export default class Restaurants extends React.Component {
  state = {
    activeSlide: 0,
    bookmarks: [],
    address: '1260 6th Ave, New York, NY 10020'
  };

  _renderItem({item, index}, parallaxProps, putBookmark, bookmarks) {
    return <Restaurant
      item={item}
      index={index}
      parallaxProps={parallaxProps}
      bookmark={putBookmark}
      bookmarks={bookmarks}
    />
  }

  async putBookmark(bookmark) {
    try {
      let newBookmarks;
      if (this.state.bookmarks.includes(bookmark)) {
          newBookmarks = [
            ...this.state.bookmarks.filter(bkm => bkm !== bookmark)
          ];
      } else {
          newBookmarks = [
            ...this.state.bookmarks,
            bookmark
          ];
      }
      this.setState({
        bookmarks: newBookmarks
      });
      await AsyncStorage.setItem('BOOKMARKS', JSON.stringify(newBookmarks));
    } catch (error) {
      // Error saving data
    }
  }

  async getBookmarks() {
    try {
      const value = await AsyncStorage.getItem('BOOKMARKS');
      if(value !== null) {
        this.setState({
          bookmarks: JSON.parse(value)
        });
      }
     } catch (error) {
       // Error retrieving data
     }
  }

  showSearch() {
    this.props.navigation.push('Search', {
      onChangeText: this.onChangeText.bind(this)
    });
  }

  onChangeText(text) {
    this.setState({
      address: text
    });
  }

  componentDidMount() {
    this.getBookmarks();
    navigator.geolocation.getCurrentPosition(
      position => {
        getAddress(position.coords.latitude, position.coords.longitude)
          .then(res => {
            if (res.address) {
              this.onChangeText(
                res.address.building +
                res.address.road +
                res.address.city
              );
            }
          })
      },
      _ => {},
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );    
  }

  retry() {
    this.setState({
      address: this.state.address + ' '
    });
  }

  render() {
    const { address } = this.state;

    return (
      <View style={{paddingTop: 50}}>
        <View style={styles.header}>
          <View>
            <Text style={{fontSize: 20}}>Foodsy</Text>
          </View>
          <View>
            <Icon onPress={() => this.showSearch()} name='md-search' size={20} color='#010a3a'/>
          </View>
        </View>
        <View style={styles.status}>
          <View>
            <Text>
              <Icon name='md-calendar' size={20} color='#010a3a'/>
              &nbsp;
              Tomorrow
            </Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', width: 100}}>
            <View>
              <Text>
                <Icon name='md-people' size={20} color='#010a3a'/>
                &nbsp;
                5
              </Text>
            </View>
            <View>
              <Text>
                <Icon name='md-time' size={20} color='#010a3a'/>
                &nbsp;
                7pm
              </Text>
            </View>
          </View>
        </View>
        <Query
          query={RESTAURANT_SEARCH_QUERY}
          variables={{
            address
          }}
        >
          {({ loading, error, data = {} }) => {
            if (loading) {
              return (
                <View style={{ width: '100%', paddingVertical: 10 }}>
                  <ActivityIndicator size="large" style={{ padding: 30 }} />
                </View>
              );
            }

            if (data.search_restaurants && data.search_restaurants.results && data.search_restaurants.results.length > 0) {
              return (
                <View style={{alignItems: 'center', marginTop: 80}}>
                  <Carousel
                    ref={(c) => { this._carousel = c; }}
                    data={data.search_restaurants.results}
                    hasParallaxImages={true}
                    renderItem={(it, pr) => this._renderItem(it, pr, this.putBookmark.bind(this), this.state.bookmarks)}
                    sliderWidth={400}
                    itemWidth={300}
                    onSnapToItem={(index) => this.setState({ activeSlide: index }) }
                  />
                </View>
              );
            }

            // No Data Return
            return (
              <View style={{ marginTop: '50%', justifyContent: 'space-between', flex: 1 }}>
                <View style={{alignSelf: 'center'}}>
                  <Text>Uh oh! No internet connection. <Icon name='md-sad' size={20}/></Text>
                </View>
                <TouchableOpacity onPress={this.retry.bind(this)} style={{alignSelf: 'center', color: '#5D88F8'}}>
                  <Text>Retry</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        </Query>
      </View>
    );
  }
}

const styles = {
  header: {
    position: 'absolute',
    width: '100%',
    marginTop: 40,
    justifyContent: 'space-between',
    flex: 1,
    flexDirection: 'row',
    padding: 5
  },
  status: {
    position: 'absolute',
    width: '100%',
    marginTop: 80,
    justifyContent: 'space-between',
    flex: 1,
    flexDirection: 'row',
    padding: 5
  }
};
