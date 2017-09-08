import React from 'react';
import { Text, View, Dimensions, ScrollView } from 'react-native';
import { ScreenOrientation, Video } from 'expo';
import _ from 'lodash';
import { connect } from 'react-redux';
import VideoPlayer from 'abi-expo-videoplayer';
import axios from 'axios';
import subplay from 'subplay';

import Subtitle from '../components/Subtitle';
import { RegularText } from '../components/Texts';
import Row from '../components/Row';
import Analytics from '../utils/Analytics';
import styles from '../styles/style';
import colors from '../styles/colors';
import Downloader from '../components/Downloader';
import RateSwitcher from '../components/RateSwitcher';
import config from '../utils/config';

const TRACK_IMAGE = require('../assets/videoplayer/track.png');
const THUMB_IMAGE = require('../assets/videoplayer/thumb.png');

import { Foundation, MaterialIcons } from '@expo/vector-icons';
const ICON_COLOR = colors.tertiary;
const CENTER_ICON_SIZE = 36;
const BOTTOM_BAR_ICON_SIZE = 30;

const PlayIcon = () =>
  <Foundation
    name={'play'}
    size={CENTER_ICON_SIZE}
    color={ICON_COLOR}
    style={{ textAlign: 'center' }}
  />;

const PauseIcon = () =>
  <Foundation
    name={'pause'}
    size={CENTER_ICON_SIZE}
    color={ICON_COLOR}
    style={{ textAlign: 'center' }}
  />;

export const FullscreenEnterIcon = () =>
  <MaterialIcons
    name={'fullscreen'}
    size={BOTTOM_BAR_ICON_SIZE}
    color={ICON_COLOR}
    style={{ textAlign: 'center' }}
  />;

export const FullscreenExitIcon = () =>
  <MaterialIcons
    name={'fullscreen-exit'}
    size={BOTTOM_BAR_ICON_SIZE}
    color={ICON_COLOR}
    style={{ textAlign: 'center' }}
  />;

export const ReplayIcon = () =>
  <MaterialIcons
    name={'replay'}
    size={CENTER_ICON_SIZE}
    color={ICON_COLOR}
    style={{ textAlign: 'center' }}
  />;

class WeekScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `Week ${navigation.state.params.weekNum}`,
    headerTintColor: styles.headerTintColor,
    headerTitleStyle: styles.headerTitleStyle,
    headerStyle: navigation.state.params.hideHeader
      ? { display: 'none', opacity: 0 }
      : styles.headerStyle,
  });

  constructor(props) {
    super(props);

    const data = this.props.navigation.state.params.data;
    const linkKeys = ['slides', 'source code', 'notes'];
    const links = _.pickBy(data, (v, k) => linkKeys.includes(k));

    const ICONS = {
      notes: 'sticky-note-o',
      slides: 'slideshare',
      'source code': 'code',
    };

    const linksArr = _.map(links, (url, title) => ({
      title,
      url,
      icon: ICONS[title],
    }));

    this.state = {
      isPortrait: true,
      localVideoUri: null,
      data,
      links,
      linksArr,
      playFromPositionMillis: this.props.playback,
      encodedSubtitleText: '',
      subtitlesVisible: false,
    };
  }

  orientationChangeHandler(dims) {
    const { width, height } = dims.window;
    const isLandscape = width > height;
    this.setState({ isPortrait: !isLandscape });
    this.props.navigation.setParams({ hideHeader: isLandscape });
    // TODO: Why?
    ScreenOrientation.allow(ScreenOrientation.Orientation.ALL);
  }

  // Only on this screen, allow landscape orientations
  async componentDidMount() {
    ScreenOrientation.allow(ScreenOrientation.Orientation.ALL);
    Dimensions.addEventListener(
      'change',
      this.orientationChangeHandler.bind(this)
    );
    Analytics.track(Analytics.events.USER_WATCHED_VIDEO);
    const result = await axios.get(this.state.data.subtitles);
    const srt = result.data;
    this._updateSubtitles = subplay(
      srt,
      encodedSubtitleText => {
        this.setState({ encodedSubtitleText });
      },
      { millis: true }
    );
  }

  componentWillUnmount() {
    ScreenOrientation.allow(ScreenOrientation.Orientation.PORTRAIT);
    Dimensions.removeEventListener('change', this.orientationChangeHandler);
  }

  switchToLandscape() {
    ScreenOrientation.allow(ScreenOrientation.Orientation.LANDSCAPE);
  }

  switchToPortrait() {
    ScreenOrientation.allow(ScreenOrientation.Orientation.PORTRAIT);
  }

  _playbackCallback(playbackStatus) {
    if (playbackStatus.isLoaded) {
      this.props.updatePlaybackTime(playbackStatus.positionMillis);
    }
    this._updateSubtitles(playbackStatus.positionMillis, true, false, playbackStatus.isPlaying);
  }

  _errorCallback(error) {
    // TODO: Send to Sentry
    console.log('Error: ', error.message, error.type, error.obj);
  }

  onRowPress = (url, title) => {
    this.props.navigation.navigate('Link', { url, title: _.capitalize(title) });
  };

  changeRate(rate) {
    this._playbackInstance &&
      this._playbackInstance.setStatusAsync({
        rate: rate,
        shouldCorrectPitch: true,
      });
  }

  render() {
    // Video player sources
    // Example HLS url: https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8

    return (
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'column',
          minHeight: Dimensions.get('window').height,
          backgroundColor: 'white',
        }}>
        <View style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').width * 9 / 16 + this.state.isPortrait*100,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Subtitle
            visible={this.state.subtitlesVisible && this.state.isPortrait}
            textStyle={{
              textAlign: 'center',
              fontWeight: 'bold'
            }}
            encodedText={this.state.encodedSubtitleText}
          />
          <VideoPlayer
            videoProps={{
              shouldPlay: config.autoplayVideo,
              isMuted: config.muteVideo,
              resizeMode: Video.RESIZE_MODE_CONTAIN,
              source: {
                uri: this.state.data.videos['360p'],
              },
              ref: component => {
                this._playbackInstance = component;
              },
            }}
            isPortrait={this.state.isPortrait}
            switchToLandscape={this.switchToLandscape.bind(this)}
            switchToPortrait={this.switchToPortrait.bind(this)}
            playbackCallback={this._playbackCallback.bind(this)}
            errorCallback={this._errorCallback.bind(this)}
            thumbImage={THUMB_IMAGE}
            trackImage={TRACK_IMAGE}
            playIcon={PlayIcon}
            pauseIcon={PauseIcon}
            fullscreenEnterIcon={FullscreenEnterIcon}
            fullscreenExitIcon={FullscreenExitIcon}
            replayIcon={ReplayIcon}
            textStyle={{
              color: colors.tertiary,
              fontFamily: 'custom-regular',
              textAlign: 'left',
              fontSize: 12,
            }}
          />
        </View>
        <View
          style={{
            height: 50,
            width: Dimensions.get('window').width,
            backgroundColor: this.state.subtitlesVisible ? colors.tertiary : colors.primary,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onTouchStart={() => {
            this.setState({ subtitlesVisible: true });
          }}
          onTouchEnd={() => {
            this.setState({ subtitlesVisible: false });
          }}
        >
          <RegularText style={{
            color: this.state.subtitlesVisible ? colors.primary : '#ffffff'
          }}>
            {this.state.subtitlesVisible ? 'Hide Russian' : 'Show Russian'}
          </RegularText>
        </View>
        <ScrollView
          contentContainerStyle={{
            justifyContent: 'space-between',
            flexDirection: 'column',
            display: this.state.isPortrait ? 'flex' : 'none',
            backgroundColor: 'white',
          }}>
          <Text
            style={[
              styles.h1Style,
              styles.mainViewStyle,
              { marginTop: 20, marginBottom: 20 },
            ]}>
            Lesson Notes
          </Text>

          {this.state.linksArr.map(({ title, url, icon }) =>
            <Row
              key={title}
              text={title}
              icon={icon}
              onPress={this.onRowPress.bind(this, url, title)}
              style={{
                alignSelf: 'stretch',
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            />
          )}
        </ScrollView>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updatePlaybackTime: time => {
      dispatch({
        type: 'PLAYBACK',
        id: ownProps.navigation.state.params.data.weekNumber,
        time,
      });
    },
  };
};

const mapStateToProps = (state, ownProps) => {
  return {
    playback: state.playback[ownProps.navigation.state.params.data.weekNumber],
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WeekScreen);
