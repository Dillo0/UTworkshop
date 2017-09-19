import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import ConnectedHome, {Home} from '../src/js/components/Home';
import configureStore from 'redux-mock-store';
import {Provider} from 'react-redux';

import {addInputs, subtractInputs} from '../src/js/actions/calculatorActions';
import {createStore} from 'redux';
import calculatorReducers from '../src/js/reducers/calculatorReducers';

// Snapshot for Home React Component
describe('HOME Snapshot', () => {
	it('Capturing Snapshot of Home', () => {
		const renderedValue = renderer.create(<Home output={10}/>).toJSON();
		expect(renderedValue).toMatchSnapshot();
	});
});
//*******************************************************************************************************
describe('HOME Shallow Render REACT COMPONENTS', () => {
	let wrapper;
	const output = 10;

	beforeEach(() => {
		wrapper = shallow(<Home output={output}/>);
	});

	it('Render the HOME component', () => {
		expect(wrapper.length).toEqual(1);
	});

	it('Contains header - h2', () => {
		expect(wrapper.contains(<h2>using React and Redux</h2>)).toBe(true);
	});
	it('h2 header value ', () => {
		expect(wrapper.find('h2').get(0).props.children).toBe("using React and Redux");
	});
	it('Contains input1', () => {
		expect(wrapper.find('input').at(0)
			.equals(<input type="text" placeholder="Input 1" ref="input1"></input>))
			.toBe(true);
	});
	it('Contains input2', () => {
		expect(wrapper.find('input').at(1)
			.equals(<input type="text" placeholder="Input 2" ref="input2"></input>))
			.toBe(true);
	});
	it('Contains output', () => {
		expect(wrapper.find('input[placeholder="Output"]').prop('value')).toEqual(output);
	});
	it('Contains button with id="add"', () => {
		expect(wrapper.find('button#add').type()).toEqual('button');
	});
	it('Contains button with id="subtract"', () => {
		expect(wrapper.find('button#subtract').type()).toEqual('button');
	});
	it('Validate addition of numbers', () => {
		expect(wrapper.instance().handleAdd(1, 1)).toEqual(2);
	});
	it('Validate subtraction of numbers', () => {
		expect(wrapper.instance().handleSubtr(1, 1)).toEqual(0);
	});
});

//*******************************************************************************************************
describe('Home REACT-REDUX (Shallow + passing the {store} directly)', () => {
	const initialState = {output: 100};
	const mockStore = configureStore();
	let store, container;

	beforeEach(() => {
		store = mockStore(initialState);
		container = shallow(<ConnectedHome store={store}/>);
	});

	it('Render the connected(SMART) component', () => {
		expect(container.length).toEqual(1);
	});

	it('Check Prop matches with initialState', () => {
		expect(container.prop('output')).toEqual(initialState.output);
	});
});

//*******************************************************************************************************
describe('HOME REACT-REDUX (Mount + wrapping in < Provider >)', () => {
	const initialState = {output: 10};
	const mockStore = configureStore();
	let store, wrapper;

	beforeEach(() => {
		store = mockStore(initialState);
		wrapper = mount(<Provider store={store}><ConnectedHome /></Provider>);
	});

	it('Contains header - h2', () => {
		expect(wrapper.contains(<h2>using React and Redux</h2>)).toBe(true);
	});

	it('Render the connected(SMART) component', () => {
		expect(wrapper.find(ConnectedHome).length).toEqual(1);
	});

	it('Check Prop matches with initialState', () => {
		expect(wrapper.find(Home).prop('output')).toEqual(initialState.output);
	});

	it('Check action on dispatching ', () => {
		let action;
		store.dispatch(addInputs(500));
		store.dispatch(subtractInputs(100));
		action = store.getActions();
		expect(action[0].type).toBe("ADD_INPUTS");
		expect(action[1].type).toBe("SUBTRACT_INPUTS");
	});

});
//*******************************************************************************************************
describe('HOME REACT-REDUX (actual Store + reducers) more of Integration Testing', () => {
	const initialState = {output: 10};
	let store, wrapper;

	beforeEach(() => {
		store = createStore(calculatorReducers);
		wrapper = mount(<Provider store={store}><ConnectedHome /></Provider>);
	});

	it('Check Prop matches with initialState', () => {
		store.dispatch(addInputs(500));
		expect(wrapper.find(Home).prop('output')).toBe(500);
	});

});
//*******************************************************************************************************
