import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './src/screens/Home';
import strings from './src/res/strings';
import AddItem from './src/screens/AddItem';
import List from './src/screens/List';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name={strings.screens.home} component={Home} />
        <Stack.Screen name={strings.screens.add_item} component={AddItem} />
        <Stack.Screen name={strings.screens.list} component={List} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
