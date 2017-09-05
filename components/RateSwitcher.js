import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';

import styles from '../styles/style';
import colors from '../styles/colors';
import { RegularText } from './Texts';

class RateSwitcher extends React.Component {
  state = {
    rate: 1,
  };

  render() {
    const rates = {
      '0.5': 0.5,
      '1': 1.5,
      '1.5': 2,
      '2': 1,
    };

    return (
      <TouchableHighlight
        style={{
          borderRadius: 5,
          padding: 5,
          borderWidth: 1,
          borderColor: colors.tertiary,
        }}
        onPress={() => {
          const nextRate = rates[this.state.rate.toString()];
          this.props.changeRate(nextRate);
          this.setState({ rate: nextRate });
        }}>
        <View
          style={{
            width: 30,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <RegularText
            style={{
              fontSize: styles.fontSize(0),
              color: colors.tertiary,
            }}>
            {this.state.rate + 'x'}
          </RegularText>
        </View>
      </TouchableHighlight>
    );
  }
}

export default RateSwitcher;
