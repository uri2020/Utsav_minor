import React from 'react';
import '../App.css';
import TabNav from './TabNav';
import Tab from './Tab';
class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        selected: 'Home'
      }
    }
    setSelected = (tab) => {
      this.setState({ selected: tab });
    }
    render() {
      return (
        <div className="App mt-4">
          <TabNav tabs={['Home', 'Settings', 'Profile']} selected={ this.state.selected } setSelected={ this.setSelected }>
            <Tab isSelected={ this.state.selected === 'Home' }>
              <p>Some test text</p>
            </Tab>
            <Tab isSelected={ this.state.selected === 'Settings' }>
              <h1>More test text</h1>
            </Tab>
            <Tab isSelected={ this.state.selected === 'Profile' }>
              <ul>
                <li>List test 1</li>
                <li>List test 2</li>
                <li>List test 3</li>
              </ul>
            </Tab>
          </TabNav>
        </div>
      );
    }
  }
  export default App;
