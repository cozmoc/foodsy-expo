import React from 'react';
import { ParallaxImage } from 'react-native-snap-carousel';
import {View, Text, Linking, TouchableOpacity, TouchableHighlight, Dimensions} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Icon } from 'react-native-elements';

export default class Restaurant extends React.Component {
  
  state = {
    currentImage: 0
  }

  componentWillMount() {
    this.item = this.props.item;
    if (!(this.item.images && this.item.images.length)) {
      this.item.images = [
        'https://i.pinimg.com/originals/1a/cc/f8/1accf85b8996a5e64e46610e15d5dd9b.jpg'
      ];
    }
  }

  changeImage(e) {
    let pWidth = Dimensions.get('window').width;
    let x = e.nativeEvent.locationX + 50;
    if(pWidth/2 > x) {
      //left
      if (this.item.images[this.state.currentImage + 1]) {
        this.setState({
          currentImage: this.state.currentImage + 1
        });  
      } else {
        this.setState({
          currentImage: 0
        });
      }
    } else {
      //right
      if (this.item.images[this.state.currentImage - 1]) {
        this.setState({
          currentImage: this.state.currentImage - 1
        });  
      } else {
        this.setState({
          currentImage: this.item.images.length - 1
        });
      }
    }
  }

  render() {
    const { index, parallaxProps, bookmark, bookmarks } = this.props;
    const { currentImage } = this.state;
    const { item } = this;

    const time = calcTime(item.open_closed, item.hours);
    const walkingSpeedInOneMinute = 0.0521952; //miles
    const header = item.description ? item.description.replace(item.title, '').replace(/[^\w\s]/gi, '') : item.title;

    return (
      <View>
        <View style={[styles.heads, {backgroundColor: bookmarks.includes(item.id) ? '#5D88F8' : 'white' }]}>
          <Text style={[styles.heading, {color: bookmarks.includes(item.id) ? 'white' : '#5D88F8' }]} numberOfLines={1}>
            {header}
          </Text>
          <View style={[
            styles.heading, {
              backgroundColor: 'white',
              borderRadius: 50,
              width: 25,
              height: 25,
              marginRight: 5
            }
          ]}>
            <Icon
              name='pin'
              type='entypo'
              color='#5D88F8'
              size={18}
              onPress={() => bookmark(item.id)}
            />
          </View>
        </View>

        <View style={styles.tags}>
          <View style={styles.category}>
            <Text>
              <IonIcon name='md-walk' size={20} color='#5D88F8'/>
              &nbsp;
              {Math.ceil(item.distance / walkingSpeedInOneMinute)}min
            </Text>
          </View>
          <View style={styles.category}>
            <Text>
              <IonIcon name='md-cash' size={20} color='#5D88F8'/>
              &nbsp;
              10-15
            </Text>
          </View>
          <View style={styles.category}>
            <Text>
              <IonIcon name='ios-star' size={20} color='#5D88F8'/>
              &nbsp;
              {item.rating}
            </Text>
          </View>
          <View style={styles.category}>
            <Text>
              <IonIcon name='md-heart' size={20} color='#5D88F8'/>
              &nbsp;
              {item.references.length}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={this.changeImage.bind(this)} activeOpacity={0.95} style={{ height: '100%' }}>
          <ParallaxImage
            source={{ uri: item.images[currentImage] }}
            containerStyle={styles.imageContainer}
            dimensions={{ width: 350, height: '85%' }}
            style={styles.image}
            parallaxFactor={0.4}
            showSpinner={true}
            {...parallaxProps}
          />
          <Text style={styles.imageTitle} numberOfLines={2}>
            <IonIcon name='md-pin' size={20} />
            &nbsp;
            {item.title}
          </Text>
          <Text style={styles.timeTitle} numberOfLines={2}>
            {time}
          </Text>
          <Text style={styles.imageNote} numberOfLines={2}>
            <IonIcon name='ios-checkmark-circle' size={15} />
            &nbsp;
            {item.rating > 4 ? 'Great Value' : 'Not Busy'}
          </Text>
          {item.references && item.references.length && <Text style={styles.imageReviews} numberOfLines={2}>
            <IonIcon name='ios-star' size={15} />
            &nbsp;
            Featured in {
              item.references.length > 2 ? `${item.references[0].site_name}, ${item.references[1].site_name}, and ${item.references.length - 1} others`:
              (item.references.length == 2 ? `${item.references[0].site_name} and ${item.references[1].site_name}` : item.references[0].site_name)
            }
          </Text>}
        </TouchableOpacity>

        <View style={styles.foots}>
          <View style={styles.category}>
            <TouchableOpacity onPress={() => Linking.openURL(`tel://${item.phone}`)}>
              <Text style={{color: '#5D88F8'}}>Call</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.category}>
            <TouchableOpacity onPress={() => Linking.openURL(`https://www.google.com/maps/@${item.lat},${item.lon},13z`)}>
              <Text style={{color: '#5D88F8'}}>
                {Math.floor(item.distance*100)/100} miles away
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.category}>
            <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
              <Text style={{color: '#5D88F8'}}>Reserve</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  }
}

function calcTime(open_closed, time) {
  if (!time) {
    return new Date().getHours();
  }
  const dayLookups = [
    'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'
  ];
  const today = dayLookups[new Date().getDay()];
  let militaryTime = time.slice(time.indexOf(today) + 4, time.indexOf(today) + 13).split('-')[open_closed === 'Open now' ? 1 : 0].replace(/./g, function (v, i) {
    return i === 1 ? v + ':' : v;
  }).split(':');
  let finalTime = (militaryTime[0] > 12) ? (militaryTime[0] - 12) + ':' + militaryTime[1] + 'pm' : militaryTime.join(':') + 'am';
  return open_closed === 'Open now' ? 'Closes at ' + finalTime : 'Opens at ' + finalTime;
}

const styles = {
  image: {
    marginTop: '-30%',
  },
  imageTitle: {
    top: '-70%',
    fontSize: 20,
    padding: 20,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  timeTitle: {
    top: '-69%',
    fontSize: 15,
    marginTop: -20,
    paddingLeft: 20,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  imageNote: {
    top: '-40%',
    fontSize: 15,
    color: 'white',
    padding: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  imageReviews: {
    top: '-39%',
    fontSize: 15,
    marginTop: -20,
    paddingLeft: 20,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  heads: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomColor: '#5D88F8',
    borderBottomWidth: 1,
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 45,
  },
  foots: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    position: 'absolute',
    width: 300,
    top: '72%',
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  category: {
    backgroundColor: 'white',
    height: 20,
  },
  heading: {
    marginTop: 10,
    height: 40,
    padding: 5,
    maxWidth: 270
  },
  tags: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 10,
  },
  description: {
    position: 'absolute',
    width: 300,
    top: '80%',
    textAlign: 'center',
    color: '#2e084c'
  }
};
