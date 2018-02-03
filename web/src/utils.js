import _sortBy from 'lodash/sortBy';
import _orderBy from 'lodash/orderBy';
import React from 'react';
import {Button, notification} from 'antd';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {COLORS, muiTheme} from './constants';

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