import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation';
import SplashScreen from './app/components/Splash/SplashScreen';
import Home from './app/components/Home';
import ClockInOut from './app/components/ClockInOut';

const AppNavigator = createStackNavigator({clockInOut: ClockInOut, home: Home});

// const AppContainer = createAppContainer(AppNavigator);
// export default AppContainer
const InitialNavigator = createSwitchNavigator({
    Splash: SplashScreen,
    App: AppNavigator
  });

export default createAppContainer(InitialNavigator);