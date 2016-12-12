import * as React from "react";
import { StyleSheet, View, Text } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export class Home extends React.Component<{}, {}> {
    public render(): JSX.Element {
        return (
            <View style={styles.container}>
              <Text>Hello World</Text>
            </View>
        );
    }
}
