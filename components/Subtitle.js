import React, { Component } from 'react';
import { View, Text } from 'react-native';

const colors = {
  r: 'rgb(206, 44, 5)',
  g: 'rgb(0, 146, 47)',
  b: 'rgb(0, 116, 200)',
  o: 'rgb(228, 116, 16)',
  k: 'black'
};

const positions = {
  u: {
    top: 0,
    height: 50,
    justifyContent: 'flex-end'
  },
  d: {
    bottom: 0,
    height: 50,
    justifyContent: 'flex-start'
  }
};

class SubtitleLine extends Component {
  _parse(encodedText) {
    const encodedWords = encodedText.split(/\s/);
    return encodedWords.map((word, index) =>
      <Text key={index} style={{ color: colors[word[0]], fontSize: 20 }}>
        {word.substr(1)}{' '}
      </Text>
    );
  }

  render() {
    return (
      <View style={{ width: '100%' }}>
        <Text style={this.props.textStyle}>
          {this._parse(this.props.encodedText)}
        </Text>
      </View>
    );
  }
}

class SubtitleBlock extends Component {
  _parse(encodedText) {
    const lines = encodedText.split(/\n/);
    return lines.map((encodedText, index) =>
      <SubtitleLine key={index} encodedText={encodedText} textStyle={this.props.textStyle} />
    );
  }

  render() {
    return (
      <View
        style={[
          {
            position: 'absolute',
            width: '100%',
            backgroundColor: 'transparent'
          },
          positions[this.props.encodedText[0]]
        ]}
      >
        {this._parse(this.props.encodedText.substr(1))}
      </View>
    );
  }
}

export default class Subtitle extends Component {
  _parse(encodedText) {
    const encodedBlocks = encodedText.split(/[\s](?=[ud])/);
    return encodedBlocks.map((encodedText, index) =>
      <SubtitleBlock
        key={index}
        textStyle={this.props.textStyle}
        encodedText={encodedText}
      />
    );
  }

  render() {
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          opacity: this.props.visible ? 1 : 0
        }}
      >
        {this._parse(this.props.encodedText)}
      </View>
    );
  }
}
