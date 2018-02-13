import _sortBy from 'lodash/sortBy';
import _orderBy from 'lodash/orderBy';
import React from 'react';
import {Button, Modal, notification} from 'antd';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {COLORS, muiTheme} from './constants';




export const formatVotes = (votes, user_id) => {
	const obj = {
		up: 0,
		down: 0,
		meh: 0,
		user_vote: null,
	}

	votes.forEach(v => {
		if (v.value === 1) {obj.up++}
		else if (v.value === -1) {obj.down++}
		else if (v.value === 0) {obj.meh++}
		if (user_id && v.owner.id === user_id) {
			obj.user_vote = v.value;
		}
	})

	return obj;
}




export const openNotification = (config) => {
	let c = config;
	const key = `open${Date.now()}`;
	c.key = key;
	if (c.onButtonClick) {
		 // const btn = (
	  //   <Button 
	  //   	type="primary" 
	  //   	size="small" 
	  //   	icon={c.icon || ''}
	  //   	onClick={() => {
	  //   		c.onButtonClick();
	  //   		notification.close(key);
	  //   	}}>
	  //     {c.buttonText}
	  //   </Button>
  	// )
  	const btn = (
  		<MuiThemeProvider muiTheme={muiTheme}>
	    <RaisedButton 
	    	fullWidth={true}
	    	backgroundColor={COLORS.reactBlue}
	    	labelStyle={{color: COLORS.blackGray}}
	    	label={c.buttonText}
	    	onClick={() => {
	    		c.onButtonClick();
	    		notification.close(key);
	    	}} />
	    </MuiThemeProvider>
  	)
		c.btn = btn;
	}

	notification.open({
    message: c.message,
    description: c.description,
    btn: c.btn,
    key: c.key,
    onClose: c.onClose,
    duration: c.duration || 5,
    placement: c.placement || 'topRight',
    style: c.style || {},
  })
}



// info, success, error, warning
export const openModal = (config = {}) => {
	const c = config;
	Modal.error({
		title: c.title,
		content: c.content,
		onOk: c.onOk,
	})
}



// return true if user in stack
// else return false
export const isUserInStack = (user_id, stackEntries) => {
	for (var i = 0; i < stackEntries.length; i++) {
		const se = stackEntries[i];
		if (se.owner_id === user_id) {
			return true;
		}
	}
	return false;
}


export const sortStack = (stackEntries) => {
	
	let pending = [];
	let open = [];
	let closed = [];
	
	stackEntries.forEach(se => {
		if (se.status === 'PENDING') {
			pending.push(se);
		}
		else if (se.status === 'OPEN') {
			open.push(se);
		}
		else if (se.status === 'CLOSED') {
			closed.push(se);
		}
		else {
			throw new Error('status unknown: ', se.status)
		}
	})
	let parts = [pending, open, closed]
	parts.forEach((arr, index) => {
		const tmp = _sortBy(arr, [(item) => {return item.created_on}])
		parts[index] = tmp;
	})

	const result = open.concat(pending, closed);
	return result;
}